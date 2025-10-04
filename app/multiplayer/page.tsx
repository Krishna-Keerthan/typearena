
import { Suspense } from 'react';
import CreateRoom from '@/components/createRoom';
import JoinRoom from '@/components/joinRoom';
import PublicRoomServer from '@/components/publicRoom/PublicRoom';
import { authOptions } from '@/lib/nextauth-options';
import { getServerSession } from 'next-auth';

const MultiplayerArena = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session.user.id;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 pt-20 sm:pt-24">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Multiplayer Arena</h1>

        {/* Create Room and Join Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CreateRoom />
          <JoinRoom />
        </div>

        {/* Public Room Section (streamed) */}
        <div className="w-full">
          <Suspense fallback={<div className="bg-card rounded-lg p-6 text-gray-400 text-center">Loading your rooms...</div>}>
            <PublicRoomServer userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerArena;