"use server"

import connectDB from "@/config/database"
import Message from "../models/Message"
import { getSessionUser } from "@/utils/getSessionUser"

async function addMessage(previousState, formData) {
    await connectDB()

    const sessionUser = await getSessionUser()

    if (!sessionUser || !sessionUser.userId) {
        // when throw an error in this way, it will shows a page called error.jsx (will create it)
        throw new Error("User ID is required")
    }

    const { userId } = sessionUser

    const recipient = formData.get("recipient")

    if (userId === recipient) {
        return {
            error: "You cannot send a message to yourself",
        }
    }

    // save propertyData obj to Property model
    const newMessage = new Message({
        sender: userId,
        recipient,
        property: formData.get("property"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        body: formData.get("body"),
    })

    // save to the DB
    await newMessage.save()

    return { submitted: true }
}

export default addMessage
