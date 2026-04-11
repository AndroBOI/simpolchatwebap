"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

interface Message {
  text: string;
  sender: string;
  timestamp?: number;
}

const Home = () => {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [myUsername, setMyUsername] = useState<string>("");

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current?.emit("message", {
      data: message,
    });
    setMessage("");
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("asisgned-name", (assignedName: string) => {
      console.log("Server assigned me name:", assignedName);
      setMyUsername(assignedName);
    });


    socket.on("all-users", (userList: string[]) => {
      setUsers(userList);
    });


    socket.on("message", (messageObj: Message) => {
      console.log("Received message:", messageObj);
      setMessages((prev) => [...prev, messageObj]);
    });


    return () => {
      socket.off("assigned-name");
      socket.off("all-users");
      socket.off("message");
    };
  }, [socketRef]);

  return (
    <div>
      <div className="p-2 bg-green-100 m-2 rounded">
        Your name: <strong>{myUsername || "Connecting..."}</strong>
      </div>
      

      <div className="p-4 border-b">
        <h3 className="font-bold">Online Users ({users.length})</h3>
        {users?.map((user, i) => (
          <div key={i}>
            {user} {user === myUsername && "(You)"}
          </div>
        ))}
      </div>

      <div className="flex flex-col p-5 gap-y-4">
        <div className="flex gap-x-4">
          <Input
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Submit</Button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages?.map((msg, i) => (
            <div 
              key={i} 
              className={`p-2 rounded ${
                msg.sender === myUsername 
                  ? 'bg-blue-100 ml-8 text-right' 
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="text-xs text-gray-500">{msg.sender}</div>
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;