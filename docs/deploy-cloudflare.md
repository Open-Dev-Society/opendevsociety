# Deploying the site to Cloudflare Workers

The site runs on Cloudflare Workers through [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
(the OpenNext adapter). It turns the normal `next build` output into a Worker. `npm run dev` and `npm run build`
work exactly as before; only deploying changes.

You need: Node 20.9 or newer, this repo cloned, `npm install` done, and access to the Cloudflare account
**opendevsociety@gmail.com**. Every command below runs from the repo root.

## What lives where

| Piece | Where | Notes |
| --- | --- | --- |
| Worker config | `wrangler.jsonc` | name `opendevsociety`, `nodejs_compat`, bindings below |
| Adapter config | `open-next.config.ts` | R2 cache + Durable Object queue |
| Page cache (hourly ISR) | R2 bucket `opendevsociety-cache`, binding `NEXT_INC_CACHE_R2_BUCKET` | you create it once (step 2) |
| Revalidation queue | Durable Object `DOQueueHandler`, binding `NEXT_CACHE_DO_QUEUE` | created by the first deploy |
| Self reference | service binding `WORKER_SELF_REFERENCE` | points at the Worker itself; nothing to do |
| `GITHUB_TOKEN`, `CERT_PASSWORD` | Worker **secrets** | step 3 |
| `NEXT_PUBLIC_SITE_URL` | build time only | step 4 |

## 1. Log in to Cloudflare

```sh
npx wrangler login
```

A browser window opens. Sign in **yourself** with the opendevsociety@gmail.com account and click **Allow**.
Never paste the password into a terminal, a chat or a file. Check it worked:

```sh
npx wrangler whoami
```

## 2. Create the cache bucket (one time)

```sh
npx wrangler r2 bucket create opendevsociety-cache
```

If Cloudflare says R2 is not enabled, open the dashboard → **R2 Object Storage** and turn it on. It may ask for
a payment method. The free tier (10 GB storage, 1M writes and 10M reads a month) covers this site many times over.

The name has to match `bucket_name` in `wrangler.jsonc`. If you pick a different name, change it there too.
R2 buckets have no id to paste, only the name.

## 3. Deploy

```sh
npm run deploy
```

This builds the site (`next build` plus the adapter) and uploads it. The first time, it also creates the Worker
and the Durable Object. At the end it prints the URL, `https://opendevsociety.<your-subdomain>.workers.dev`.
Open it: every page should load. The certificate tool stays locked until step 4.

## 4. Add the secrets

```sh
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put CERT_PASSWORD
```

Each command asks for the value and hides it as you type. They take effect right away, with no redeploy.

- `GITHUB_TOKEN`: a GitHub fine-grained token. Read-only access to the org's public repos is enough for the
  site's data. The certificate tool also writes `data/certificates.json`, so give it **Contents: read and write** on
  the `opendevsociety` repo. Without a token the site falls back to its bundled snapshot.
- `CERT_PASSWORD`: the certificate tool's admin password. Pick a new, long one.

You can also set and rotate these in the dashboard: **Workers & Pages → opendevsociety → Settings → Variables and Secrets**.
Optional plain variables, all with sensible defaults: `CERT_REPO_OWNER`, `CERT_REPO_NAME`, `CERT_REPO_BRANCH`, `CERT_DATA_PATH`.

## 5. Set the site URL

`NEXT_PUBLIC_SITE_URL` is baked in **when the site is built**, for link previews and canonical URLs. Without it they
point at the old `opendevsociety.vercel.app`. Create `.env.production.local` in the repo root (git ignores it):

```sh
NEXT_PUBLIC_SITE_URL=https://your-domain.org
```

Then run `npm run deploy` again. If you use auto deploys (step 7), set it there instead.

## 6. Your own domain

**a. Move the domain's DNS to Cloudflare** (skip if it is already there)

1. Dashboard → **Add a domain** → type the domain → choose the **Free** plan.
2. Cloudflare shows two nameservers, such as `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`.
3. At your registrar (where you bought the domain), replace the existing nameservers with those two.
4. Wait for Cloudflare's email saying the domain is active. This usually takes minutes, sometimes up to a day.

Before switching, look at the domain's current DNS records (email `MX` records, for example). Cloudflare copies
most of them; check that they are all there.

**b. Attach it to the Worker**

1. **Workers & Pages → opendevsociety → Settings → Domains & Routes → Add → Custom domain**.
2. Add `your-domain.org`, then add `www.your-domain.org` the same way. Cloudflare creates the DNS records and certificates.
   Remove any old DNS records for those two names first (for example the ones pointing at Vercel), or it will refuse.

Alternatively, uncomment the `routes` block at the bottom of `wrangler.jsonc`, put the domain in, and deploy.

**c. Send www to the apex**

**your-domain.org → Rules → Redirect Rules → Create from template → "Redirect from WWW to root"**,
status 301, and deploy the rule. `https://www.your-domain.org/anything` now lands on `https://your-domain.org/anything`.

Then set `NEXT_PUBLIC_SITE_URL` to the apex (step 5) and redeploy.

## 7. Optional: deploy on every push (Workers Builds)

1. **Workers & Pages → opendevsociety → Settings → Builds → Connect** and pick the GitHub repo `Open-Dev-Society/opendevsociety`.
2. Production branch: `master`. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`.
3. **Build variables and secrets**: add `NEXT_PUBLIC_SITE_URL`. Optionally add `GITHUB_TOKEN`, so the pages built
   at deploy time have live data rather than the snapshot. The runtime secrets from step 4 stay as they are.

Each push to `master` then deploys. Other branches get preview builds.

## Test locally in the Workers runtime

```sh
cp .dev.vars.example .dev.vars   # fill in a throwaway CERT_PASSWORD; GITHUB_TOKEN optional
npm run preview                  # builds, then serves on http://localhost:8787
```

`.dev.vars` holds local secrets for the preview only. Never commit it (git ignores it).
`npm run cf-typegen` regenerates `cloudflare-env.d.ts` (binding types) if you ever read bindings in code.

## Things to know

- **Images are not resized by Cloudflare.** `next.config.ts` sets `images.unoptimized`. The only `next/image` use is
  GitHub avatars, which already request the exact 2× size from GitHub (`?s=`), so they look the same.
  Cloudflare's image resizing would be a metered add-on.
- **Hourly ISR**: pages with `revalidate = 3600` and the GitHub fetches are cached in R2. The first visit after
  an hour gets the cached copy and triggers a background refresh, so the next visit is fresh.
  There is no tag cache because the app never calls `revalidateTag`/`revalidatePath`. If you add those, see
  [OpenNext caching](https://opennext.js.org/cloudflare/caching).
- **`middleware.ts` stays as `middleware.ts`.** Next 16 prints a warning suggesting `proxy.ts`. However, `proxy.ts` always
  runs on Node, which the adapter only supports experimentally. `middleware.ts` runs on the edge runtime, which is
  fully supported.
- **Plan limits**: the Worker is about 1.4 MB gzipped, under the free plan's 3 MB. The free plan allows 100k
  requests a day and 10 ms of CPU per request. Cached pages fit easily. If logs show "Exceeded CPU time limit"
  (error 1102) on page refreshes, move to Workers Paid ($5/month).
- **Logs**: **Workers & Pages → opendevsociety → Logs** (observability is on), or `npx wrangler tail` live.
- **Rollback**: **Deployments** tab → pick an older version → **Rollback**.


## If the deploy stalls on "Populating remote R2 incremental cache"

You'll see lines like `Failed to send request to R2 worker: The operation was aborted due to timeout. Retrying...`.
The deploy uploads every cached page to R2, and a slow connection times out when too many go at once.
`npm run deploy` already sends them 4 at a time (`--cacheChunkSize=4`). If it still times out, stop it with Ctrl+C and run
`npx opennextjs-cloudflare deploy --cacheChunkSize=1` (no rebuild needed; it reuses `.open-next`).

The warning "no such Durable Object class is exported from the worker" for `DOQueueHandler` is a false alarm: the
generated `.open-next/worker.js` does export it.
