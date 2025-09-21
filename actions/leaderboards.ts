"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextauth-options"
import { LeaderBoard } from "@/types/leaderboard"
import prisma from "@/lib/prisma"

export async function createLeaderBoard(data: Omit<LeaderBoard, 'id' | 'userId' | 'createdAt'>) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return { error: "Session is not available" }
  }

  try {
    const leaderboard = await prisma.leaderBoard.create({
      data: {
        userId: session.user.id,
        wpm: data.wpm,
        time: data.time,
        difficulty: data.difficulty,
        wordcount: data.wordCount,
      },
    })

    return { success: true, leaderboard }
  } catch (error) {
    console.error("Error creating leaderboard entry:", error)
    return { error: "Failed to create leaderboard entry" }
  }
}



