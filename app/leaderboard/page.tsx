
import prisma from "@/lib/prisma"

const displayDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}



const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "px-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-bold rounded-full shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-200"
    case "medium":
      return "px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-sm font-bold rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
    case "hard":
      return "px-4 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-bold rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition-all duration-200"
    default:
      return "px-4 py-1 bg-gray-500 text-white text-sm font-bold rounded-full shadow-md"
  }
}

const getRankBadge = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900"
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900"
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100"
    default:
      return "bg-[#1a1f2e] text-[#8892b0] border border-[#4fd1c7]/20"
  }
}

interface LeaderboardEntry {
  id: string
  wpm: number
  difficulty: string
  points: number
  user: {
    id: string
    name: string | null
    updatedAt: Date
  }
}

export default async function Leaderboard() {

  const leaderboard: LeaderboardEntry[] = await prisma.leaderBoard.findMany({
    take: 20,
    orderBy: [
      { points: "desc" }
    ],
    include: { user: true},
  })

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#e6f1ff] mb-2">Leaderboard</h2>
        <p className="text-sm sm:text-base text-[#8892b0]">Top performers ranked by WPM and points</p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-hidden border border-[#4fd1c7]/10">
        {/* Table Header */}
        <div className="bg-[#0f1419] px-4 sm:px-6 py-3 sm:py-4 border-b border-[#4fd1c7]/20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 font-semibold text-[#00d9b7] text-xs sm:text-sm uppercase tracking-wide">
            <div className="flex items-center">Rank</div>
            <div className="flex items-center">Name</div>
            <div className="hidden md:flex items-center">WPM</div>
            <div className="hidden md:flex items-center">Points</div>
            <div className="hidden md:flex items-center">Date</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#4fd1c7]/10">
          {leaderboard.map((user, index) => {
            const rank = index + 1
            return (
              <div
                key={user.id}
                className={`px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 hover:bg-[#22d3ee]/5 ${
                  index % 2 === 0 ? "bg-[#1a1f2e]" : "bg-[#0f1419]/50"
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-center">
                  {/* Rank */}
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${getRankBadge(rank)}`}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Username */}
                  <div className="flex items-center">
                    <span className="font-medium text-[#e6f1ff] truncate text-sm sm:text-base">
                      {user.user.name}
                    </span>
                  </div>

                  {/* WPM */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span>
                  </div>

                  {/* Points */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#e6f1ff] font-semibold">{user.points}</span>
                  </div>
                  <div className="hidden md:flex items-center">
                    <span className="text-[#e6f1ff] font-semibold">
                    {displayDate(user.user.updatedAt)}
                    </span>
                  </div>


                </div>

                {/* Mobile-only additional info */}
                <div className="md:hidden mt-3 pt-3 border-t border-[#4fd1c7]/10 space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm text-[#8892b0]">
                    <span>WPM: <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span></span>
                    <span>Points: <span className="text-[#e6f1ff] font-semibold">{user.points}</span></span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8892b0]">
                    <span>Difficulty: <span className={getDifficultyBadge(user.difficulty)}>{user.difficulty.charAt(0).toUpperCase() + user.difficulty.slice(1)}</span></span>
                    <span className="text-[#8892b0]">{displayDate(user.user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#0f1419] px-4 sm:px-6 py-3 sm:py-4 border-t border-[#4fd1c7]/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-[#8892b0]">
            <span>Showing {leaderboard.length} users</span>
            <span>Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}
