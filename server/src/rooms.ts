import type { Server, Socket } from "socket.io";
import { prisma } from "./prisma.js";
import {
  getPresence,
  hasActiveSockets,
  hasRemoteSockets,
  heartbeat,
  registerPresence,
  removePresence,
  removeSocket,
  setAway,
} from "./presence.js";
import type {
  ChatMessage,
  RoomInfo,
  RoomSnapshot,
  SocketUser,
} from "./types.js";

interface RoomState {
  typingUsers: Map<string, string>;
  isStartRace: boolean;
  raceText: string | null;
  progressByUser: Record<string, number>;
  finishedAtByUser: Record<string, number | null>;
}

const MAX_MESSAGE_LENGTH = 500;
const HISTORY_LIMIT = 50;
const MESSAGE_RATE_LIMIT = 10;
const MESSAGE_RATE_WINDOW_MS = 10_000;
const PROGRESS_RATE_LIMIT = 40;
const PROGRESS_RATE_WINDOW_MS = 5_000;
const TYPING_CLEAR_MS = 2_500;
const OFFLINE_GRACE_MS = 5_000;

const rooms = new Map<string, RoomState>();

function getRoom(roomId: string): RoomState {
  let room = rooms.get(roomId);

  if (!room) {
    room = {
      typingUsers: new Map(),
      isStartRace: false,
      raceText: null,
      progressByUser: {},
      finishedAtByUser: {},
    };
    rooms.set(roomId, room);
  }

  return room;
}

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function resetRaceState(room: RoomState) {
  room.isStartRace = false;
  room.raceText = null;
  room.progressByUser = {};
  room.finishedAtByUser = {};
}

function toChatMessage(row: {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  clientId: string | null;
  createdAt: Date;
  user: { name: string | null; image: string | null };
}): ChatMessage {
  return {
    id: row.id,
    roomId: row.roomId,
    userId: row.userId,
    content: row.content,
    clientId: row.clientId ?? undefined,
    user: {
      name: row.user.name ?? "Player",
      avatar: row.user.image ?? undefined,
    },
    createdAt: row.createdAt.toISOString(),
  };
}

async function fetchMessages(roomId: string): Promise<ChatMessage[]> {
  try {
    const rows = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return rows.reverse().map(toChatMessage);
  } catch (error) {
    console.error("[chat] failed to load history", error);
    return [];
  }
}

async function fetchRoom(roomId: string): Promise<RoomInfo | null> {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        name: true,
        code: true,
        mode: true,
        mondeOption: true,
        hostId: true,
      },
    });

    return room;
  } catch {
    return null;
  }
}

function createRateLimiter(limit: number, windowMs: number) {
  const timestamps: number[] = [];

  return () => {
    const now = Date.now();
    while (timestamps.length > 0 && now - timestamps[0] > windowMs) {
      timestamps.shift();
    }

    if (timestamps.length >= limit) {
      return false;
    }

    timestamps.push(now);
    return true;
  };
}

