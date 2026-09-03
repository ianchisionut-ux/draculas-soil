import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// Ignorăm ambele erori de TypeScript cu @ts-expect-error
// @ts-expect-error
const adapter = new PrismaNeon(pool);

// @ts-expect-error
export const prisma = new PrismaClient({ adapter });