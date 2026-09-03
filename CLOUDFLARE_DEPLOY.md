# Migrare pe Cloudflare — Dracula's Soil

Acest ghid presupune că modificările din acest commit (adaptorul OpenNext,
`wrangler.jsonc`, ruta de upload rescrisă) sunt deja în `main`. Baza de date
(Neon/Postgres) **nu se mută** — rămâne exact cum e, Cloudflare Workers se
conectează la ea la fel ca Vercel.

## 0. Ce s-a schimbat în cod

- `@vercel/blob` → un bucket R2 (`PRODUCT_IMAGES`), accesat direct prin
  binding-ul Cloudflare (fără chei API separate).
- `sharp` → Images binding-ul Cloudflare (nativ în Workers; `sharp` nu poate
  rula acolo, are cod nativ).
- Adaptor de deploy: **OpenNext for Cloudflare** (`@opennextjs/cloudflare`),
  varianta recomandată oficial pentru Next.js cu SSR/rute API pe Workers.
- `next` a fost urcat la `16.3.4` (de la `16.2.11`) — versiunea minimă cerută
  de adaptor.

## 1. Cont Cloudflare + Wrangler

```bash
npm install
npx wrangler login
```

## 2. Creează bucket-urile R2

```bash
npx wrangler r2 bucket create draculas-soil-cache   # cache ISR intern, opac
npx wrangler r2 bucket create draculas-soil-images  # pozele de produse
```

Pentru `draculas-soil-images`, activează acces public (Dashboard →
R2 → bucket-ul → Settings → Public access → Allow), și notează URL-ul
`https://pub-xxxxxxxx.r2.dev` care apare. Dacă vrei un domeniu propriu
(ex. `img.draculassoil.com`), îl poți atașa din același ecran — atunci
folosești acel domeniu în loc de `.r2.dev`.

## 3. Variabile de mediu

Cele publice (client-side) merg în `wrangler.jsonc` sub `vars`, cele
secrete (server-side) prin `wrangler secret put`. Astea sunt toate cele
folosite de aplicație (deduse din cod):

```bash
npx wrangler secret put DATABASE_URL          # connection string Neon (pooled)
npx wrangler secret put AUTH_SECRET            # npx auth secret
npx wrangler secret put APP_ENCRYPTION_KEY     # node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Și în `wrangler.jsonc`, adaugă:

```jsonc
"vars": {
  "NEXT_PUBLIC_SITE_URL": "https://draculassoil.com",
  "NEXT_PUBLIC_R2_DEV_URL": "https://pub-xxxxxxxx.r2.dev"
  // sau, dacă ai atașat un domeniu propriu bucket-ului de imagini:
  // "NEXT_PUBLIC_R2_CUSTOM_DOMAIN": "img.draculassoil.com"
}
```

Cheile Stripe și Resend **nu** sunt necesare aici — rămân exact cum erau,
editabile din `/admin/settings/stripe` (sunt salvate criptat în baza de
date, nu în variabile de mediu).

## 4. Primul deploy (pe subdomeniul workers.dev, fără să atingi DNS-ul încă)

```bash
npm run cf:deploy
```

Asta îți dă o adresă de tipul `https://draculas-soil.<subdomeniul-tău>.workers.dev`.
**Testează tot aici înainte să schimbi orice la domeniu:**
- Homepage, pagina de produs
- Login admin (`/admin/login`) — verifică sesiunea (NextAuth)
- Upload de imagine la un produs (verifică bucket-ul R2, se vede poza?)
- Un checkout de test cu Stripe (cheile de test, din `/admin/settings/stripe`)
- Webhook-ul Stripe — trebuie re-adăugat cu noua adresă (pasul 6)

## 5. Domeniu propriu

Din Cloudflare Dashboard → Workers & Pages → proiectul tău → Settings →
Domains & Routes → Add Custom Domain, adaugă `draculassoil.com` (sau
domeniul tău). Dacă domeniul e deja pe Cloudflare (nameservers), asta
configurează DNS-ul automat. Dacă nu, mută mai întâi nameserver-ele
domeniului la Cloudflare de la registrar.

**Recomandare ca să nu ai downtime:** lasă Vercel-ul activ până verifici că
domeniul propriu răspunde corect pe Cloudflare (propagarea DNS poate dura
de la minute la câteva ore), abia apoi treci la pasul 7.

## 6. Actualizează webhook-ul Stripe

`Dashboard Stripe → Developers → Webhooks` — șterge (sau dezactivează)
endpoint-ul vechi care pointa spre domeniul pe Vercel, adaugă unul nou cu
aceeași adresă (`https://draculassoil.com/api/webhooks/stripe`) — semnătura
webhook (`whsec_...`) se regenerează, pune-o în `/admin/settings/stripe`.

## 7. Ștergerea de pe Vercel

**Notă:** nu am găsit un proiect numit `draculas-soil` în contul Vercel
conectat la sesiunea asta (echipa `pmcustoms` are doar `next-level-agency-c4ms`
legat de alt repo) — probabil e pe alt cont/echipă Vercel. Verifică tu în
Vercel Dashboard care e proiectul exact înainte de acest pas.

Odată ce site-ul de pe Cloudflare e verificat complet pe domeniul propriu:

1. Vercel Dashboard → proiectul `draculas-soil` → Settings → Domains →
   elimină domeniul (ca să nu mai încerce să-l servească)
2. Settings → Advanced → Delete Project (ireversibil — șterge și
   deployment-urile vechi, dar **nu** și baza de date Neon, care e separată)

## Recapitulare fișiere noi/modificate

- `wrangler.jsonc`, `open-next.config.ts` — config Cloudflare/OpenNext
- `next.config.ts` — `remotePatterns` pentru R2 + hook-ul de dev
- `app/api/admin/upload/route.ts` — Images binding + R2 în loc de sharp + Vercel Blob
- `package.json` — `next` 16.3.4, dependențe noi (`@opennextjs/cloudflare`,
  `wrangler`), scripturi `cf:deploy` / `cf:preview` / `cf:typegen`
- `.gitignore` — ignoră `.open-next/`, `.wrangler/`, `cloudflare-env.d.ts`