export function registerRoomHandlers(io: Server, socket: Socket) {
  const user = socket.data.user as SocketUser;
  const canSendMessage = createRateLimiter(
    MESSAGE_RATE_LIMIT,
    MESSAGE_RATE_WINDOW_MS
  );
  const canSendProgress = createRateLimiter(
    PROGRESS_RATE_LIMIT,
    PROGRESS_RATE_WINDOW_MS
  );
  const typingTimers = new Map<string, NodeJS.Timeout>();

  let roomId: string | null = null;

  const broadcastTyping = (currentRoomId: string, room: RoomState) => {
    io.to(currentRoomId).emit("typing_updated", {
      users: Array.from(room.typingUsers.values()),
    });
  };

  const clearTyping = (currentRoomId: string, userId: string) => {
    const state = rooms.get(currentRoomId);
    const timer = typingTimers.get(userId);

    if (timer) {
      clearTimeout(timer);
      typingTimers.delete(userId);
    }

    if (state?.typingUsers.delete(userId)) {
      broadcastTyping(currentRoomId, state);
    }
  };

  const leaveCurrentRoom = () => {
    if (!roomId) return;

    const currentId = roomId;
    roomId = null;
    socket.leave(currentId);
    clearTyping(currentId, user.id);

    void (async () => {
      const remaining = await removeSocket(currentId, user.id, socket.id);

      io.to(currentId).emit("participants_updated", getPresence(currentId));

      if (remaining > 0) return;

      setTimeout(async () => {
        if (hasActiveSockets(currentId, user.id)) return;
        if (await hasRemoteSockets(currentId, user.id)) return;

        const removed = await removePresence(currentId, user.id);
        if (!removed) return;

        io.to(currentId).emit("presence_updated", {
          userId: user.id,
          status: "offline",
        });
        io.to(currentId).emit(
          "participants_updated",
          getPresence(currentId)
        );
        io.to(currentId).emit("user_left", { username: user.name });

        if (getPresence(currentId).length === 0) {
          rooms.delete(currentId);
        }
      }, OFFLINE_GRACE_MS);
    })();
  };

  socket.on(
    "join_room",
    async (
      payload: { roomId?: unknown },
      ack?: (response: {
        ok: boolean;
        state?: RoomSnapshot;
        error?: string;
      }) => void
    ) => {
      const id = payload?.roomId;

      if (typeof id !== "string" || !id.trim()) {
        ack?.({ ok: false, error: "Invalid room id" });
        return;
      }

      const roomInfo = await fetchRoom(id);
      if (!roomInfo) {
        ack?.({ ok: false, error: "Room not found" });
        return;
      }

      if (roomId && roomId !== id) {
        leaveCurrentRoom();
      }

      const state = getRoom(id);
      roomId = id;
      socket.data.hostId = roomInfo.hostId;
      socket.join(id);

      const { participant, isNew } = await registerPresence(
        id,
        user,
        socket.id
      );

      const messages = await fetchMessages(id);
      const snapshot: RoomSnapshot = {
        room: roomInfo,
        participants: getPresence(id),
        messages,
        isStartRace: state.isStartRace,
        raceText: state.raceText,
        progressByUser: state.progressByUser,
        finishedAtByUser: state.finishedAtByUser,
      };

      ack?.({ ok: true, state: snapshot });

      if (isNew) {
        socket.to(id).emit("user_joined", { username: user.name });
      }

      io.to(id).emit("presence_updated", {
        userId: user.id,
        status: participant.status,
        participant,
      });
      io.to(id).emit("participants_updated", getPresence(id));
    }
  );

  socket.on("leave_room", (ack?: (response: { ok: boolean }) => void) => {
    leaveCurrentRoom();
    ack?.({ ok: true });
  });

  socket.on(
    "send_message",
    async (
      payload: { content?: unknown; clientId?: unknown },
      ack?: (response: {
        ok: boolean;
        clientId?: string;
        message?: ChatMessage;
        error?: string;
      }) => void
    ) => {
      if (!roomId) {
        ack?.({ ok: false, error: "You are not in a room" });
        return;
      }

      if (!canSendMessage()) {
        ack?.({ ok: false, error: "You are sending messages too quickly" });
        return;
      }

      const content =
        typeof payload?.content === "string" ? payload.content.trim() : "";
      const clientId =
        typeof payload?.clientId === "string"
          ? payload.clientId.slice(0, 100)
          : undefined;

      if (!content || content.length > MAX_MESSAGE_LENGTH) {
        ack?.({
          ok: false,
          clientId,
          error: `Message must be 1-${MAX_MESSAGE_LENGTH} characters`,
        });
        return;
      }

      const currentRoomId = roomId;

      try {
        const row = await prisma.message.create({
          data: {
            roomId: currentRoomId,
            userId: user.id,
            content,
            clientId,
          },
          include: {
            user: { select: { name: true, image: true } },
          },
        });

        const message = toChatMessage(row);

        clearTyping(currentRoomId, user.id);
        io.to(currentRoomId).emit("new_message", message);
        ack?.({ ok: true, clientId, message });
      } catch (error) {
        console.error("[chat] failed to persist message", error);
        ack?.({ ok: false, clientId, error: "Failed to send message" });
      }
    }
  );

  socket.on(
    "typing_start",
    (ack?: (response: { ok: boolean }) => void) => {
      if (!roomId) {
        ack?.({ ok: false });
        return;
      }

      const state = getRoom(roomId);
      const currentRoomId = roomId;

      if (!state.typingUsers.has(user.id)) {
        state.typingUsers.set(user.id, user.name);
        broadcastTyping(currentRoomId, state);
      }

      const existing = typingTimers.get(user.id);
      if (existing) clearTimeout(existing);

      typingTimers.set(
        user.id,
        setTimeout(() => {
          clearTyping(currentRoomId, user.id);
        }, TYPING_CLEAR_MS)
      );

      ack?.({ ok: true });
    }
  );

  socket.on(
    "typing_stop",
    (ack?: (response: { ok: boolean }) => void) => {
      if (roomId) {
        clearTyping(roomId, user.id);
      }
      ack?.({ ok: true });
    }
  );

  socket.on("start_race", (payload: { text?: unknown }) => {
    if (!roomId || socket.data.hostId !== user.id) return;

    const state = rooms.get(roomId);
    if (!state) return;

    const text = typeof payload?.text === "string" ? payload.text : "";
    if (!text.trim()) return;

    state.isStartRace = true;
    state.raceText = text;
    state.progressByUser = {};
    state.finishedAtByUser = {};

    io.to(roomId).emit("start_race", { text, startedBy: user.name });
  });

  socket.on("reset_race", () => {
    if (!roomId || socket.data.hostId !== user.id) return;

    const state = rooms.get(roomId);
    if (!state) return;

    resetRaceState(state);
    io.to(roomId).emit("reset_race", { resetBy: user.name });
  });

  socket.on("race_progress", (payload: { progress?: unknown }) => {
    if (!roomId || !canSendProgress()) return;

    const state = rooms.get(roomId);
    if (!state) return;

    const raw =
      typeof payload?.progress === "number"
        ? payload.progress
        : Number(payload?.progress);

    if (!Number.isFinite(raw)) return;

    const progress = clampProgress(raw);
    state.progressByUser[user.id] = progress;

    let finishedAt: number | undefined;
    if (progress >= 100) {
      const existing = state.finishedAtByUser[user.id];
      finishedAt = existing ?? Date.now();
      state.finishedAtByUser[user.id] = finishedAt;
    }

    io.to(roomId).emit("race_progress", {
      userId: user.id,
      username: user.name,
      progress,
      finishedAt,
    });
  });

  socket.on(
    "heartbeat",
    async (ack?: (response: { ok: boolean; serverTime: number }) => void) => {
      if (roomId) {
        await heartbeat(roomId, user.id);
      }
      ack?.({ ok: Boolean(roomId), serverTime: Date.now() });
    }
  );

  socket.on(
    "set_away",
    async (
      payload: { away?: unknown },
      ack?: (response: { ok: boolean }) => void
    ) => {
      if (!roomId) {
        ack?.({ ok: false });
        return;
      }

      const participant = await setAway(
        roomId,
        user.id,
        Boolean(payload?.away)
      );

      if (participant) {
        io.to(roomId).emit("presence_updated", {
          userId: user.id,
          status: participant.status,
          participant,
        });
        io.to(roomId).emit("participants_updated", getPresence(roomId));
      }

      ack?.({ ok: true });
    }
  );

  socket.on("disconnect", () => {
    leaveCurrentRoom();
    for (const timer of typingTimers.values()) {
      clearTimeout(timer);
    }
    typingTimers.clear();
  });
}
