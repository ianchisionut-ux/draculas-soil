import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Public URL of the R2 bucket that replaced Vercel Blob for product
      // photos (either the *.r2.dev dev domain, or a custom domain you
      // attach to the bucket — see CLOUDFLARE_DEPLOY.md).
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: process.env.R2_CUSTOM_DOMAIN || "images.invalid" },
    ],
  },
};

export default nextConfig;

// Lets `next dev` simulate Cloudflare bindings (R2, Images, etc.) locally
// so `getCloudflareContext()` works the same in dev and in production.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
