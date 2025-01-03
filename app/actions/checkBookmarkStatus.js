"use server"
import connectDB from "@/config/database"
import { getSessionUser } from "@/utils/getSessionUser"
import { revalidatePath } from "next/cache"
import User from "../models/User"

async function checkBookmarkStatus(propertyId) {
    await connectDB()

    const sessionUser = await getSessionUser()

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required")
    }

    const { userId } = sessionUser

    const user = await User.findById(userId)

    // look inside user DB in 'bookmarks' field to see if property with that ID is included
    let isBookmarked = user.bookmarks.includes(propertyId)

    return { isBookmarked }
}

export default checkBookmarkStatus
