import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const readConversations = new Set<string>();

export const getSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io("http://localhost:3001", {
      auth: { user_id: userId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};
