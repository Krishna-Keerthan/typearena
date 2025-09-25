'use client';

import { getRoomByCode } from '@/actions/room';
import { useRoom } from '@/context/roomContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { joinRoom } = useRoom();
  const { data: session } = useSession();
  const username = session?.user?.name;
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code.');
      return;
    }
    if (!username) {
      toast.error('You must be logged in to join a room.');
      return;
    }

    try {
      setLoading(true);
      const result = await getRoomByCode(roomCode);

      if (result?.success) {
        const { id, name } = result.data;
        await joinRoom(id, name, username);

        toast.success('Room joined successfully');
        router.push(`/multiplayer/room/${roomCode}`);
      } else {
        toast.error(result?.message ?? 'Invalid room code.');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4 border shadow-[inset_0_0_2px_rgba(255,255,255,0.05)]">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-cyan-400 text-xl">→</span>
        <h3 className="text-white text-lg font-medium">Join Room</h3>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-md border focus:border-cyan-400 focus:outline-none"
          placeholder="Room Code"
        />

        <button
          onClick={handleJoinRoom}
          disabled={!roomCode.trim() || loading}
          className="w-full bg-cyan-400 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
        >
          {loading ? 'Joining...' : '→ Join Room'}
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
