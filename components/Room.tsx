"use client";
import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import ChatBox from "@/components/chatbox";
import LeaderBox from "@/components/leaderboard";
import TypeArea from "@/components/typearea";

interface RoomProps {
  roomId: string;
  username: string;
}

export default function Room({ roomId, username }: RoomProps) {
  const [phase, setPhase] = useState<"chat" | "typing" | "result">("chat");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([]);
  const socket = initSocket();

  useEffect(() => {
    socket.emit("join-room", { roomId, username });

    socket.on("chat-update", setChat);
    socket.on("leaderboard-update", setLeaderboard);
    socket.on("typing-started", () => setPhase("typing"));
    socket.on("competition-ended", (board) => {
      setLeaderboard(board);
      setPhase("result");
    });
    socket.on("room-ended", () => {
      alert("Room ended");
      setPhase("chat");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      {phase === "chat" && <ChatBox socket={socket} roomId={roomId} chat={chat} />}
      {phase === "typing" && <TypeArea socket={socket} roomId={roomId} />}
      <LeaderBox leaderboard={leaderboard} />
      {phase === "result" && (
        <button
          className="bg-red-500 text-white p-2 rounded mt-4"
          onClick={() => socket.emit("end-room", roomId)}
        >
          End Room
        </button>
      )}
    </div>
  );
}
