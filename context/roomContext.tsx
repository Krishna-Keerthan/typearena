'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import { ChatMessage } from '@/hooks/use-realtime-chat';
import { toast } from 'sonner';
import { createClient } from '@/lib/client';

interface Participant {
  id: string;
  username: string;
  online_at: string;
  avatar?: string;
}

interface RoomContextType {

  currentRoom: {
    id: string;
    name: string;
    code: string;
  } | null;
  participants: Participant[];
  isConnected: boolean;
  isStartRace: boolean;
  setIsStartRace: React.Dispatch<React.SetStateAction<boolean>>;
  raceText: string | null;
  progressByUser: Record<string, number>;
  finishedAtByUser: Record<string, number | null>;

  channel: RealtimeChannel | null;
  
  startRace: (startRace: boolean) => Promise<void>;
  resetRace: () => Promise<void>;
  joinRoom: (roomId: string, roomName: string, username: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendProgress: (progress: number) => void;
  

  messages: Array<{
    id: string;
    user: {
      name:string;
    };
    content: string;
    createdAt: string;
  }>;
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

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<RoomContextType['currentRoom']>(null);
  const supabase = createClient();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [messages, setMessages] = useState<RoomContextType['messages']>([]);
  const {data:session} = useSession()
  const username = session?.user.name 
  const [isStartRace, setIsStartRace]= useState(false)
  const [raceText, setRaceText] = useState<string | null>(null)
  const [progressByUser, setProgressByUser] = useState<Record<string, number>>({})
  const [finishedAtByUser, setFinishedAtByUser] = useState<Record<string, number | null>>({})

  const joinRoom = async (roomId: string, roomName: string, username: string) => {
    try {
      // Leave existing room first
      if (channel) {
        await leaveRoom();
      }

      // Create new channel
      const newChannel = supabase.channel(`room:${roomId}`, {
        config: {
          presence: {
            key: username
          },
          broadcast: {
            self: false
          }
        },
      });

      // Set up event listeners
      newChannel
        // Handle incoming messages
        .on('broadcast', { event: 'NEW_MESSAGE' }, (payload: any) => {
          const p = payload.payload as ChatMessage
          setMessages(prev => [
            ...prev,
            {
              id: p.id,
              user: { name: p.user?.name },
              content: p.content,
              createdAt: p.createdAt,
            },
          ])
        })

        // Handle race start broadcast
        .on('broadcast', { event: 'START_RACE' }, (payload: any) => {
          const text = payload?.payload?.text as string | undefined
          setIsStartRace(true)
          if (text) {
            setRaceText(text)
          }
          setProgressByUser({})
          setFinishedAtByUser({})
          toast.success('Race started by the host')
        })

        // Handle race reset broadcast
        .on('broadcast', { event: 'RESET_RACE' }, () => {
          console.log('[Realtime] RESET_RACE received')
          setIsStartRace(false)
          setRaceText(null)
          setProgressByUser({})
          setFinishedAtByUser({})
          toast.info('Race reset by the host')
        })

        // Handle race progress updates
        .on('broadcast', { event: 'RACE_PROGRESS' }, (payload: any) => {
          const u = payload?.payload?.username as string | undefined
          const p = payload?.payload?.progress as number | undefined
          const f = payload?.payload?.finishedAt as number | undefined
          if (typeof u === 'string' && typeof p === 'number') {
            setProgressByUser(prev => ({ ...prev, [u]: Math.max(0, Math.min(100, p)) }))
            if (p >= 100) {
              setFinishedAtByUser(prev => {
                if (prev[u]) return prev
                return { ...prev, [u]: typeof f === 'number' ? f : Date.now() }
              })
            }
          }
        })

        // Handle user join notifications
        .on('broadcast', { event: 'USER_JOINED' }, (payload: any) => {
          console.log('User joined:', payload.payload.username);
          toast.info(`${payload.payload.username} is joined!`)
        })

        // Handle user leave notifications
        .on('broadcast', { event: 'USER_LEFT' }, (payload: any) => {
          console.log('User left:', payload.payload.username);
          toast.info(`${ payload.payload.username} is left!`)

        })

        // Track presence (who's online)
        .on('presence', { event: 'sync' }, () => {
          const state = newChannel.presenceState();
          const users = Object.entries(state).map(([key, value]: [string, any]) => ({
            id: key,
            username: key,
            online_at: value[0]?.online_at || new Date().toISOString(),
            avatar: value[0]?.avatar,
          }));
          setParticipants(users);
        })

        .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
          console.log('User joined presence:', key);
        })

        .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
          console.log('User left presence:', key);
        });

      // Subscribe to channel
      const status = await newChannel.subscribe(async (status:any) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          
          // Track user presence
          await newChannel.track({ 
            online_at: new Date().toISOString(),
            username: username,
            avatar: null, // Add avatar URL if available
          });

          // Broadcast join event
          await newChannel.send({
            type: 'broadcast',
            event: 'USER_JOINED',
            payload: { username, roomId }
          });

          console.log('Successfully joined room:', roomName);
        }
      });

      // Update state
      setChannel(newChannel);
      setCurrentRoom({ id: roomId, name: roomName, code: '' });
      
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  };

  const leaveRoom = async () => {
    if (channel && currentRoom) {
      try {
        // Broadcast leave event
        await channel.send({
          type: 'broadcast',
          event: 'USER_LEFT',
          payload: { username: username, roomId: currentRoom.id }
        });

        
        await channel.unsubscribe();
        
        // Reset state
        setChannel(null);
        setCurrentRoom(null);
        setIsConnected(false);
        
        toast.success('Left room successfully');
      } catch (error) {
        console.error('Error leaving room:', error);
        toast.error("Error leaving room!")
      }
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return
  
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: { name: username! },
        createdAt: new Date().toISOString(),
      }
  
      setMessages((current) => [...current, message])
  
      await channel.send({
        type: 'broadcast',
        event: 'NEW_MESSAGE',
        payload: message,   
      })
    },
    [channel, isConnected, username]
  )

  const startRace = useCallback(async (startRace:boolean)=>{
    if (startRace) {
      // Generate a 25-word text for the race and broadcast it so everyone has the same text
      const words = ['the','and','you','that','was','for','are','with','his','they','have','this','will','your','from','can','had','her','would','make','like','time','very','when','come','may','way','work','life','only','over','think','also','back','after','use','two','how','our','first','well','even','new','want','any','these','give','day','most','us']
      const selected: string[] = []
      for (let i = 0; i < 25; i++) {
        const idx = Math.floor(Math.random() * words.length)
        selected.push(words[idx])
      }
      const text = selected.join(' ')

      setRaceText(text)
      setProgressByUser({})
      setFinishedAtByUser({})

      await channel?.send({
        type:'broadcast',
        event:'START_RACE',
        payload: { text, startedBy: username }
      })
    }
    setIsStartRace(true)
  },[ isConnected, channel, username])

  const resetRace = useCallback(async () => {
    setIsStartRace(false)
    setRaceText(null)
    setProgressByUser({})
    setFinishedAtByUser({})
    console.log('[Realtime] Sending RESET_RACE')
    await channel?.send({
      type: 'broadcast',
      event: 'RESET_RACE',
      payload: { resetBy: username }
    })
  }, [channel, username])

  const sendProgress = useCallback((progress: number) => {
    if (!isConnected || !username) return
    // Update own progress locally so the UI reflects immediately
    setProgressByUser(prev => ({ ...prev, [username]: Math.max(0, Math.min(100, progress)) }))

    let finishedAt: number | undefined
    if (progress >= 100) {
      setFinishedAtByUser(prev => {
        const existing = prev[username]
        finishedAt = existing ?? Date.now()
        return { ...prev, [username]: finishedAt! }
      })
    }

    // Fire-and-forget broadcast (note: many providers don't echo to sender)
    channel?.send({
      type: 'broadcast',
      event: 'RACE_PROGRESS',
      payload: { username, progress, finishedAt }
    })
  }, [channel, isConnected, username])
  

  const value: RoomContextType = {
    currentRoom,
    participants,
    isConnected,
    channel,
    joinRoom,
    leaveRoom,
    sendMessage,
    messages,
    startRace,
    resetRace,
    isStartRace,
    setIsStartRace,
    raceText,
    progressByUser,
    finishedAtByUser,
    sendProgress
    
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};