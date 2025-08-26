'use client';

import React, { useState, useEffect } from 'react';
import CreateRoom from '@/components/createRoom';
import JoinRoom from '@/components/joinRoom';
import PublicRoom from '@/components/publicRoom';

// Mock data for demonstration
const mockPublicRooms = [
  {
    id: '1',
    name: 'Speed Demons',
    players: 3,
    maxPlayers: 6,
    gameMode: 'words',
    status: 'waiting' as const,
  },
  {
    id: '2',
    name: 'Quick Typers',
    players: 2,
    maxPlayers: 4,
    gameMode: 'time',
    status: 'playing' as const,
  },
];

interface RoomData {
  roomName: string;
  gameMode: string;
  wordCount: string;
}

const MultiplayerArena: React.FC = () => {
  const [publicRooms, setPublicRooms] = useState(mockPublicRooms);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading public rooms
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateRoom = (roomData: RoomData) => {
    console.log('Creating room:', roomData);
    // Add your room creation logic here
    // Example: redirect to room or show success message
  };

  const handleJoinRoom = (roomCode: string) => {
    console.log('Joining room with code:', roomCode);
    // Add your room joining logic here
    // Example: validate room code and redirect
  };

  const handleJoinPublicRoom = (roomId: string) => {
    console.log('Joining public room:', roomId);
    // Add your public room joining logic here
    // Example: redirect to the selected public room
  };

  return (
    <div className="min-h-screen bg-background p-6">
      
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">Multiplayer Arena</h1>
        
        {/* Create Room and Join Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CreateRoom onCreateRoom={handleCreateRoom} />
          <JoinRoom onJoinRoom={handleJoinRoom} />
        </div>
        
        {/* Public Room Section */}
        <div className="w-full">
          <PublicRoom 
            rooms={publicRooms}
            onJoinPublicRoom={handleJoinPublicRoom}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiplayerArena;