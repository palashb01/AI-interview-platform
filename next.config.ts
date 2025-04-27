import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'picsum.photos',
      // add any other external hosts you use here
    ],
  },
};

export default nextConfig;
