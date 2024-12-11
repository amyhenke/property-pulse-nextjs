import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
    // otherwise get a warning message - ensures only fields specified in our schema will be saved to the DB
    mongoose.set("strictQuery", true);

    // If DB is already connected, don't connect again
    if (connected) {
        console.log("MongoDB is already connected");
        return;
    } else {
        // Connect to MongoDB
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            connected = true;
        } catch (error) {
            console.log(error);
        }
    }
};

export default connectDB;
