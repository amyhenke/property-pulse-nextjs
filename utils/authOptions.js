import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/app/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                // this means it won't auto select the last google account used - good for testing
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        // invoked on successful sign-in
        async signIn({ profile }) {
            console.log(profile);

            // 1. connect to DB
            await connectDB();

            // 2. check if user exists
            const userExists = await User.findOne({ email: profile.email });

            // 3. if not, create user
            if (!userExists) {
                // truncate user name if too long - 20 chars max
                const username = profile.name.slice(0, 20);

                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture,
                });
            }

            // 4. return true to allow sign in
            return true;
        },

        // session callback function that modifies the session object
        async session({ session }) {
            // 1. get user from DB
            const user = await User.findOne({ email: session.user.email });

            // 2. assign user ID from session
            session.user.id = user._id.toString();

            // 3. return session
            return session;
        },
    },
};
