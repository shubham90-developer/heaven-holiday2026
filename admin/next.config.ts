import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  sassOptions: {
    loadPaths: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "src/assets/scss"),
    ],
  },
};

export default nextConfig;
