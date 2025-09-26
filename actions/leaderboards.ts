"use server"

import { GameResult } from "@/types/leaderboard"
import prisma from "@/lib/prisma"

export async function updateLeaderboard(result: GameResult) {
  const { userId, wpm, accuracy, difficulty } = result;

  function calculatePoints(wpm: number, accuracy: number, difficulty: string) {
    const multiplier =
      difficulty === "EASY" ? 1 :
      difficulty === "MEDIUM" ? 1.5 :
      2;

    return Math.floor(wpm * multiplier * (accuracy / 100));
  }

  const earnedPoints = calculatePoints(wpm, accuracy, difficulty);

  const existing = await prisma.leaderBoard.findUnique({
    where: { userId },
  });

  let updatedLeaderboard;

  if (existing) {
    updatedLeaderboard = await prisma.leaderBoard.update({
      where: { userId },
      data: {
        points: { increment: earnedPoints },
        difficulty,
        ...(wpm > existing.wpm ? { wpm } : {}),
      },
      include: { user: true },
    });
  } else {
    updatedLeaderboard = await prisma.leaderBoard.create({
      data: {
        userId,
        points: earnedPoints,
        wpm,
        difficulty,
      },
      include: { user: true },
    });
  }

  return updatedLeaderboard;
}



