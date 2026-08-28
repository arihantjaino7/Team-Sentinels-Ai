import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's Services routing doesn't expose the /_next/image optimizer
    // endpoint, so every next/image request 404s and the browser falls back
    // to alt text. Serving the files as-is is a cheap trade here: the only
    // images going through next/image are the two ~35 KB scan-choice cards
    // and the agent tiles, which are already compressed WebP.
    unoptimized: true,
  },
};

export default nextConfig;
