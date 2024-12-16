"use server";

import connectDB from "@/config/database";
import Property from "../models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

async function addProperty(formData) {
    // get the value of the input named 'name' from the submitted form data
    // console.log(formData.get("name"));

    // get value of amenities checkboxes in an array (each input for each amenity has the name="amenities")
    // console.log(formData.getAll("amenities"));

    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
        // when throw an error in this way, it will shows a page called error.jsx (will create it)
        throw new Error("User ID is required");
    }

    const { userId } = sessionUser;

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData
        .getAll("images")
        // remove any empty names
        .filter((image) => image.name !== "");
    // instead of returning full image object, replace each image obj with just image.name property
    // .map((image) => image.name);

    // combine all submitted data with edited amenties and images
    const propertyData = {
        // connect it to a user, know who submitted the property
        owner: userId,
        type: formData.get("type"),
        name: formData.get("name"),
        description: formData.get("description"),
        location: {
            street: formData.get("location.street"),
            city: formData.get("location.city"),
            state: formData.get("location.state"),
            zipcode: formData.get("location.zipcode"),
        },
        beds: formData.get("beds"),
        baths: formData.get("baths"),
        square_feet: formData.get("square_feet"),
        amenities,
        rates: {
            nightly: formData.get("rates.nightly"),
            weekly: formData.get("rates.weekly"),
            monthly: formData.get("rates.monthly"),
        },
        seller_info: {
            name: formData.get("seller_info.name"),
            email: formData.get("seller_info.email"),
            phone: formData.get("seller_info.phone"),
        },
    };

    // array to store the urls of uploaded images
    const imageUrls = [];

    // loop over all image files and convert them to base64
    // images is image objects that are getting uploaded in the form
    for (const imageFile of images) {
        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        // convert to base64 to send with the request
        const imageBase64 = imageData.toString("base64");

        // make request to cloudinary - upload images as add/submit form
        const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            {
                // saves all uploaded images to propertypulse folder in the media explorer
                folder: "propertypulse",
            }
        );

        // this secure_url property is the cloudinary url we want to add to the DB
        imageUrls.push(result.secure_url);
    }

    // then add images to the propertyData object with the value of imageUrls
    propertyData.images = imageUrls;

    // save propertyData obj to Property model
    const newProperty = new Property(propertyData);

    // save to the DB
    await newProperty.save();

    revalidatePath("/", "layout");
    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
