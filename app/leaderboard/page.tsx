import React from "react"
import prisma from "@/lib/prisma"

const displayTime = (time: string) => time.replace("T", "") + "s"
const displayWordCount = (wordcount: string) => wordcount.replace("W", "")

interface LeaderboardEntry {
  id: string
  wpm: number
  wordcount: string
  time: string
  difficulty: string
  user: {
    id: string
    name: string
  }
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

export default async function Leaderboard() {
  let leaderboard: LeaderboardEntry[] = await prisma.leaderBoard.findMany({
    include: { user: true },
  })

  // Difficulty priority map
  const difficultyPriority: Record<string, number> = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  }

  // Sort by WPM -> wordcount -> difficulty
  leaderboard.sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm

    const wordCountA = parseInt(a.wordcount.replace("W", ""))
    const wordCountB = parseInt(b.wordcount.replace("W", ""))
    if (wordCountB !== wordCountA) return wordCountB - wordCountA

    return difficultyPriority[b.difficulty.toLowerCase()] - difficultyPriority[a.difficulty.toLowerCase()]
  })

  return (
    <div className="w-full max-w-6xl mx-auto p-6 mt-20">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#e6f1ff] mb-2">Leaderboard</h2>
        <p className="text-[#8892b0]">Top performers ranked by WPM, words typed, and difficulty</p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-hidden border border-[#4fd1c7]/10">
        {/* Table Header */}
        <div className="bg-[#0f1419] px-6 py-4 border-b border-[#4fd1c7]/20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 font-semibold text-[#00d9b7] text-sm uppercase tracking-wide">
            <div className="flex items-center">Rank</div>
            <div className="flex items-center">Username</div>
            <div className="hidden md:flex items-center">WPM</div>
            <div className="hidden md:flex items-center">Time</div>
            <div className="hidden md:flex items-center">Words</div>
            <div className="hidden md:flex items-center">Difficulty</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#4fd1c7]/10">
          {leaderboard.map((user, index) => {
            const rank = index + 1
            return (
              <div
                key={user.id}
                className={`px-6 py-4 transition-all duration-200 hover:bg-[#22d3ee]/5 ${
                  index % 2 === 0 ? "bg-[#1a1f2e]" : "bg-[#0f1419]/50"
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                  {/* Rank with badge */}
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(rank)}`}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Username with @ */}
                  <div className="flex items-center">
                    <span className="font-medium text-[#e6f1ff] truncate">
                      @{user.user.name}
                    </span>
                  </div>

                  {/* WPM */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span>
                  </div>

                  {/* Time */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#8892b0]">{displayTime(user.time)}</span>
                  </div>

                  {/* Words */}
                  <div className="hidden md:flex items-center">
                    <span className="text-[#8892b0]">{displayWordCount(user.wordcount)}</span>
                  </div>

                  {/* Difficulty */}
                  <div className="hidden md:flex items-center">
                    <span className={getDifficultyBadge(user.difficulty)}>
                      {user.difficulty.charAt(0).toUpperCase() + user.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Mobile-only additional info */}
                <div className="md:hidden mt-3 pt-3 border-t border-[#4fd1c7]/10 flex justify-between text-sm text-[#8892b0]">
                  <span>WPM: <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span></span>
                  <span>Time: <span className="text-[#e6f1ff]">{displayTime(user.time)}</span></span>
                  <span>Words: <span className="text-[#e6f1ff]">{displayWordCount(user.wordcount)}</span></span>
                  <span>Difficulty: <span className={getDifficultyBadge(user.difficulty)}>{user.difficulty.charAt(0).toUpperCase() + user.difficulty.slice(1)}</span></span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#0f1419] px-6 py-4 border-t border-[#4fd1c7]/20">
          <div className="flex justify-between items-center text-sm text-[#8892b0]">
            <span>Showing {leaderboard.length} users</span>
            <span>Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}
