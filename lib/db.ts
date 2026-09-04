import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
// IMPORTANT: import from '@prisma/client/edge', not the default '@prisma/client'.
// The default entrypoint uses Prisma's native "library" query engine, which
// tries to load a compiled binary from disk (fs.readdir/fs.readFile) to pick
// the right engine for the platform — that filesystem access doesn't exist on
// Cloudflare Workers and crashes every query with "[unenv] fs.readdir is not
// implemented yet!". The '/edge' entrypoint uses the WASM-compiled query
// engine instead, which has no filesystem dependency and works together with
// the Neon driver adapter on both Cloudflare Workers and Node.js.
import { PrismaClient } from '@prisma/client/edge';

// No neonConfig.webSocketConstructor here on purpose: forcing Node's `ws`
// package (raw TCP sockets) breaks on the Cloudflare Workers runtime, which
// only has the native WebSocket global. Leaving this unset makes the Neon
// driver fall back to the native `WebSocket` global, which both Cloudflare
// Workers and Node.js 22+ provide — so it works in both places without a
// runtime-specific branch.

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });