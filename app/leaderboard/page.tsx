import React from 'react';

// TypeScript interface for User data
interface User {
  id: string;
  username: string;
  wpm: number;
  speed: number;
  accuracy: number;
  points: number;
}

// Interface for component props (for future extensibility)
interface LeaderboardProps {
  limit?: number; // Optional limit for number of users to display
  className?: string; // Optional custom CSS classes
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  limit, 
  className = '' 
}) => {
  // TODO: Replace this dummy data with Prisma query
  // Example: const users = await prisma.user.findMany({
  //   orderBy: { points: 'desc' },
  //   take: limit,
  //   select: {
  //     id: true,
  //     username: true,
  //     wpm: true,
  //     speed: true,
  //     accuracy: true,
  //     points: true,
  //   }
  // });
  
  const dummyUsers: User[] = [
    {
      id: '1',
      username: 'SpeedDemon92',
      wpm: 145,
      speed: 145,
      accuracy: 98.5,
      points: 2890
    },
    {
      id: '2',
      username: 'KeyboardNinja',
      wpm: 132,
      speed: 132,
      accuracy: 99.2,
      points: 2756
    },
    {
      id: '3',
      username: 'TypeMaster',
      wpm: 128,
      speed: 128,
      accuracy: 97.8,
      points: 2512
    },
    {
      id: '4',
      username: 'QuickFingers',
      wpm: 125,
      speed: 125,
      accuracy: 96.5,
      points: 2387
    },
    {
      id: '5',
      username: 'RapidTypist',
      wpm: 118,
      speed: 118,
      accuracy: 98.1,
      points: 2298
    },
    {
      id: '6',
      username: 'FlashType',
      wpm: 112,
      speed: 112,
      accuracy: 95.7,
      points: 2145
    },
    {
      id: '7',
      username: 'SwiftKeys',
      wpm: 108,
      speed: 108,
      accuracy: 97.3,
      points: 2089
    },
    {
      id: '8',
      username: 'TurboTyper',
      wpm: 105,
      speed: 105,
      accuracy: 94.8,
      points: 1987
    }
  ];

  // Sort users by points in descending order and apply limit if specified
  const sortedUsers = dummyUsers
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);

  // Helper function to get rank badge styling
  const getRankBadge = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100';
      default:
        return 'bg-[#1a1f2e] text-[#8892b0] border border-[#4fd1c7]/20';
    }
  };

  // Helper function to format accuracy as percentage
  const formatAccuracy = (accuracy: number): string => {
    return `${accuracy.toFixed(1)}%`;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#e6f1ff] mb-2">
          Leaderboard
        </h2>
        <p className="text-[#8892b0]">
          Top performers ranked by total points
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-hidden border border-[#4fd1c7]/10">
        {/* Table Header */}
        <div className="bg-[#0f1419] px-6 py-4 border-b border-[#4fd1c7]/20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 font-semibold text-[#00d9b7] text-sm uppercase tracking-wide">
            <div className="flex items-center">Rank</div>
            <div className="flex items-center">Username</div>
            <div className="hidden md:flex items-center">WPM</div>
            <div className="hidden md:flex items-center">Speed</div>
            <div className="hidden md:flex items-center">Accuracy</div>
            <div className="flex items-center justify-end md:justify-start">Points</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#4fd1c7]/10">
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            return (
              <div
                key={user.id}
                className={`
                  px-6 py-4 transition-all duration-200 hover:bg-[#22d3ee]/5
                  ${index % 2 === 0 ? 'bg-[#1a1f2e]' : 'bg-[#0f1419]/50'}
                `}
              >
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                  {/* Rank */}
                  <div className="flex items-center">
                    <span
                      className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                        ${getRankBadge(rank)}
                      `}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Username */}
                  <div className="flex items-center">
                    <span className="font-medium text-[#e6f1ff] truncate">
                      {user.username}
                    </span>
                  </div>

                  {/* WPM - Hidden on mobile */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#4fd1c7] font-semibold">
                      {user.wpm}
                    </span>
                  </div>

                  {/* Speed - Hidden on mobile */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#8892b0]">
                      {user.speed}
                    </span>
                  </div>

                  {/* Accuracy - Hidden on mobile */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#8892b0]">
                      {formatAccuracy(user.accuracy)}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-end md:justify-start">
                    <span className="text-[#00d9b7] font-bold text-lg">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Mobile-only additional info */}
                <div className="md:hidden mt-3 pt-3 border-t border-[#4fd1c7]/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8892b0]">
                      WPM: <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span>
                    </span>
                    <span className="text-[#8892b0]">
                      Speed: <span className="text-[#e6f1ff]">{user.speed}</span>
                    </span>
                    <span className="text-[#8892b0]">
                      Accuracy: <span className="text-[#e6f1ff]">{formatAccuracy(user.accuracy)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer - Placeholder for pagination */}
        <div className="bg-[#0f1419] px-6 py-4 border-t border-[#4fd1c7]/20">
          <div className="flex justify-between items-center text-sm text-[#8892b0]">
            <span>Showing {sortedUsers.length} users</span>
            {/* TODO: Add pagination controls here when needed */}
            <span>Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;