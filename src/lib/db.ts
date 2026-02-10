import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Neon Serverless Adaptörünü Kuruyoruz
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const db =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter, // Hafif adaptörü Prisma'ya veriyoruz
        log: ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;