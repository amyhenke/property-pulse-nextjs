"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "../models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User ID is required");
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) throw new Error("Property Not Found");

    // Verify ownership
    if (property.owner.toString() !== userId) {
        throw new Error("Unauthorised");
    }

    // Delete images from cloudinary
    // Extract public ID from image urls
    const publicIds = property.images.map((imageUrl) => {
        // https://res.cloudinary.com/dkd2doccc/image/upload/v1734364408/propertypulse/m02el3wlneyj02udvss6.jpg
        // split each section of the url  so can get just: m02el3wlneyj02udvss6.jpg
        const parts = imageUrl.split("/");

        // get last part, then turn it into an array to remove the .jpg part - then get the first part at index 0
        return parts.at(-1).split(".").at(0);
    });

    // Delete the images
    if (publicIds.length > 0) {
        for (let publicId of publicIds) {
            await cloudinary.uploader.destroy("propertypulse/" + publicId);
        }
    }

    // Delete if authorised - deleteOne() is called on property that we found
    await property.deleteOne();

    // purge cached data for a specific path
    revalidatePath("/", "layout");
}

export default deleteProperty;
