import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["error"],
    }).$extends(withAccelerate()) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;