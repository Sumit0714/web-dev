import { io } from "socket.io-client";

// Same-origin: in dev Vite proxies /socket.io to :8080, in production Express
// serves this app, so no URL is needed.
export const socket = io({ autoConnect: false, transports: ["websocket"] });

// Promise wrapper around socket.emit(..., ack)
export const request = (event, payload) =>
  new Promise((resolve) => {
    socket.timeout(5000).emit(event, payload, (err, res) => {
      resolve(err ? { ok: false, error: "Server did not respond" } : res);
    });
  });
