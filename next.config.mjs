// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_MONGODB_URI: process.env.NEXT_MONGODB_URI,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

export default nextConfig;
