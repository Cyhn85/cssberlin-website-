import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  earlyAccess: true,
  schema: path.join(__dirname, "schema.prisma"),

  migrate: {
    async adapter() {
      const { Pool } = await import("@neondatabase/serverless");
      const { PrismaNeon } = await import("@prisma/adapter-neon");

      const connectionString = process.env.DATABASE_URL!;
      const pool = new Pool({ connectionString });
      return new PrismaNeon(pool);
    },
  },
} satisfies PrismaConfig;
