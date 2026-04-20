"use client";
import { useState } from "react";
import Link from "next/link";
import { User } from "@/types";
interface ChatClientProps {
  initialUsers: User[];
}

export default function ChatClient({ initialUsers }: ChatClientProps) {
  const [users] = useState(initialUsers);

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r">
        <h2 className="p-4 font-bold">Users ({users.length})</h2>
        <div className="flex flex-col">
          {users.map((user: User) => (
            <Link
              href={`/chat/${user.id}`}
              key={user.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              {user.email}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
