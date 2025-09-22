'use client';

import React, { useEffect, useState } from 'react';
import { getRoomByUserId } from '@/actions/room'; 
import { useSession } from 'next-auth/react';

interface PublicRoomData {
  id: string;
  name: string;
  code: string;
  mode: string;
  mondeOption: string;
}

const PublicRoom = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const [rooms, setRooms] = useState<PublicRoomData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!userId) return;
      setIsLoading(true);
      const result = await getRoomByUserId(userId);
      if (result?.success) {
        setRooms(result.data);
      }
      setIsLoading(false);
    };
    fetchRooms();
  }, [userId]);

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
    // TODO: implement join logic
  };

  return (
    <div className="bg-card border shadow-[inset_0_0_2px_rgba(255,255,255,0.05)] rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-purple-400 text-xl">#</span>
        <h3 className="text-white text-lg font-medium">Your Rooms</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-center">Loading rooms...</p>
        </div>
      ) : rooms.length > 0 ? (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex flex-col">
                <h4 className="text-white font-medium">{room.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Code: {room.code}</span>
                  <span className="capitalize">Mode: {room.mode}</span>
                  <span>Option: {room.mondeOption}</span>
                </div>
              </div>

              <button
                onClick={() => handleJoinRoom(room.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-center">No rooms found</p>
        </div>
      )}
    </div>
  );
};

export default PublicRoom;
