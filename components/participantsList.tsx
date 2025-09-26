'use client';

import React from 'react';
import { useRoom } from '@/context/roomContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ParticipantsList = () => {
  const { currentRoom, participants, isConnected } = useRoom();

  if (!currentRoom) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-center">
        <p className="text-gray-400">No active room</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 w-[350px]">
      <h3 className="text-white font-medium mb-4">
        Participants ({participants.length})
      </h3>
      
      <div className="space-y-2">
        {participants.map((participant) => {
          const name = participant.username || ''
          const letter = name.charAt(0).toUpperCase() || '?'
          const colors = [
            'bg-rose-600','bg-pink-600','bg-fuchsia-600','bg-purple-600','bg-violet-600',
            'bg-indigo-600','bg-blue-600','bg-sky-600','bg-cyan-600','bg-teal-600',
            'bg-emerald-600','bg-green-600','bg-lime-600','bg-yellow-600','bg-amber-600',
            'bg-orange-600','bg-red-600','bg-stone-600','bg-zinc-600','bg-slate-600'
          ]
          let hash = 0
          for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
          const color = colors[hash % colors.length]
          return (
            <div key={participant.id} className="flex items-center space-x-3">
              <Avatar className="size-8">
                <AvatarFallback className={`${color} text-white font-semibold`}>{letter}</AvatarFallback>
              </Avatar>
              <span className="text-gray-300">{participant.username}</span>
            </div>
          )
        })}
      </div>

      {!isConnected && (
        <p className="text-red-400 text-sm mt-4">Disconnected from room</p>
      )}
    </div>
  );
};

export default ParticipantsList;