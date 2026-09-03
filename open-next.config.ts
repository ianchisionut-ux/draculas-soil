import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Uses the NEXT_INC_CACHE_R2_BUCKET binding (see wrangler.jsonc) to store
// Next.js's ISR / data cache on Cloudflare instead of the filesystem.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
