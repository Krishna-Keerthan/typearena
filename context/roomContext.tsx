'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type {
  ChatMessage,
  ClientChatMessage,
  Participant,
  RoomInfo,
  RoomSnapshot,
} from '@/types/room';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';

interface JoinRoomResponse {
  ok: boolean;
  state?: RoomSnapshot;
  error?: string;
}

interface SendMessageResponse {
  ok: boolean;
  clientId?: string;
  message?: ChatMessage;
  error?: string;
}

interface RoomContextType {
  currentRoom: RoomInfo | null;
  participants: Participant[];
  isConnected: boolean;
  isStartRace: boolean;
  setIsStartRace: React.Dispatch<React.SetStateAction<boolean>>;
  raceText: string | null;
  progressByUser: Record<string, number>;
  finishedAtByUser: Record<string, number | null>;
  typingUsers: string[];

  channel: Socket | null;

  startRace: (startRace: boolean) => Promise<void>;
  resetRace: () => Promise<void>;
  joinRoom: (roomId: string, roomName: string, username: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (message: ClientChatMessage) => Promise<void>;
  sendProgress: (progress: number) => void;
  startTyping: () => void;
  stopTyping: () => void;

  messages: ClientChatMessage[];
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

interface RoomProviderProps {
  children: ReactNode;
}

async function fetchSocketToken(): Promise<string> {
  const response = await fetch('/api/socket-token', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('You must be signed in to join a room');
  }

  const data = (await response.json()) as { token?: string };

  if (!data.token) {
    throw new Error('Failed to authenticate the realtime connection');
  }

  return data.token;
}

function waitForConnection(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Realtime connection timed out'));
    }, 15000);

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
    };

    socket.once('connect', onConnect);
    socket.once('connect_error', onError);
  });
}

function emitJoin(socket: Socket, roomId: string): Promise<JoinRoomResponse> {
  return new Promise((resolve, reject) => {
    socket.timeout(10000).emit(
      'join_room',
      { roomId },
      (error: Error | null, result: JoinRoomResponse) => {
        if (error) {
          reject(new Error('Failed to join the room'));
          return;
        }
        resolve(result);
      }
    );
  });
}

