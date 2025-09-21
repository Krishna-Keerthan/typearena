"use server"

import { GameResult } from "@/types/leaderboard"
import prisma from "@/lib/prisma"



export async function updateLeaderboard(result:GameResult) {
  const { userId, wpm, accuracy, difficulty } = result

  function calculatePoints(wpm: number, accuracy: number, difficulty: string) {
    const multiplier =
      difficulty === "EASY" ? 1 :
      difficulty === "MEDIUM" ? 1.5 :
      2
  
    return Math.floor(wpm * multiplier * (accuracy / 100))
  }
  
  // ----CALCULATE THE POINTS-----
  const earnedPoints = calculatePoints(wpm, accuracy, difficulty)

 
  const updatedLeaderboard = await prisma.leaderBoard.upsert({
    where: { userId },
    update: {
      points: { increment: earnedPoints },  
      wpm: wpm,
      difficulty,
    },
    create: {
      userId,
      points: earnedPoints,
      wpm,
      difficulty,
    },
    include: { user: true },
  })

  return updatedLeaderboard
}



