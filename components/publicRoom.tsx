'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRoom } from '@/context/roomContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteRoomButton from '@/components/room/DeleteRoomButton';
import JoinRoomButton from '@/components/room/JoinRoomButton';

interface Room {
  id: string;
  name: string;
  code: string;
  mode: string;
  mondeOption: string;
}

interface PublicRoomProps {
  rooms: Room[];
}

const PublicRoom = ({ rooms }: PublicRoomProps) => {
  const { data: session } = useSession();
  const { currentRoom, isConnected } = useRoom();

  return (
    <div className="bg-card border shadow-[inset_0_0_2px_rgba(255,255,255,0.05)] rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-purple-400 text-xl">#</span>
        <h3 className="text-white text-lg font-medium">Your Rooms</h3>
        {currentRoom && (
          <span className="text-green-400 text-sm">
            (Connected to: {currentRoom.name})
          </span>
        )}
      </div>

      {rooms.length > 0 ? (
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

              <div className="flex gap-3">
                <JoinRoomButton room={room} />
                <DeleteRoomButton room={room} />
              </div>
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
