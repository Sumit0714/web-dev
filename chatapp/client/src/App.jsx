import { useEffect, useReducer, useRef, useState, useCallback } from "react";
import { socket, request } from "./socket.js";
import { reducer, initialState } from "./reducer.js";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatPane from "./components/ChatPane.jsx";
import RoomModal from "./components/RoomModal.jsx";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [me, setMe] = useState(null); // { id, name }
  const [connected, setConnected] = useState(false);
  const [modal, setModal] = useState(null); // "create" | "join" | null
  const [navOpen, setNavOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [toast, setToast] = useState(null);

  // Refs so socket callbacks always see the latest values
  const nameRef = useRef(null);
  const roomIdsRef = useRef([]);
  roomIdsRef.current = state.order;

  const showToast = useCallback((text) => {
    setToast(text);
    setTimeout(() => setToast((t) => (t === text ? null : t)), 3000);
  }, []);

  // ---- socket wiring ----
  useEffect(() => {
    const onConnect = async () => {
      setConnected(true);
      // After a reconnect the server has forgotten us: log in and rejoin rooms
      if (nameRef.current) {
        const res = await request("user:set", { name: nameRef.current });
        if (res.ok) {
          setMe({ id: res.id, name: res.name });
          dispatch({ type: "JOINED", room: res.room, history: res.history });
          for (const id of roomIdsRef.current.filter((r) => r !== "lobby")) {
            const j = await request("room:join", { code: id });
            if (j.ok) dispatch({ type: "JOINED", room: j.room, history: j.history });
            else dispatch({ type: "LEFT", id });
          }
        }
      }
    };
    const onDisconnect = () => setConnected(false);

    // Messages from the ORIGINAL backend events
    const onWelcome = (msg) => showToast(msg);               // "gyankibaat"
    const onJoin = (msg) => showToast(msg);                  // "join"
    const onAnnouncement = (msg) => setAnnouncement(msg);    // "announcement"

    // New chat events
    const onMessage = (msg) => dispatch({ type: "MESSAGE", msg });
    const onMembers = (p) => dispatch({ type: "MEMBERS", ...p });
    const onTyping = (p) => {
      const at = Date.now();
      dispatch({ type: "TYPING", ...p, at });
      if (p.isTyping)
        setTimeout(
          () => dispatch({ type: "TYPING", roomId: p.roomId, user: p.user, isTyping: false, onlyIfAt: at }),
          3500
        );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gyankibaat", onWelcome);
    socket.on("join", onJoin);
    socket.on("announcement", onAnnouncement);
    socket.on("message:new", onMessage);
    socket.on("room:members", onMembers);
    socket.on("typing", onTyping);
    socket.connect();
    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [showToast]);

  // ---- actions ----
  const login = async (name) => {
    const res = await request("user:set", { name });
    if (!res.ok) return res.error;
    nameRef.current = res.name;
    setMe({ id: res.id, name: res.name });
    dispatch({ type: "JOINED", room: res.room, history: res.history, activate: true });
    return null;
  };

  const createRoom = async (name) => {
    const res = await request("room:create", { name });
    if (!res.ok) return res.error;
    dispatch({ type: "JOINED", room: res.room, history: res.history, activate: true });
    setModal(null);
    return null;
  };

  const joinRoom = async (code) => {
    const res = await request("room:join", { code });
    if (!res.ok) return res.error;
    dispatch({ type: "JOINED", room: res.room, history: res.history, activate: true });
    setModal(null);
    return null;
  };

  const leaveRoom = async (id) => {
    const res = await request("room:leave", { roomId: id });
    if (res.ok) dispatch({ type: "LEFT", id });
  };

  const send = (roomId, text) => request("message:send", { roomId, text });
  const sendTyping = (roomId, isTyping) => socket.emit("typing", { roomId, isTyping });

  if (!me) return <Login connected={connected} onLogin={login} />;

  const active = state.rooms[state.active];

  return (
    <div className="app">
      {announcement && (
        <div className="banner">
          <span>📢 {announcement}</span>
          <button onClick={() => setAnnouncement(null)} aria-label="Dismiss">×</button>
        </div>
      )}
      <div className={`layout ${navOpen ? "nav-open" : ""}`}>
        <Sidebar
          me={me}
          connected={connected}
          rooms={state.order.map((id) => state.rooms[id])}
          activeId={state.active}
          onSelect={(id) => {
            dispatch({ type: "ACTIVATE", id });
            setNavOpen(false);
          }}
          onCreate={() => setModal("create")}
          onJoin={() => setModal("join")}
        />
        {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}
        {active && (
          <ChatPane
            key={active.id}
            room={active}
            me={me}
            onSend={send}
            onTyping={sendTyping}
            onLeave={() => leaveRoom(active.id)}
            onMenu={() => setNavOpen(true)}
          />
        )}
      </div>
      {modal && (
        <RoomModal
          mode={modal}
          onClose={() => setModal(null)}
          onSubmit={modal === "create" ? createRoom : joinRoom}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
      {!connected && <div className="offline">Reconnecting…</div>}
    </div>
  );
}
