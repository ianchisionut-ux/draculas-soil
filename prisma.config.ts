// Prisma 7 config file. In Prisma 7, the datasource URL used by the CLI
// (for `prisma generate`, `db push`, `studio`, etc.) lives here instead of
// in schema.prisma — the schema itself no longer carries a `url`. This only
// affects local CLI commands; the deployed app reads DATABASE_URL directly
// via the Neon adapter in lib/db.ts, independent of this file.
import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` does not connect to the database, but Prisma still
// requires a syntactically valid URL while loading this config. Workers
// Builds therefore use this inert fallback when DATABASE_URL is not exposed
// to the build container. The deployed Worker continues to read the real
// Cloudflare secret at runtime in lib/db.ts.
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
