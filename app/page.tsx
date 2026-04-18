"use client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth-button";
const Page = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <div>{connected ? "Connected" : "Disconnected"}</div>
    </div>
  );
};

export default Page;
