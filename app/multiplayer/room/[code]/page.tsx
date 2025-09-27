"use client"

import { getRoomByCode } from "@/actions/room"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ChatBox from "@/components/chatBox"
import ParticipantsList from "@/components/participantsList"
import { useRoom } from "@/context/roomContext"
import Race from "@/components/Race"
import { Button } from "@/components/ui/button"
import { Copy, LogOut, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface RoomDetails {
  id: string
  name: string
  mode?: string
  mondeOption?: string
  hostId: string
  code: string
}

export default function Page() {
  const { code } = useParams()
  const { data: session } = useSession()
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null)
  const [isHost, setIsHost] = useState(false)
  const { isStartRace, startRace, resetRace, leaveRoom } = useRoom()
  const router = useRouter()

  useEffect(() => {
    async function fetchRoom() {
      if (typeof code === "string") {
        const result = await getRoomByCode(code)
        if (!result?.success) return
        setRoomDetails(result.data)
        if (result.data?.hostId === session?.user.id) {
          setIsHost(true)
        }
      }
    }
    fetchRoom()
  }, [code, session?.user.id])

  const handleStartRace = () => {
    if (isHost) startRace(true)
  }

  const handlePlayAgain = () => {
    if (isHost) resetRace()
  }

  const handleLeaveRoom = () => {
    leaveRoom()
    router.push(`/multiplayer`)
  }


  if (!session) return <p className="pt-20 text-center text-white">Loading session...</p>
  if (!roomDetails) return <p className="pt-20 text-center text-white">Loading room...</p>

  return (
    <div className="text-white flex flex-col pt-28 min-h-screen">
   
    <div className="w-full max-w-7xl mx-auto px-6">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-4 flex items-center">
          <span className="font-bold text-lg">{roomDetails.name}</span>
          <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-lg font-medium">
            {roomDetails.mode || "Default Mode"}
          </span>
          <span className="px-2 py-1 bg-yellow-300 text-amber-900 rounded-lg font-medium flex items-center gap-2">
            {roomDetails.mondeOption || "Option A"}
          </span>
          {isHost && (
            <span className="px-2 py-1 bg-green-300 text-gray-900 rounded-lg font-medium">
              Host
            </span>
          )}
          <span
            className="bg-gray-700 text-white px-3 py-0.5 rounded text-sm font-mono flex items-center gap-1 cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(roomDetails.code)
              toast.success("Room code copied!")
            }}
          >
            {roomDetails.code} <Copy className="w-4 h-4" />
          </span>
        </div>
  
        <div className="flex items-center gap-3">
          <Button
            onClick={()=> handleLeaveRoom()}
            className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
            variant="destructive"
          >
            <LogOut className="mr-1" /> Leave Room
          </Button>
  
          {isHost && isStartRace && (
            <button
              onClick={handlePlayAgain}
              className="px-4 py-1 rounded-lg font-semibold text-base transition-all duration-200 hover:shadow-lg bg-purple-600 text-white"
            >
              Play again <RotateCcw className="inline-block ml-1" />
            </button>
          )}
  
          {isHost && !isStartRace && (
            <button
              onClick={handleStartRace}
              className="px-4 py-1 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-white"
            >
              Start Race →
            </button>
          )}
        </div>
      </div>
  
      {/* Main Section */}
      <main className="flex gap-6">
        {!isStartRace ? (
          <>
            <ChatBox />
            <ParticipantsList />
          </>
        ) : (
          <Race />
        )}
      </main>
  
    </div>
  </div>
  
  )
}
