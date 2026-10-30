"use server"

import { authOptions } from "@/lib/nextauth-options"
import prisma from "@/lib/prisma"
import { generateRoomCode } from "@/lib/utils"
import { RoomData } from "@/types/room"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function createRoom(roomData: RoomData) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, data: { code: null } }
    }

    try {
        const code = generateRoomCode()

        const room = await prisma.room.create({
            data: {
                code: code,
                mode: roomData.gameMode,
                name: roomData.roomName,
                mondeOption: roomData.wordCount,
                hostId: session.user.id
            }
        })
        revalidatePath('/multiplayer')
        return { success: true, data: room }
    } catch {
        console.error("Failed to create the room")
    }
}


export async function getRoomByCode(code: string) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, data: null }
    }

    try {
        const room = await prisma.room.findUnique({
            where: { code },
            select: {
                id: true,
                name: true,
                mode: true,
                mondeOption: true,
                hostId:true,
                code:true
            },
        })

        return { success: true, data: room }
    } catch (error) {
        console.error(error)
        console.log("Room not found!")
    }
}


export async function deleteRoomByCode(roomcode:string){
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return { success: false, data: null }
    }

    try {
        const room = await prisma.room.findUnique({
            where: { code: roomcode },
            select: { hostId: true },
        })

        if (!room || room.hostId !== session.user.id) {
            return { success: false, message: "Only the host can delete this room" }
        }

        await prisma.room.delete({
            where:{code:roomcode}
        })
        return {success:true, message:"Room deleted"}
    } catch (error) {
        console.error(error)
        console.log("Room not found!")
    }
}
