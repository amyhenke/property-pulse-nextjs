import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const getSessionUser = async () => {
    // no trycatch here as error during deployment on vercel
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return null;
    }

    return {
        user: session.user,
        userId: session.user.id,
    };
};
