'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/context/roomContext';
import { useSession } from 'next-auth/react';

interface Room {
  id: string;
  name: string;
  code: string;
}

const JoinRoomButton = ({ room }: { room: Room }) => {
  const { joinRoom, currentRoom, isConnected } = useRoom();
  const router = useRouter();
  const {data:session}= useSession()
  const username = session?.user.name
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    try {
    if(!username) return null
      await joinRoom(room.id, room.name, username); 
      router.push(`/multiplayer/room/${room.code}`);
    } finally {
      setJoining(false);
    }
  };

  const isCurrent = currentRoom?.id === room.id && isConnected;

  return (
    <button
      onClick={handleJoin}
      disabled={joining || isCurrent}
      className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
        isCurrent
          ? 'bg-green-600 text-white cursor-not-allowed'
          : joining
          ? 'bg-gray-600 text-white cursor-not-allowed'
          : 'bg-purple-600 hover:bg-purple-700 text-white'
      }`}
    >
      {joining ? 'Joining...' : isCurrent ? 'Connected' : 'Join'}
    </button>
  );
};

export default JoinRoomButton;
