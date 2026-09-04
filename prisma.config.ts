// Prisma 7 config file. In Prisma 7, the datasource URL used by the CLI
// (for `prisma generate`, `db push`, `studio`, etc.) lives here instead of
// in schema.prisma — the schema itself no longer carries a `url`. This only
// affects local CLI commands; the deployed app reads DATABASE_URL directly
// via the Neon adapter in lib/db.ts, independent of this file.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
