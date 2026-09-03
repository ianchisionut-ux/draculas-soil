import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// Cast adapter to any to bypass the type definition mismatch
export const prisma = new PrismaClient({ adapter: adapter as any });