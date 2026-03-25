"use client";

import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useState, useEffect } from "react";

const Page = () => {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    const onConnect = () => {
      console.log("Connected to server");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socketRef]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onMessage = (data: string) => {
      console.log("Message Received: ", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, [socketRef]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const timer = setTimeout(() => {
      if (socket.connected) {
        setIsConnected(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [socketRef]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (socket && isConnected) {
      const message = `Hello from Nextjs at ${new Date().toLocaleTimeString()}`;
      socket.emit("message", message);
      console.log("Message sent: ", message);
    } else {
      console.log("Socket not connected");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Socket.IO Test</h1>

      <div className="mb-4">
        Status:
        <span
          className={isConnected ? "text-green-500 ml-2" : "text-red-500 ml-2"}
        >
          {isConnected ? "Connected ✅" : "Disconnected ❌"}
        </span>
      </div>

      <div className="mb-4 p-4 border rounded-lg min-h-[200px]">
        <h2 className="font-semibold mb-2">Messages:</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet...</p>
        ) : (
          <ul className="space-y-1">
            {messages.map((msg, idx) => (
              <li key={idx} className="text-sm">
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={sendMessage} disabled={!isConnected}>
        Send Message
      </Button>
    </div>
  );
};

export default Page;
