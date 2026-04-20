"use client";
import { User } from "@/types";

export default function ChatWrapper({ user }: { user: User }) {
  return (
    <div>
      <h1>Chat with {user.email}</h1>
    </div>
  );
}
