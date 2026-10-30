export interface RoomData {
  hostId: string;
  roomName: string;
  gameMode: string;
  wordCount: string;
}

export type PresenceStatus = "online" | "away";

export interface Participant {
  id: string;
  username: string;
  online_at: string;
  avatar?: string;
  status: PresenceStatus;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  user: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  clientId?: string;
}

export interface ClientChatMessage extends ChatMessage {
  status: "sending" | "sent" | "failed";
}

export interface RoomInfo {
  id: string;
  name: string;
  code: string;
  mode: string;
  mondeOption: string;
  hostId: string;
}

export interface RoomSnapshot {
  room: RoomInfo;
  participants: Participant[];
  messages: ChatMessage[];
  isStartRace: boolean;
  raceText: string | null;
  progressByUser: Record<string, number>;
  finishedAtByUser: Record<string, number | null>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  wpm: number;
  points: number;
  difficulty: string;
  updatedAt: string;
}