function toClientMessage(
  message: ChatMessage,
  status: ClientChatMessage['status'] = 'sent'
): ClientChatMessage {
  return { ...message, status };
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<RoomInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { data: session } = useSession();
  const username = session?.user.name ?? undefined;
  const [isStartRace, setIsStartRace] = useState(false);
  const [raceText, setRaceText] = useState<string | null>(null);
  const [progressByUser, setProgressByUser] = useState<Record<string, number>>({});
  const [finishedAtByUser, setFinishedAtByUser] = useState<
    Record<string, number | null>
  >({});

  const socketRef = useRef<Socket | null>(null);
  const joinedRoomRef = useRef<{ id: string; name: string } | null>(null);
  const hasJoinedRef = useRef(false);
  const usernameRef = useRef<string | undefined>(username);
  const rejoiningRef = useRef(false);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  const cleanupSocket = useCallback(() => {
    const socket = socketRef.current;

    joinedRoomRef.current = null;
    hasJoinedRef.current = false;
    rejoiningRef.current = false;

    if (socket) {
      socket.io.removeAllListeners();
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    }

    setChannel(null);
    setIsConnected(false);
    setCurrentRoom(null);
    setParticipants([]);
    setMessages([]);
    setTypingUsers([]);
    setIsStartRace(false);
    setRaceText(null);
    setProgressByUser({});
    setFinishedAtByUser({});
  }, []);

  useEffect(() => {
    return () => {
      const socket = socketRef.current;
      if (socket) {
        socket.io.removeAllListeners();
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const applySnapshot = useCallback((state: RoomSnapshot) => {
    if (state.room) {
      setCurrentRoom(state.room);
    }
    setParticipants(state.participants ?? []);
    setMessages((prev) => {
      const serverMessages = (state.messages ?? []).map((message) =>
        toClientMessage(message, 'sent')
      );
      const serverClientIds = new Set(
        serverMessages
          .map((message) => message.clientId)
          .filter((clientId): clientId is string => Boolean(clientId))
      );
      const pending = prev.filter(
        (message) =>
          (message.status === 'failed' || message.status === 'sending') &&
          !serverClientIds.has(message.clientId ?? '')
      );

      return [...serverMessages, ...pending];
    });
    setIsStartRace(state.isStartRace ?? false);
    setRaceText(state.raceText ?? null);
    setProgressByUser(state.progressByUser ?? {});
    setFinishedAtByUser(state.finishedAtByUser ?? {});
    setTypingUsers([]);
  }, []);

  const mergeMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const incoming = toClientMessage(message, 'sent');

      if (prev.some((item) => item.id === incoming.id)) {
        return prev.map((item) =>
          item.id === incoming.id ? { ...item, status: 'sent' } : item
        );
      }

      const clientId = incoming.clientId;
      const pendingIndex = clientId
        ? prev.findIndex((item) => item.clientId === clientId)
        : -1;

      if (pendingIndex >= 0) {
        const next = [...prev];
        next[pendingIndex] = incoming;
        return next;
      }

      return [...prev, incoming];
    });
  }, []);

  const rejoinRoom = useCallback(
    async (socket: Socket) => {
      const room = joinedRoomRef.current;
      if (!room || rejoiningRef.current) return;

      rejoiningRef.current = true;

      try {
        const response = await emitJoin(socket, room.id);

        if (!response.ok) {
          throw new Error(response.error ?? 'Failed to rejoin the room');
        }

        if (response.state) {
          applySnapshot(response.state);
        }

        setCurrentRoom((prev) =>
          prev ?? {
            id: room.id,
            name: room.name,
            code: '',
            mode: '',
            mondeOption: '',
            hostId: '',
          }
        );
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        toast.error(
          error instanceof Error ? error.message : 'Failed to rejoin the room'
        );
      } finally {
        rejoiningRef.current = false;
      }
    },
    [applySnapshot]
  );

  const joinRoom = useCallback(
    async (roomId: string, roomName: string, usernameArg: string) => {
      if (!usernameArg) {
        throw new Error('You must be signed in to join a room');
      }

      if (socketRef.current) {
        cleanupSocket();
      }

      try {
        const socket = io(SOCKET_URL, {
          autoConnect: false,
          reconnection: true,
          auth: (callback) => {
            fetchSocketToken()
              .then((token) => callback({ token }))
              .catch((error) => {
                toast.error(
                  error instanceof Error ? error.message : 'Authentication failed'
                );
                callback({});
              });
          },
        });

        socketRef.current = socket;
        setChannel(socket);

        socket.on('connect', () => {
          setIsConnected(true);

          if (hasJoinedRef.current) {
            toast.success('Reconnected to the room');
            void rejoinRoom(socket);
          }
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
          setTypingUsers([]);
          setMessages((prev) =>
            prev.map((message) =>
              message.status === 'sending'
                ? { ...message, status: 'failed' }
                : message
            )
          );
        });

        socket.on('connect_error', (error) => {
          setIsConnected(false);
          toast.error(error.message || 'Realtime connection failed');
        });

        socket.on('participants_updated', (list: Participant[]) => {
          setParticipants(list);
        });

        socket.on('new_message', (message: ChatMessage) => {
          mergeMessage(message);
        });

        socket.on('typing_updated', (payload: { users?: string[] }) => {
          const users = Array.isArray(payload?.users) ? payload.users : [];
          setTypingUsers(
            users.filter((name) => name !== usernameRef.current)
          );
        });

        socket.on('start_race', (payload: { text?: string; startedBy?: string }) => {
          setIsStartRace(true);
          if (payload?.text) {
            setRaceText(payload.text);
          }
          setProgressByUser({});
          setFinishedAtByUser({});
          toast.success(
            payload?.startedBy
              ? `Race started by ${payload.startedBy}`
              : 'Race started by the host'
          );
        });

        socket.on('reset_race', () => {
          setIsStartRace(false);
          setRaceText(null);
          setProgressByUser({});
          setFinishedAtByUser({});
          toast.info('Race reset by the host');
        });

        socket.on(
          'race_progress',
          (payload: {
            userId?: string;
            username?: string;
            progress?: number;
            finishedAt?: number;
          }) => {
            const userId = payload?.userId;
            const progress = payload?.progress;

            if (typeof userId !== 'string' || typeof progress !== 'number') {
              return;
            }

            setProgressByUser((prev) => ({
              ...prev,
              [userId]: Math.max(0, Math.min(100, progress)),
            }));

            if (progress >= 100) {
              setFinishedAtByUser((prev) => {
                if (prev[userId]) return prev;
                return {
                  ...prev,
                  [userId]:
                    typeof payload.finishedAt === 'number'
                      ? payload.finishedAt
                      : Date.now(),
                };
              });
            }
          }
        );

        socket.on('user_joined', (payload: { username?: string }) => {
          if (payload?.username) {
            toast.info(`${payload.username} joined the room`);
          }
        });

        socket.on('user_left', (payload: { username?: string }) => {
          if (payload?.username) {
            toast.info(`${payload.username} left the room`);
          }
        });

        socket.connect();
        await waitForConnection(socket);

        const response = await emitJoin(socket, roomId);

        if (!response.ok) {
          throw new Error(response.error ?? 'Failed to join the room');
        }

        if (response.state) {
          applySnapshot(response.state);
        }

        joinedRoomRef.current = {
          id: roomId,
          name: response.state?.room.name ?? roomName,
        };
        hasJoinedRef.current = true;
        setIsConnected(true);
        setCurrentRoom(
          response.state?.room ?? {
            id: roomId,
            name: roomName,
            code: '',
            mode: '',
            mondeOption: '',
            hostId: '',
          }
        );
      } catch (error) {
        cleanupSocket();
        throw error;
      }
    },
    [applySnapshot, cleanupSocket, mergeMessage, rejoinRoom]
  );

  const leaveRoom = useCallback(async () => {
    const socket = socketRef.current;

    if (socket) {
      socket.emit('leave_room');
    }

    cleanupSocket();
    toast.success('Left room successfully');
  }, [cleanupSocket]);

  const sendMessage = useCallback(
    async (content: string) => {
      const socket = socketRef.current;
      const room = joinedRoomRef.current;
      const trimmed = content.trim();

      if (!socket || !socket.connected || !room || !trimmed) return;

      const clientId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const optimistic: ClientChatMessage = {
        id: `local-${clientId}`,
        roomId: room.id,
        userId: session?.user.id ?? 'pending',
        content: trimmed,
        user: { name: usernameRef.current ?? 'You' },
        createdAt: new Date().toISOString(),
        clientId,
        status: 'sending',
      };

      setMessages((prev) => [...prev, optimistic]);
      socket.emit('typing_stop');

      socket
        .timeout(10000)
        .emit(
          'send_message',
          { content: trimmed, clientId },
          (error: Error | null, response: SendMessageResponse) => {
            if (error || !response?.ok) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.clientId === clientId
                    ? { ...message, status: 'failed' }
                    : message
                )
              );
              toast.error(response?.error ?? 'Message failed to send');
              return;
            }

            if (response.message) {
              mergeMessage(response.message);
            }
          }
        );
    },
    [mergeMessage, session?.user?.id]
  );

  const retryMessage = useCallback(
    async (message: ClientChatMessage) => {
      if (message.status !== 'failed') return;

      setMessages((prev) => prev.filter((item) => item.id !== message.id));
      await sendMessage(message.content);
    },
    [sendMessage]
  );

  const startRace = useCallback(
    async (start: boolean) => {
      const socket = socketRef.current;

      if (!start || !socket || !socket.connected) return;

      const words = [
        'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they',
        'have', 'this', 'will', 'your', 'from', 'can', 'had', 'her', 'would', 'make',
        'like', 'time', 'very', 'when', 'come', 'may', 'way', 'work', 'life', 'only',
        'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'first',
        'well', 'even', 'new', 'want', 'any', 'these', 'give', 'day', 'most', 'us',
      ];
      const selected: string[] = [];
      const requestedCount = Number(
        (currentRoom?.mondeOption ?? '').match(/\d+/)?.[0] ?? 25
      );
      const wordCount = requestedCount === 10 || requestedCount === 50 ? requestedCount : 25;

      for (let i = 0; i < wordCount; i++) {
        const index = Math.floor(Math.random() * words.length);
        selected.push(words[index]);
      }

      socket.emit('start_race', { text: selected.join(' ') });
    },
    [currentRoom?.mondeOption]
  );

  const resetRace = useCallback(async () => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) return;

    socket.emit('reset_race');
  }, []);

  const sendProgress = useCallback(
    (progress: number) => {
      const socket = socketRef.current;
      const userId = session?.user.id;

      if (!socket || !socket.connected) return;

      const clamped = Math.max(0, Math.min(100, Math.round(progress)));

      if (userId) {
        setProgressByUser((prev) => ({ ...prev, [userId]: clamped }));
      }
      socket.emit('race_progress', { progress: clamped });
    },
    [session?.user?.id]
  );

  const startTyping = useCallback(() => {
    socketRef.current?.emit('typing_start');
  }, []);

  const stopTyping = useCallback(() => {
    socketRef.current?.emit('typing_stop');
  }, []);

  useEffect(() => {
    if (!currentRoom) return;

    const socket = socketRef.current;
    if (!socket) return;

    const heartbeat = window.setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat');
      }
    }, 20000);

    const handleVisibility = () => {
      if (socket.connected) {
        socket.emit('set_away', { away: document.hidden });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentRoom]);

  const value: RoomContextType = {
    currentRoom,
    participants,
    isConnected,
    channel,
    joinRoom,
    leaveRoom,
    sendMessage,
    retryMessage,
    messages,
    startRace,
    resetRace,
    isStartRace,
    setIsStartRace,
    raceText,
    progressByUser,
    finishedAtByUser,
    sendProgress,
    startTyping,
    stopTyping,
    typingUsers,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
