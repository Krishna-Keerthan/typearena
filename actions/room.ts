"use server"

import { authOptions } from "@/lib/nextauth-options"
import prisma from "@/lib/prisma"
import { generateRoomCode } from "@/lib/utils"
import { RoomData } from "@/types/room"
import { getServerSession } from "next-auth"

export async function createRoom(roomData: RoomData) {
    const session = getServerSession(authOptions)

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
                hostId: roomData.hostId
            }
        })

        return { success: true, data: room }
    } catch (error) {
        console.error("Failed to create the room")
    }
}


export async function getRoomByUserId(userId: string) {
    const session = getServerSession(authOptions)

    if (!session) {
        return { success: false, data: null }
    }

    try {
        const room = await prisma.room.findMany({
            where: { hostId: userId },
            select: {
                name: true,
                code: true,
                id: true,
                hostId: true,
                mode: true,
                mondeOption: true,
                user: true
            }

        })

        return { success: true, data: room }
    } catch (error) {
        console.error("Failed to fetch the room")
    }

}

export async function getRoomByCode(code: string) {
    const session = getServerSession(authOptions)

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
                hostId:true
            },
        })
        return { success: true, data: room }
    } catch (error) {
        console.error(error)
        console.log("Room not found!")
    }
}