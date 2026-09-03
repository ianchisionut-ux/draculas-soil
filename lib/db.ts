import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// Forțăm TypeScript să accepte pool-ul
const adapter = new PrismaNeon(pool as any);

// Forțăm TypeScript să accepte adaptorul
export const prisma = new PrismaClient({ adapter: adapter as any });