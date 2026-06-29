# Deploying to Vercel

## Option A — Vercel CLI (fastest)

```bash
# 1. Install Vercel CLI globally (one-time)
npm install -g vercel

# 2. Inside the project folder
cd imessage-generator

# 3. Deploy (first time will ask you to log in and set up the project)
vercel

# 4. For production deployment
vercel --prod
```

Vercel auto-detects Vite. The included `vercel.json` sets the build command, output directory, and SPA rewrite rule.

---

## Option B — Vercel Dashboard (no CLI needed)

1. Push the project to a GitHub / GitLab / Bitbucket repo
2. Go to https://vercel.com → **Add New Project**
3. Import your repo
4. Vercel auto-detects **Vite** — keep all defaults
5. Click **Deploy**

Every push to `main` will redeploy automatically.

---

## Option C — Deploy from ZIP (no git needed)

1. Go to https://vercel.com/new
2. Drag and drop the project folder (or ZIP) onto the page
3. Click **Deploy**

---

## Environment

No environment variables needed — the app is entirely client-side.
Node.js 18+ required for the build step.

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → /dist
npm run preview  # preview the production build locally
```
