"use server"
import connectDB from "@/config/database"
import { getSessionUser } from "@/utils/getSessionUser"
import { revalidatePath } from "next/cache"
import User from "../models/User"

async function bookmarkProperty(propertyId) {
    await connectDB()

    const sessionUser = await getSessionUser()

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required")
    }

    const { userId } = sessionUser

    const user = await User.findById(userId)

    // look inside user DB in 'bookmarks' field to see if property with that ID is included
    let isBookmarked = user.bookmarks.includes(propertyId)

    let message

    if (isBookmarked) {
        // if already bookmarked, then remove it
        user.bookmarks.pull(propertyId)
        message = "Bookmark removed"
        isBookmarked = false
    } else {
        // if not bookmarked, then add it
        user.bookmarks.push(propertyId)
        message = "Bookmark added"
        isBookmarked = true
    }

    // save the bookmarks to the DB
    await user.save()
    // revalidate this page as thats where the saved data is shown
    revalidatePath("/properties/saved", "page")

    return {
        message,
        isBookmarked,
    }
}

export default bookmarkProperty
