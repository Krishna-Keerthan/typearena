"use client";

import Room from "@/components/Room";

const TestPage = () => {
  // Static test values
  const roomId = "test-room-123";
  const username = "krishna";

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Testing Room Component</h1>
      <Room roomId={roomId} username={username} />
    </div>
  );
};

export default TestPage;
