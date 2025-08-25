'use client';

import React, { useState } from 'react';

interface JoinRoomProps {
  onJoinRoom?: (roomCode: string) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState<string>('');

  const handleJoinRoom = () => {
    if (roomCode.trim() && onJoinRoom) {
      onJoinRoom(roomCode.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-cyan-400 text-xl">→</span>
        <h3 className="text-white text-lg font-medium">Join Room</h3>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full bg-gray-700 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-cyan-400 focus:outline-none"
          placeholder="Room Code"
        />
        
        <button 
          onClick={handleJoinRoom}
          disabled={!roomCode.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
        >
          → Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;