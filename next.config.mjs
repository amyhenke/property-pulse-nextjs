/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // need to configure images from external domains
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;
