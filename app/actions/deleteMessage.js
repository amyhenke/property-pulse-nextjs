"use server"
import connectDB from "@/config/database"
import { getSessionUser } from "@/utils/getSessionUser"
import { revalidatePath } from "next/cache"
import Message from "../models/Message"

async function deleteMessage(messageId) {
    await connectDB()

    const sessionUser = await getSessionUser()

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required")
    }

    const { userId } = sessionUser

    const message = await Message.findById(messageId)

    if (!message) {
        throw new Error("Message not found")
    }

    // Verify ownership of message
    if (message.recipient.toString() !== userId) {
        throw new Error("Unauthorised")
    }

    await message.deleteOne()

    revalidatePath("/", "layout")
}

export default deleteMessage
