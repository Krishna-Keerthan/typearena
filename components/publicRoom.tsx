'use client';

import React from 'react';

interface PublicRoomData {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  gameMode: string;
  status: 'waiting' | 'playing' | 'finished';
}

interface PublicRoomProps {
  rooms?: PublicRoomData[];
  onJoinPublicRoom?: (roomId: string) => void;
  isLoading?: boolean;
}

const PublicRoom: React.FC<PublicRoomProps> = ({ 
  rooms = [], 
  onJoinPublicRoom,
  isLoading = false 
}) => {
  const handleJoinRoom = (roomId: string) => {
    if (onJoinPublicRoom) {
      onJoinPublicRoom(roomId);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-purple-400 text-xl">#</span>
        <h3 className="text-white text-lg font-medium">Public Room</h3>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <h4 className="text-white font-medium">{room.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{room.players}/{room.maxPlayers} players</span>
                    <span className="capitalize">{room.gameMode}</span>
                    <span
                      className={`capitalize px-2 py-1 rounded text-xs ${
                        room.status === 'waiting'
                          ? 'bg-green-600 text-white'
                          : room.status === 'playing'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleJoinRoom(room.id)}
                disabled={room.status !== 'waiting' || room.players >= room.maxPlayers}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-center">No public rooms available</p>
        </div>
      )}
    </div>
  );
};

export default PublicRoom;