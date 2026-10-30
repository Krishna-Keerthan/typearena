import type { Server, Socket } from "socket.io";
import { prisma } from "./prisma.js";
import {
  LEADERBOARD_CHANNEL,
  LEADERBOARD_KEY,
  LEADERBOARD_META_KEY,
  redis,
} from "./redis.js";
import type { LeaderboardEntry } from "./types.js";

const LEADERBOARD_ROOM = "leaderboard";
const DEFAULT_LIMIT = 10;
const BACKFILL_LIMIT = 250;

interface StoredLeaderboardMeta {
  name: string;
  wpm: number;
  points: number;
  difficulty: string;
  updatedAt: string;
}

function parseMeta(
  userId: string,
  raw: string | undefined,
  rank: number
): LeaderboardEntry {
  if (!raw) {
    return {
      rank,
      userId,
      name: "Unknown player",
      wpm: 0,
      points: 0,
      difficulty: "EASY",
      updatedAt: new Date(0).toISOString(),
    };
  }

  try {
    const meta = JSON.parse(raw) as StoredLeaderboardMeta;
    return {
      rank,
      userId,
      name: meta.name || "Unknown player",
      wpm: Number(meta.wpm) || 0,
      points: Number(meta.points) || 0,
      difficulty: meta.difficulty || "EASY",
      updatedAt: meta.updatedAt || new Date(0).toISOString(),
    };
  } catch {
    return parseMeta(userId, undefined, rank);
  }
}

async function readFromDatabase(limit: number): Promise<LeaderboardEntry[]> {
  const rows = await prisma.leaderBoard.findMany({
    orderBy: [{ points: "desc" }],
    take: limit,
    include: { user: true },
  });

  return rows.map((row, index) => ({
    rank: index + 1,
    userId: row.userId,
    name: row.user.name ?? "Unknown player",
    wpm: row.wpm,
    points: row.points,
    difficulty: String(row.difficulty),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function readLeaderboard(limit = DEFAULT_LIMIT): Promise<LeaderboardEntry[]> {
  if (!redis) {
    return readFromDatabase(limit);
  }

  try {
    const members = await redis.zrange<string[]>(
      LEADERBOARD_KEY,
      0,
      limit - 1,
      { rev: true }
    );

    if (members.length === 0) {
      return readFromDatabase(limit);
    }

    const meta = (await redis.hgetall<Record<string, string>>(
      LEADERBOARD_META_KEY
    )) ?? {};

    return members.map((userId, index) =>
      parseMeta(userId, meta[userId], index + 1)
    );
  } catch (error) {
    console.error("[leaderboard] redis read failed", error);
    return readFromDatabase(limit);
  }
}

export async function backfillLeaderboard() {
  if (!redis) return;

  try {
    const count = await redis.zcard(LEADERBOARD_KEY);
    if (count > 0) return;

    const rows = await prisma.leaderBoard.findMany({
      orderBy: [{ points: "desc" }],
      take: BACKFILL_LIMIT,
      include: { user: true },
    });

    if (rows.length === 0) return;

    for (const row of rows) {
      const meta: StoredLeaderboardMeta = {
        name: row.user.name ?? "Unknown player",
        wpm: row.wpm,
        points: row.points,
        difficulty: String(row.difficulty),
        updatedAt: row.updatedAt.toISOString(),
      };

      await Promise.all([
        redis.zadd(LEADERBOARD_KEY, {
          score: row.points,
          member: row.userId,
        }),
        redis.hset(LEADERBOARD_META_KEY, {
          [row.userId]: JSON.stringify(meta),
        }),
      ]);
    }

    console.log(`[leaderboard] backfilled ${rows.length} rows into redis`);
  } catch (error) {
    console.error("[leaderboard] backfill failed", error);
  }
}

async function broadcastLeaderboard(io: Server) {
  try {
    const entries = await readLeaderboard(DEFAULT_LIMIT);
    io.to(LEADERBOARD_ROOM).emit("leaderboard_updated", { entries });
  } catch (error) {
    console.error("[leaderboard] broadcast failed", error);
  }
}

export function startLeaderboardSubscription(io: Server) {
  const client = redis;

  if (!client) {
    console.warn("[leaderboard] redis not configured; live updates disabled");
    return () => undefined;
  }

  let closed = false;
  let subscriber: ReturnType<typeof client.subscribe> | null = null;

  const subscribe = () => {
    if (closed) return;

    subscriber = client.subscribe<string>(LEADERBOARD_CHANNEL);
    subscriber.on("message", () => {
      void broadcastLeaderboard(io);
    });
    subscriber.on("error", (error) => {
      console.error("[leaderboard] subscription error", error);
      if (closed) return;
      setTimeout(subscribe, 3_000);
    });
  };

  void backfillLeaderboard();
  subscribe();

  return () => {
    closed = true;
    (subscriber as unknown as { close?: () => void } | null)?.close?.();
  };
}

export function registerLeaderboardHandlers(_io: Server, socket: Socket) {
  socket.on(
    "watch_leaderboard",
    async (ack?: (response: {
      ok: boolean;
      entries?: LeaderboardEntry[];
      error?: string;
    }) => void) => {
      socket.join(LEADERBOARD_ROOM);

      try {
        const entries = await readLeaderboard(DEFAULT_LIMIT);
        ack?.({ ok: true, entries });
      } catch {
        ack?.({ ok: false, error: "Failed to load leaderboard" });
      }
    }
  );

  socket.on("unwatch_leaderboard", () => {
    socket.leave(LEADERBOARD_ROOM);
  });

  socket.on(
    "get_leaderboard",
    async (
      _payload: unknown,
      ack?: (response: {
        ok: boolean;
        entries?: LeaderboardEntry[];
        error?: string;
      }) => void
    ) => {
      try {
        const entries = await readLeaderboard(DEFAULT_LIMIT);
        ack?.({ ok: true, entries });
      } catch {
        ack?.({ ok: false, error: "Failed to load leaderboard" });
      }
    }
  );
}
