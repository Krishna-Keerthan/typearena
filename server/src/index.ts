import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { verifySocketToken } from "./auth.js";
import { registerRoomHandlers } from "./rooms.js";
import { registerLeaderboardHandlers, startLeaderboardSubscription } from "./leaderboard.js";
import { startPresenceJanitor } from "./presence.js";
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";

const PORT = Number(process.env.PORT ?? 4000);
const ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.use(cors({ origin: ORIGINS, credentials: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    redis: Boolean(redis),
  });
});

app.get("/", (_req, res) => {
  res.json({ name: "typearena-realtime", status: "ok" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGINS, credentials: true },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (typeof token !== "string" || !token) {
    next(new Error("Unauthorized"));
    return;
  }

  const user = await verifySocketToken(token);
  if (!user) {
    next(new Error("Unauthorized"));
    return;
  }

  socket.data.user = user;
  next();
});

io.on("connection", (socket) => {
  const user = socket.data.user as { name: string } | undefined;
  console.log(`[realtime] ${user?.name ?? "unknown"} connected (${socket.id})`);

  registerRoomHandlers(io, socket);
  registerLeaderboardHandlers(io, socket);

  socket.on("disconnect", (reason) => {
    console.log(
      `[realtime] ${user?.name ?? "unknown"} disconnected (${socket.id}) - ${reason}`
    );
  });
});

const stopLeaderboardSubscription = startLeaderboardSubscription(io);
const stopPresenceJanitor = startPresenceJanitor(io);

server.listen(PORT, () => {
  console.log(`[realtime] listening on port ${PORT}`);
  if (!redis) {
    console.warn(
      "[realtime] UPSTASH_REDIS_REST_URL/TOKEN not set; live leaderboard and shared presence are disabled"
    );
  }
});

async function shutdown() {
  stopLeaderboardSubscription();
  stopPresenceJanitor();
  io.close();
  server.close(async () => {
    await prisma.$disconnect().catch(() => undefined);
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
