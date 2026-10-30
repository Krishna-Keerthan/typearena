import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export const LEADERBOARD_KEY = "leaderboard:global";
export const LEADERBOARD_META_KEY = "leaderboard:users";
export const LEADERBOARD_CHANNEL = "leaderboard:updates";

export const presenceRoomKey = (roomId: string) => `presence:room:${roomId}`;
export const presenceMetaKey = (roomId: string) =>
  `presence:room:${roomId}:meta`;
export const presenceSocketsKey = (roomId: string, userId: string) =>
  `presence:room:${roomId}:sockets:${userId}`;
