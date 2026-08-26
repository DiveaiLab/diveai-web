# DiveAI Web

Next.js App Router site deployed to Cloudflare with OpenNext. The admin area uses Cloudflare Access and D1. R2-backed image uploads are prepared but can be disabled until the bucket is available.

## Setup

```bash
npm install
cp .env.example .env.local
```

For local admin development, set this in `.env.local`:

```bash
CMS_AUTH_BYPASS=true
```

`CMS_AUTH_BYPASS` defaults to disabled when it is not set, and the bypass is ignored in production.

Image uploads are disabled by default while R2 is not available:

```bash
CMS_CONTENT_ASSETS_ENABLED=false
```

## Development

```bash
npm run dev
```

`next.config.ts` calls `initOpenNextCloudflareForDev()` so API routes can read Cloudflare bindings through `getCloudflareContext()` while using `next dev`.

Open:

```text
http://localhost:3000
http://localhost:3000/admin
```

The first admin module is content management at `/admin/content`. It currently supports AI explainer articles.

## Cloudflare Resources

Configured bindings in `wrangler.jsonc`:

| Binding | Resource |
| --- | --- |
| `DB` | D1 database `web-prod` |
| `CONTENT_ASSETS` | R2 bucket `web-assets-prod` when image uploads are enabled |

Create resources when needed:

```bash
npx wrangler d1 create web-prod
npx wrangler r2 bucket create web-assets-prod
```

To enable image uploads later, uncomment the `r2_buckets` binding in `wrangler.jsonc` and set `CMS_CONTENT_ASSETS_ENABLED=true`.

Apply D1 migrations:

```bash
npx wrangler d1 migrations apply web-prod --local
npx wrangler d1 migrations apply web-prod --remote
```

## Admin Auth

Production admin access has two layers:

1. Cloudflare Access Email OTP protects `/admin/*` and `/api/admin/*`.
2. The app checks the Access email against the D1 `admin_users` allowlist.

Local development can bypass the app-level allowlist with `CMS_AUTH_BYPASS=true`.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` uses Next/Turbopack and may require an environment that allows helper processes and local port binding.
