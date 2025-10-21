# Deployment Guide — em-kaizen

## Overview

**em-kaizen** is a production-ready Next.js + Tailwind app for the Kaizen 1% Challenge. It includes:

- ✅ Interactive 7-day practice tracker with localStorage persistence
- ✅ Emoji check-in system (✅ 💪 🌱 🔥 😅)
- ✅ Ease rating (1–5) with trend analysis
- ✅ Print button and responsive design
- ✅ SEO meta tags & favicon
- ✅ Brand colors (plum, slate, teal, gold, rose)
- ✅ Zero dependencies beyond Next.js + Tailwind

---

## Local Development

### Prerequisites

- **Node.js** v18.18+ (check with `node --version`)
- **npm** v9+ or **pnpm** v8+ (check with `npm --version`)

### Setup & Run

```bash
cd "C:\Users\darne\OneDrive\Documents\Python Scripts\Elevated_Movements\em-kaizen"

# Install dependencies (one-time)
npm install

# Start dev server
npm run dev
```

Visit **http://localhost:3000** in your browser.

**Hot reload:** Changes to `.tsx` and `.css` files auto-reload in the browser.

---

## Production Build

```bash
npm run build

# This creates an optimized `.next/` bundle (~118 kB First Load JS)
```

To preview the production build locally:

```bash
npm run build
npm run start
# visit http://localhost:3000
```

---

## Deployment Platforms

### 1. **Vercel** (Recommended)

Vercel is the official Next.js host and provides zero-config deploy.

#### Option A: Deploy from Git (GitHub/GitLab/Bitbucket)

1. Push your code to a Git repo (GitHub, GitLab, or Bitbucket).
2. Go to **[vercel.com/new](https://vercel.com/new)** and log in with your Git account.
3. Import the repo. Vercel auto-detects Next.js and sets up correctly.
4. Click **Deploy**.

**First deploy:** ~1–2 minutes.

#### Option B: Deploy from CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. From the `em-kaizen` directory, run:
   ```bash
   vercel
   ```
   Follow the prompts (accept defaults on first run).

3. For production deploy:
   ```bash
   vercel --prod
   ```

#### Set a Custom Domain

1. In the **[Vercel Dashboard](https://vercel.com/dashboard)**, go to your project.
2. **Settings** → **Domains**.
3. Add your custom domain (e.g., `kaizen.elevatedmovements.com`).
4. Follow DNS instructions for your registrar.

---

### 2. **Netlify**

Netlify also supports Next.js with native deployment.

#### Option A: Drag & Drop

1. Build the app locally:
   ```bash
   npm run build
   ```

2. Go to **[netlify.com/drop](https://app.netlify.com/drop)**.
3. Drag & drop the `.next` folder into the drop zone.

**Note:** This is a static export; for full Next.js features, use Git-based deploy.

#### Option B: Git-Based Deploy

1. Push to GitHub, GitLab, or Bitbucket.
2. Go to **[app.netlify.com/sites](https://app.netlify.com/sites)** and click **Add new site** → **Import an existing project**.
3. Select your Git provider and repo.
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Runtime:** Enable "Next.js runtime" (if prompted)
5. Click **Deploy**.

#### Set a Custom Domain

1. In Netlify **Site settings** → **Domain management**.
2. Click **Add custom domain**.
3. Follow DNS instructions.

---

### 3. **GitHub Pages**

GitHub Pages serves static sites. Next.js supports static export with the `next export` command.

#### Setup

1. Push the repo to GitHub.
2. In your repo **Settings** → **Pages**.
3. Choose source: **GitHub Actions** or **Deploy from a branch** (main).
4. If using GitHub Actions, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    runs-on: ubuntu-latest
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

5. Update `next.config.ts` to export statically:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/em-kaizen",  // if hosting as a subpath
};

export default nextConfig;
```

6. Push & watch GitHub Actions deploy.

---

### 4. **AWS S3 + CloudFront** (Advanced)

For static hosting without server runtime:

1. Build: `npm run build`
2. Export: `next export` (requires output: "export" in `next.config.ts`)
3. Upload `out/` directory to an S3 bucket.
4. Create a CloudFront distribution pointing to the S3 bucket.
5. Add your custom domain via Route 53.

---

## Configuration

### Update Metadata

Update your site's title, description, and OpenGraph meta in **`src/app/layout.tsx`**:

```typescript
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your description",
  openGraph: {
    title: "Your Title",
    description: "Your description",
    type: "website",
    url: "https://yourdomain.com",
  },
};
```

### Customize Brand Colors

Edit **`src/app/globals.css`** CSS variables:

```css
:root {
  --em-plum: #36013f;
  --em-slate: #37475e;
  --em-teal: #176161;
  --em-gold: #e0cd67;
  --em-rose: #c3b4b3;
  /* ... */
}
```

### Add Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_API_KEY=your-secret-key
```

In your code, access public vars via `process.env.NEXT_PUBLIC_*`.

---

## Data Persistence

The tracker stores data in **localStorage** under the key:

```
em-kaizen-1pct-tracker
```

Data is **not** synced to a server. If users clear browser cache or switch devices, data is lost. To persist across devices, integrate a backend (Firebase, Supabase, etc.).

---

## Performance & Analytics

### Bundle Size

Current bundle: ~118 kB First Load JS (optimized).

### Add Analytics

To add Google Analytics or Vercel Analytics:

1. **Vercel Analytics** (automatic on Vercel):
   - No setup needed; just deploy on Vercel.

2. **Google Analytics:**
   - Install: `npm install @next/third-parties`
   - Add to `layout.tsx`:
     ```typescript
     import { GoogleAnalytics } from "@next/third-parties/google";
     export default function RootLayout(...) {
       return (
         <html>
           {/* ... */}
           <GoogleAnalytics gaId="G-XXXXX" />
         </html>
       );
     }
     ```

---

## Troubleshooting

### Build Fails

- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be v18+)

### Tracker Data Not Persisting

- Ensure cookies/localStorage are enabled in browser.
- Check browser DevTools → Application → localStorage for `em-kaizen-1pct-tracker`.
- Clear browser cache and try again.

### CSS Not Loading

- Verify Tailwind is configured in `tailwind.config.ts`.
- Restart dev server: `Ctrl+C` then `npm run dev`.

### Custom Domain DNS Issues

- Test DNS propagation: `nslookup yourdomain.com`
- Wait 24–48 hours for DNS to propagate globally.
- Check registrar's DNS settings match your host's nameservers.

---

## Next Steps

1. **Test locally:** `npm run dev` → open http://localhost:3000
2. **Customize content:** Edit `src/components/KaizenChallengePage.tsx`
3. **Deploy:** Choose a platform above and follow deploy instructions.
4. **Share:** Once live, share the URL with your advisory board!

---

## Support & Docs

- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)

---

**Happy deploying! 🚀**
