"use client";
import { useState, useEffect } from "react";

export default function TypeArea({ socket, roomId }: any) {
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time === 0) {
      socket.emit("end-typing", roomId);
    }
  }, [time]);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setInput(value);

    // Simple WPM, Accuracy calculation (mocked)
    const words = value.trim().split(/\s+/).length;
    const wpm = Math.round(words / ((60 - time) / 60 || 1));
    const accuracy = Math.max(90, 100 - Math.floor(Math.random() * 10));

    socket.emit("update-stats", { roomId, stats: { wpm, accuracy, speed: wpm * 5 } });
  };

  return (
    <div className="border p-4 rounded mt-4">
      <h3>Time left: {time}s</h3>
      <textarea
        className="w-full border p-2 mt-2"
        value={input}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}
