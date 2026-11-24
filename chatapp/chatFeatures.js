// chatFeatures.js
// ---------------------------------------------------------------------------
// EXTRA FEATURES added on top of the original backend (server.js is untouched
// except for one line that loads this file).
//
//   * Display names
//   * A public "Lobby" everyone joins
//   * Real chat messages (the original server had no message relay)
//   * Personal rooms: anyone can create one, get a share code, and any number
//     of users can join it with that code
//   * Member lists, join/leave notices, typing indicators
//   * Serves the built React frontend (client/dist) from the same port
//
// Socket events (client -> server)           Ack / reply
//   user:set      { name }                   { ok, id, name, room, history }
//   room:create   { name }                   { ok, room, history }
//   room:join     { code }                   { ok, room, history }
//   room:leave    { roomId }                 { ok }
//   message:send  { roomId, text }           { ok }
//   typing        { roomId, isTyping }
//
// Socket events (server -> client)
//   message:new   { id, roomId, userId, user, text, ts, system }
//   room:members  { roomId, members: [{ id, name }] }
//   typing        { roomId, user, isTyping }
// ---------------------------------------------------------------------------
const path = require("path");
const crypto = require("crypto");
const express = require("express");

const LOBBY = "lobby";
const MAX_HISTORY = 100; // messages remembered per room (in memory only)
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion

module.exports = function setupChat(io, app) {
  /** roomId -> { id, name, permanent, owner, history[], members: Map(socketId -> name) } */
  const rooms = new Map();
  rooms.set(LOBBY, {
    id: LOBBY,
    name: "Lobby",
    permanent: true,
    owner: null,
    history: [],
    members: new Map(),
  });

  // Serve the production build of the React app (run `npm run build` first)
  app.use(express.static(path.join(__dirname, "client", "dist")));

  // ---------- helpers ----------
  const oneLine = (s, max) =>
    String(s ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  const multiLine = (s, max) =>
    String(s ?? "")
      .replace(/\r/g, "")
      .trim()
      .slice(0, max);

  const makeCode = () => {
    let code;
    do {
      code = Array.from(
        { length: 6 },
        () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)],
      ).join("");
    } while (rooms.has(code));
    return code;
  };

  const publicRoom = (room) => ({
    id: room.id,
    name: room.name,
    personal: !room.permanent,
    owner: room.owner,
    members: membersOf(room),
  });

  const membersOf = (room) =>
    [...room.members].map(([id, name]) => ({ id, name }));

  const broadcastMembers = (room) =>
    io.to(room.id).emit("room:members", {
      roomId: room.id,
      members: membersOf(room),
    });

  const addMessage = (room, msg) => {
    const full = {
      id: crypto.randomUUID(),
      roomId: room.id,
      ts: Date.now(),
      system: false,
      ...msg,
    };
    room.history.push(full);
    if (room.history.length > MAX_HISTORY) room.history.shift();
    io.to(room.id).emit("message:new", full);
    return full;
  };

  const systemMessage = (room, text) =>
    addMessage(room, { system: true, text, userId: null, user: null });

  const joinRoom = (socket, room) => {
    if (room.members.has(socket.id)) return;
    const name = socket.data.name;
    // Announce BEFORE joining so the joiner gets it through `history`, not twice
    systemMessage(room, `${name} joined`);
    socket.join(room.id);
    room.members.set(socket.id, name);
    socket.data.rooms.add(room.id);
    broadcastMembers(room);
  };

  const leaveRoom = (socket, room) => {
    if (!room.members.has(socket.id)) return;
    const name = room.members.get(socket.id);
    socket.leave(room.id);
    room.members.delete(socket.id);
    socket.data.rooms.delete(room.id);
    if (!room.permanent && room.members.size === 0) {
      rooms.delete(room.id); // personal rooms vanish when the last person leaves
      return;
    }
    systemMessage(room, `${name} left`);
    broadcastMembers(room);
  };

  // ---------- socket handlers ----------
  io.on("connection", (socket) => {
    socket.data.name = null;
    socket.data.rooms = new Set();

    const needName = (reply) => {
      if (!socket.data.name) {
        reply({ ok: false, error: "Set your name first" });
        return true;
      }
      return false;
    };

    socket.on("user:set", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      const name = oneLine(payload?.name, 20);
      if (!name) return reply({ ok: false, error: "Please enter a name" });
      if (socket.data.name)
        return reply({ ok: false, error: "Name already set" });

      socket.data.name = name;
      const lobby = rooms.get(LOBBY);
      joinRoom(socket, lobby);
      reply({
        ok: true,
        id: socket.id,
        name,
        room: publicRoom(lobby),
        history: lobby.history,
      });
    });

    socket.on("room:create", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      if (needName(reply)) return;
      const name = oneLine(payload?.name, 30) || `${socket.data.name}'s room`;
      const id = makeCode();
      const room = {
        id,
        name,
        permanent: false,
        owner: socket.data.name,
        history: [],
        members: new Map(),
      };
      rooms.set(id, room);
      joinRoom(socket, room);
      reply({ ok: true, room: publicRoom(room), history: room.history });
    });

    socket.on("room:join", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      if (needName(reply)) return;
      const code = oneLine(payload?.code, 12).toUpperCase();
      const room = rooms.get(code) || rooms.get(code.toLowerCase());
      if (!room) return reply({ ok: false, error: "No room with that code" });
      joinRoom(socket, room);
      reply({ ok: true, room: publicRoom(room), history: room.history });
    });

    socket.on("room:leave", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      const room = rooms.get(payload?.roomId);
      if (!room) return reply({ ok: false, error: "Room not found" });
      if (room.permanent)
        return reply({ ok: false, error: "Can't leave the Lobby" });
      leaveRoom(socket, room);
      reply({ ok: true });
    });

    socket.on("message:send", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      if (needName(reply)) return;
      const room = rooms.get(payload?.roomId);
      if (!room || !room.members.has(socket.id))
        return reply({ ok: false, error: "You're not in that room" });
      const text = multiLine(payload?.text, 1000);
      if (!text) return reply({ ok: false, error: "Empty message" });
      addMessage(room, { userId: socket.id, user: socket.data.name, text });
      reply({ ok: true });
    });

    socket.on("typing", (payload) => {
      const room = rooms.get(payload?.roomId);
      if (!room || !room.members.has(socket.id)) return;
      socket.to(room.id).emit("typing", {
        roomId: room.id,
        user: socket.data.name,
        isTyping: !!payload.isTyping,
      });
    });

    socket.on("disconnect", () => {
      for (const id of [...socket.data.rooms]) {
        const room = rooms.get(id);
        if (room) leaveRoom(socket, room);
      }
    });
  });
};
