"use client"

import { RealtimeChat } from "@/components/realtime-chat"
import { getRoomByCode } from "@/actions/room"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface RoomDetails {
  id: string
  name: string
  mode?: string
  mondeOption?: string
}

export default function Page({ params }: { params: { code: string } }) {
  const { data: session } = useSession()
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null)

  useEffect(() => {
    async function fetchRoom() {
      const room = await getRoomByCode(params.code)
      setRoomDetails(room)
    }
    fetchRoom()
  }, [params.code])

  if (!session) {
    return <p className="pt-20 text-center text-white">Loading session...</p>
  }

  if (!roomDetails) {
    return <p className="pt-20 text-center text-white">Loading room...</p>
  }

  return (
    <div className=" text-white flex flex-col pt-20 px-40">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="space-x-4">
          <span className="font-bold text-lg">{roomDetails.name}</span>
          <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-lg font-medium">
            {roomDetails.mode || "Default Mode"}
          </span>
          <span className="px-2 py-1 bg-yellow-300 text-amber-900 rounded-lg font-medium">
            {roomDetails.mondeOption || "Option A"}
          </span>
        </div>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition">
          Start Race
        </button>
      </div>

      {/* Main Section */}
      <main className="flex flex-1 p-6 gap-6 ">
        {/* Left: Realtime Chat */}
        <div className="flex-1 h-[500px] overflow-y-auto rounded-lg p-4 overflow-auto">
          <RealtimeChat
            roomName={roomDetails.name}
            username={session.user?.name ?? session.user?.id}
            key={roomDetails.id}
          />
        </div>

        {/* Right: Typist List */}
        <div className="w-1/3 bg-card rounded-lg p-6 overflow-auto">
          {/* Replace this with your TypistList component */}
          <h2 className="text-lg font-bold mb-2">Typist List</h2>
          <p>Participants will appear here...</p>
        </div>
      </main>
    </div>
  )
}
