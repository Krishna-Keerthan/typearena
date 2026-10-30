"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextauth-options"
import { Difficulty, GameResult } from "@/types/leaderboard"
import prisma from "@/lib/prisma"
import {
  LEADERBOARD_CHANNEL,
  LEADERBOARD_KEY,
  LEADERBOARD_META_KEY,
  redis,
} from "@/lib/redis"

export async function updateLeaderboard(result: GameResult) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.id !== result.userId) {
    throw new Error("Unauthorized")
  }

  const userId = result.userId;
  const wpm = Math.max(0, Math.min(400, Math.round(result.wpm)));
  const accuracy = Math.max(0, Math.min(100, Math.round(result.accuracy)));
  const difficulty = Object.values(Difficulty).includes(result.difficulty)
    ? result.difficulty
    : Difficulty.EASY;

  function calculatePoints(wpm: number, accuracy: number, difficulty: string) {
    const multiplier =
      difficulty === "EASY" ? 1 :
      difficulty === "MEDIUM" ? 1.5 :
      2;

    return Math.floor(wpm * multiplier * (accuracy / 100));
  }

  const earnedPoints = calculatePoints(wpm, accuracy, difficulty);

  const existing = await prisma.leaderBoard.findFirst({
    where: { userId },
  });

  let updatedLeaderboard;

  if (existing) {
    updatedLeaderboard = await prisma.leaderBoard.update({
      where: { id: existing.id }, 
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

  if (redis) {
    try {
      const meta = {
        name: updatedLeaderboard.user.name ?? "Unknown player",
        wpm: updatedLeaderboard.wpm,
        points: updatedLeaderboard.points,
        difficulty: String(updatedLeaderboard.difficulty),
        updatedAt: updatedLeaderboard.updatedAt.toISOString(),
      };

      await Promise.all([
        redis.zadd(LEADERBOARD_KEY, {
          score: updatedLeaderboard.points,
          member: userId,
        }),
        redis.hset(LEADERBOARD_META_KEY, {
          [userId]: JSON.stringify(meta),
        }),
        redis.publish(
          LEADERBOARD_CHANNEL,
          JSON.stringify({ userId, points: updatedLeaderboard.points })
        ),
      ]);
    } catch (error) {
      console.error("Failed to update Redis leaderboard", error);
    }
  }

  return updatedLeaderboard;
}
