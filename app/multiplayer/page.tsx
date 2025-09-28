
import CreateRoom from '@/components/createRoom';
import JoinRoom from '@/components/joinRoom';
import PublicRoom from '@/components/publicRoom';
import { authOptions } from '@/lib/nextauth-options';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

const MultiplayerArena  = async () => {
  const session =await  getServerSession(authOptions)
  if(!session) return null

  const rooms = await prisma.room.findMany({
    where:{hostId:session.user.id}
  })

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 pt-20 sm:pt-24">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Multiplayer Arena</h1>
        
        {/* Create Room and Join Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CreateRoom />
          <JoinRoom  />
        </div>
        
        {/* Public Room Section */}
        <div className="w-full">
          <PublicRoom rooms={rooms}/>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerArena;