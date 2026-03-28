"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

const Home = () => {
  const socketRef = useSocket();
  const [data, setData] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current?.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.on("all-users", (userList) => {
      setUsers(userList);
    });

    socket.on("connect", () => {
      console.log("Connected: ", socket.id);
      socket.emit("register", `user - ${socket.id}`);
    });

    socket.on("message", (value) => {
      setData((prev) => [...prev, value]);
    });

    return () => {
      socket.off("connect");
    };
  }, [socketRef]);

  return (
    <div>
      <div>
        {users?.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
      <div className="flex flex-col p-5 gap-y-4">
        <div className="flex gap-x-4">
          <Input
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Submit</Button>
        </div>

        <div>
          {data?.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
