import { neon, neonConfig } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// Use neon to create a connection
const sql = neon(connectionString);

// Initialize the Prisma adapter with the sql connection
const adapter = new PrismaNeonHTTP(sql);

// Initialize PrismaClient with the adapter
export const prisma = new PrismaClient({ adapter });