import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// @ts-ignore - Ignorăm complet conflictul fals de tipuri din TypeScript
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });