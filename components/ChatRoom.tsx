'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function ChatRoom({
  roomName,
  username,
  participants,
}: {
  roomName: string
  username: string
  participants: string[]
}) {
  // Utility to pick a background color per participant
  const getColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="p-4">

      {/* Participants */}
      <div>
        <h3 className="font-semibold mb-2">
          Participants ({participants.length})
        </h3>
        <div className="space-y-2">
          {participants.map((p) => (
            <div
              key={p}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className={`${getColor(p)} text-white font-bold`}
                >
                  {p.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={`text-sm ${
                  p === username ? 'font-bold text-primary' : 'text-foreground'
                }`}
              >
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
