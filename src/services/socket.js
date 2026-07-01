import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token, onData) => {
  if (socket?.connected) return socket;

  if (socket) {
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } catch (err) {
      console.log("❌ OLD SOCKET CLEANUP:", err?.message);
    }
  }

  socket = io("https://api.trackiatech.com", {
    transports: ["websocket"],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 3000,
    reconnectionDelayMax: 10000,
    forceNew: true,
    autoConnect: true,
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ Socket error:", err?.message);
  });

  socket.off("positions");
  socket.on("positions", (data) => {
    if (onData) onData(data);
  });

  socket.off("alert");
  socket.on("alert", (alert) => {
    if (onData) {
      onData({ type: "alert", data: alert });
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  try {
    socket.removeAllListeners();
    socket.disconnect();
  } catch (err) {
    console.log("❌ SOCKET DISCONNECT:", err?.message);
  }
  socket = null;
};