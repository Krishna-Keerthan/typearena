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
            'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700',
            'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700',
            'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700',
            'bg-fuchsia-400', 'bg-fuchsia-500', 'bg-fuchsia-600', 'bg-fuchsia-700',
            'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
            'bg-violet-400', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700',
            'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
            'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
            'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700',
            'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700',
            'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
            'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700',
            'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700',
            'bg-lime-400', 'bg-lime-500', 'bg-lime-600', 'bg-lime-700',
            'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
            'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700',
            'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
            'bg-stone-400', 'bg-stone-500', 'bg-stone-600', 'bg-stone-700',
            'bg-zinc-400', 'bg-zinc-500', 'bg-zinc-600', 'bg-zinc-700',
            'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700',
            'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700'
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