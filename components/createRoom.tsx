'use client';

import { createRoom, getRoomByUserId } from '@/actions/room';
import { RoomData } from '@/types/room';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react';
import { toast } from 'sonner';



const CreateRoom = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [gameMode, setGameMode] = useState<string>('Words');
  const [wordCount, setWordCount] = useState<string>('25 words');
  const { data: session } = useSession()
  const hostId = session?.user.id
  const [isLoading, setIsLoading] = useState(false)


  const handleCreateRoom = async (roomData: RoomData) => {
    try {
      console.log("Creating room:", roomData);
      setIsLoading(true)
      const result = await createRoom(roomData);
      if (!result) {
        return
      }

      if (result.success) {
        setRoomName('')
        toast.success("Room created successfully")
      }

      else {
        toast.error("Failed to created the room")
      }

    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to created the room")
      setIsLoading(false)
    }
    finally {
      setIsLoading(false)
    }
  };


  return (
    <div className="bg-card boder shadow-[inset_0_0_2px_rgba(255,255,255,0.05)] rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-green-400 text-xl">+</span>
        <h3 className="text-white text-lg font-medium">Create Room</h3>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          required
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none"
          placeholder="Room Name"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={gameMode}
            required
            onChange={(e) => setGameMode(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="Words">Words</option>
          </select>

          <select
            value={wordCount}
            required
            onChange={(e) => setWordCount(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="10 words">10 words</option>
            <option value="25 words">25 words</option>
            <option value="50 words">50 words</option>
          </select>
        </div>

        <button
          disabled={isLoading}
          onClick={() => {
            if (!roomName.trim()) {
              toast.error("Room name is required");
              return;
            }
            const roomData: RoomData = {
              roomName: roomName,
              gameMode: gameMode,
              wordCount: wordCount,
              hostId: hostId as string
            };
            handleCreateRoom(roomData);
          }}

          className="w-full bg-green-400 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Creating...
            </span>
          ) : (
            "+ Create Room"
          )}

        </button>
      </div>
    </div>
  );
};

export default CreateRoom;