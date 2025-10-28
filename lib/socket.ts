import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000"); // replace with deployed WebSocket server
  }
  return socket;
};
