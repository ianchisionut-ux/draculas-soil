# Launch guide — Dracula's Soil

## 0. What you got

A fully functional Next.js 16 site:
- Store with a single product now (extendable to as many as you want) and
  payment via **Stripe Checkout**
- Admin dashboard at `/admin` — a single account, with:
  - Product CRUD (name, price, stock, description, image upload)
  - Order list and detail, with status updates
  - **Stripe settings editable from the UI** (keys are saved encrypted in
    the database, editable anytime, no redeploy needed)
  - Site settings (name, tagline, currency, shipping, SEO)
  - Password change
- Technical SEO: `sitemap.xml`, `robots.txt`, Schema.org structured data
  (Product + Organization) on every page

## 1. Run locally (Windows / PowerShell)

```powershell
cd draculas-soil
npm install
copy .env.example .env
```

Open `.env` and fill in:
- `AUTH_SECRET` — generate with `npx auth secret`
- `APP_ENCRYPTION_KEY` — generate with:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `DATABASE_URL` — a real Postgres connection string (see step 3, Neon)
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` — your initial admin account

Then:

```powershell
npm run db:push      # creates the tables in the database
npm run db:seed      # creates the admin account + an example product
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin/login

## 2. GitHub

```powershell
git init
git add .
git commit -m "Initial commit - Dracula's Soil"
```

Create a new repo on GitHub, then:

```powershell
git remote add origin https://github.com/<user>/draculas-soil.git
git branch -M main
git push -u origin main
```

## 3. Production database — Neon (Postgres)

1. Account at https://neon.tech → **Create Project** → pick a name (e.g. `draculas-soil`)
2. Copy the **Connection string** (the "pooled" variant, recommended for Vercel)
3. Put it in `DATABASE_URL`, both locally in `.env` and in Vercel's environment variables

## 4. Vercel

1. https://vercel.com → **Add New Project** → import `draculas-soil` from GitHub
2. Under **Environment Variables**, add everything from your `.env` (except
   the Stripe keys — those get configured from `/admin` after the site is live)
3. Add a **Blob Store** from the project's Storage tab → this auto-generates `BLOB_READ_WRITE_TOKEN`
4. Deploy

## 5. Stripe

1. Account at https://dashboard.stripe.com
2. **Developers → API keys** — copy the Publishable key and Secret key
3. Go to `https://your-site.com/admin/settings/stripe` and paste them there (no redeploy needed)
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://your-site.com/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy the resulting signing secret (`whsec_...`) and paste it into `/admin/settings/stripe` too

## 6. Domain

1. In Vercel → Project → Settings → Domains → add your domain
2. At your registrar, set:
   - an `A` record pointing to Vercel's IP, or
   - a `CNAME` pointing to `cname.vercel-dns.com`
3. Update `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables with your final domain, then redeploy

## 7. Adding new products (2-3, or as many as you want)

Everything is done from `/admin/products/new` — no code changes required.
The homepage grid and navigation automatically adapt to 1, 2, or more products.

## Security — what we made sure to handle

- Stripe keys are encrypted (AES-256-GCM) before they reach the database
- The admin password is hashed with bcrypt (cost 12), never stored in plain text
- Prices are always recalculated server-side at checkout — the browser is never trusted
- `/admin` and `/api/admin/*` are protected by middleware; no valid session → redirect to login
- The Stripe webhook verifies the cryptographic signature before processing any event
