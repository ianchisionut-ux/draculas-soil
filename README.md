# Dracula's Soil

A simple online store with Stripe payments and a fully self-service admin
dashboard (Stripe keys, products, orders, password) — no code changes needed
after launch.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma ·
Postgres (Neon) · NextAuth · Stripe Checkout · Vercel Blob

See [`DEPLOY.md`](./DEPLOY.md) for the full launch steps (local → GitHub →
Neon → Vercel → Stripe → domain).

## Useful commands

```bash
npm run dev        # local dev server
npm run db:push     # apply the Prisma schema to the database
npm run db:seed     # create the admin account + an example product
npm run db:studio   # browse your data visually
npm run build        # production build
```
