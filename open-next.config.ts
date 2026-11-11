import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// Hourly ISR: pages and GitHub fetches cached in R2, regenerations queued through a Durable Object.
// No tag cache: the app never calls revalidateTag/revalidatePath.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  // Serve cached ISR/SSG pages straight from the cache without booting the Next server (keeps CPU low on Workers).
  enableCacheInterception: true,
});
