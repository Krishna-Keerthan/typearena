'use client';

import React, { useState } from 'react';

interface CreateRoomProps {
  onCreateRoom?: (roomData: {
    roomName: string;
    gameMode: string;
    wordCount: string;
  }) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState<string>('Test Room');
  const [gameMode, setGameMode] = useState<string>('Words');
  const [wordCount, setWordCount] = useState<string>('25 words');

  const handleCreateRoom = () => {
    if (onCreateRoom) {
      onCreateRoom({
        roomName,
        gameMode,
        wordCount,
      });
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
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none"
          placeholder="Room Name"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="Words">Words</option>
            <option value="Time">Time</option>
            <option value="Quote">Quote</option>
          </select>
          
          <select
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="bg-gray-900 text-white px-4 py-3 rounded-md border border-gray-600 focus:border-green-400 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="10 words">10 words</option>
            <option value="25 words">25 words</option>
            <option value="50 words">50 words</option>
            <option value="100 words">100 words</option>
          </select>
        </div>
        
        <button 
          onClick={handleCreateRoom}
          className="w-full bg-green-400 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
        >
          + Create Room
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;