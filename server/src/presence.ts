import type { Server } from "socket.io";
import {
  presenceMetaKey,
  presenceRoomKey,
  presenceSocketsKey,
  redis,
} from "./redis.js";
import type { Participant, PresenceStatus, SocketUser } from "./types.js";

const HEARTBEAT_TTL_SECONDS = 60;
const STALE_AFTER_MS = 90_000;
const JANITOR_INTERVAL_MS = 30_000;

interface LocalPresence {
  participant: Participant;
  sockets: Set<string>;
  lastSeen: number;
}

const rooms = new Map<string, Map<string, LocalPresence>>();

function getRoomPresence(roomId: string): Map<string, LocalPresence> {
  let room = rooms.get(roomId);
  if (!room) {
    room = new Map();
    rooms.set(roomId, room);
  }
  return room;
}

function cloneParticipant(participant: Participant): Participant {
  return { ...participant };
}

function listLocal(roomId: string): Participant[] {
  const room = rooms.get(roomId);
  if (!room) return [];

  return Array.from(room.values())
    .map((entry) => cloneParticipant(entry.participant))
    .sort((a, b) => a.online_at.localeCompare(b.online_at));
}

async function mirrorPresence(
  roomId: string,
  userId: string,
  participant: Participant,
  socketId: string
) {
  if (!redis) return;

  try {
    const now = Date.now();
    const socketKey = presenceSocketsKey(roomId, userId);

    await Promise.all([
      redis.zadd(presenceRoomKey(roomId), { score: now, member: userId }),
      redis.hset(presenceMetaKey(roomId), {
        [userId]: JSON.stringify(participant),
      }),
      redis.sadd(socketKey, socketId),
      redis.expire(socketKey, HEARTBEAT_TTL_SECONDS),
    ]);
  } catch (error) {
    console.error("[presence] redis mirror failed", error);
  }
}

async function removeRedisPresence(roomId: string, userId: string) {
  if (!redis) return;

  try {
    await Promise.all([
      redis.zrem(presenceRoomKey(roomId), userId),
      redis.hdel(presenceMetaKey(roomId), userId),
      redis.del(presenceSocketsKey(roomId, userId)),
    ]);
  } catch (error) {
    console.error("[presence] redis cleanup failed", error);
  }
}

export async function registerPresence(
  roomId: string,
  user: SocketUser,
  socketId: string
): Promise<{ participant: Participant; isNew: boolean }> {
  const room = getRoomPresence(roomId);
  const existing = room.get(user.id);
  const now = new Date().toISOString();

  const participant: Participant =
    existing?.participant ??
    ({
      id: user.id,
      username: user.name,
      online_at: now,
      avatar: user.image,
      status: "online" satisfies PresenceStatus,
    } as Participant);

  if (!existing) {
    room.set(user.id, {
      participant,
      sockets: new Set([socketId]),
      lastSeen: Date.now(),
    });
  } else {
    existing.sockets.add(socketId);
    existing.lastSeen = Date.now();
    existing.participant.status = "online";
    participant.status = "online";
  }

  await mirrorPresence(roomId, user.id, participant, socketId);

  return {
    participant: cloneParticipant(participant),
    isNew: !existing,
  };
}

export async function removeSocket(
  roomId: string,
  userId: string,
  socketId: string
): Promise<number> {
  const room = rooms.get(roomId);
  const entry = room?.get(userId);

  if (!entry) return 0;

  entry.sockets.delete(socketId);

  if (redis) {
    try {
      await redis.srem(presenceSocketsKey(roomId, userId), socketId);
    } catch (error) {
      console.error("[presence] redis socket removal failed", error);
    }
  }

  return entry.sockets.size;
}

export function hasActiveSockets(roomId: string, userId: string): boolean {
  const entry = rooms.get(roomId)?.get(userId);
  return Boolean(entry && entry.sockets.size > 0);
}

export async function hasRemoteSockets(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!redis) return false;

  try {
    return (await redis.scard(presenceSocketsKey(roomId, userId))) > 0;
  } catch (error) {
    console.error("[presence] socket lookup failed", error);
    return false;
  }
}

export async function removePresence(
  roomId: string,
  userId: string
): Promise<boolean> {
  const room = rooms.get(roomId);
  const entry = room?.get(userId);

  if (!entry) return false;

  room?.delete(userId);
  if (room && room.size === 0) {
    rooms.delete(roomId);
  }

  await removeRedisPresence(roomId, userId);
  return true;
}

export function getPresence(roomId: string): Participant[] {
  return listLocal(roomId);
}

export async function heartbeat(roomId: string, userId: string) {
  const room = rooms.get(roomId);
  const entry = room?.get(userId);
  if (!entry) return;

  entry.lastSeen = Date.now();

  if (!redis) return;

  try {
    await Promise.all([
      redis.zadd(presenceRoomKey(roomId), {
        score: entry.lastSeen,
        member: userId,
      }),
      redis.expire(
        presenceSocketsKey(roomId, userId),
        HEARTBEAT_TTL_SECONDS
      ),
    ]);
  } catch (error) {
    console.error("[presence] heartbeat failed", error);
  }
}

export async function setAway(
  roomId: string,
  userId: string,
  away: boolean
): Promise<Participant | null> {
  const entry = rooms.get(roomId)?.get(userId);
  if (!entry) return null;

  entry.participant.status = away ? "away" : "online";
  entry.lastSeen = Date.now();

  if (redis) {
    try {
      await Promise.all([
        redis.hset(presenceMetaKey(roomId), {
          [userId]: JSON.stringify(entry.participant),
        }),
        redis.zadd(presenceRoomKey(roomId), {
          score: entry.lastSeen,
          member: userId,
        }),
      ]);
    } catch (error) {
      console.error("[presence] away state failed", error);
    }
  }

  return cloneParticipant(entry.participant);
}

export function startPresenceJanitor(io: Server) {
  const timer = setInterval(() => {
    const now = Date.now();

    for (const [roomId, room] of rooms) {
      for (const [userId, entry] of room) {
        if (entry.sockets.size === 0) continue;
        if (now - entry.lastSeen <= STALE_AFTER_MS) continue;

        entry.sockets.clear();
        room.delete(userId);
        void removeRedisPresence(roomId, userId);

        io.to(roomId).emit("presence_updated", {
          userId,
          status: "offline",
        });
        io.to(roomId).emit("participants_updated", listLocal(roomId));
      }

      if (room.size === 0) {
        rooms.delete(roomId);
      }
    }
  }, JANITOR_INTERVAL_MS);

  timer.unref?.();
  return () => clearInterval(timer);
}
