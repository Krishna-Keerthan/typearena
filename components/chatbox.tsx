"use client";
import { useState } from "react";

export default function ChatBox({ socket, roomId, chat }: any) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat-message", { roomId, sender: "Me", message });
      setMessage("");
    }
  };

  return (
    <div className="border p-2 rounded bg-gray-100">
      <div className="h-40 overflow-y-auto">
        {chat.map((c: any, i: number) => (
          <div key={i}><b>{c.sender}:</b> {c.message}</div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="border p-1 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-3" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
