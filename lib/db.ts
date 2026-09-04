import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

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