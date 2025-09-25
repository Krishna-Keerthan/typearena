
import CreateRoom from '@/components/createRoom';
import JoinRoom from '@/components/joinRoom';
import PublicRoom from '@/components/publicRoom';

const MultiplayerArena  = async () => {
  return (
    <div className="min-h-screen bg-background p-6">
      
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">Multiplayer Arena</h1>
        
        {/* Create Room and Join Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CreateRoom />
          <JoinRoom  />
        </div>
        
        {/* Public Room Section */}
        <div className="w-full">
          <PublicRoom />
        </div>
      </div>
    </div>
  );
};

export default MultiplayerArena;