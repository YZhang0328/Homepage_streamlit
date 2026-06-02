# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Yujia Zhang. The primary site is a Next.js + Vite app deployed at **yujiazhang.co.uk** via Netlify (source in `portfolio-next/`). A legacy Streamlit entry point (`Homepage.py`) redirects all traffic to the new site.

Yujia's background is **Energy Modelling and Quantitative Research**. All content should reflect this positioning. The target audience is professionals working in energy modelling, quant research, and adjacent fields (AI in finance, power markets, financial infrastructure).

## Running the App

```bash
cd portfolio-next
npm install
npm run dev        # local dev
npm run build      # production build → dist/
```

## Architecture

**Next.js / Vite multi-page SPA** (React + TypeScript + Tailwind CSS):

- `portfolio-next/src/pages/Home.tsx` — Landing page with bio, profile, and professional summary.
- `portfolio-next/src/pages/Research.tsx` — Academic publications and ML/energy research.
- `portfolio-next/src/pages/News.tsx` — Four-tab market intelligence board (see below).
- `portfolio-next/src/data/newsDesk.ts` — **All content data** for the News page: events, desk definitions, stories, and publishing packets.
- `portfolio-next/src/components/` — Shared UI components (Navbar, Footer, BrandTicker).
- `portfolio-next/src/App.tsx` — Router and layout shell.

**Key pattern:** Content is data-driven. The News page reads from `newsDesk.ts`; updating that file is the only change needed to refresh all four tabs.

**SEO toolchain (runs automatically inside `npm run build`):**
- `portfolio-next/scripts/generate-seo.ts` — **prebuild.** Generates `public/sitemap.xml` (with `changefreq`/`priority`), `public/feed.xml` (RSS), `public/robots.txt`, and `public/og/{desk}/{slug}.png` OG card images.
- `portfolio-next/scripts/prerender.ts` — **postbuild.** SSR-renders all routes and bakes SEO meta tags (title, description, OG, `article:` tags, JSON-LD) into every `dist/{route}/index.html`. This is what search bots and social-sharing crawlers read — not the JS bundle.
- `portfolio-next/src/components/Seo.tsx` — client-side mirror. Uses `useEffect` to keep meta tags in sync during SPA navigation after the page has loaded in a browser.

**Critical rule:** When making any SEO change, update **both** `prerender.ts` (what bots see) and `Seo.tsx` (what live navigation sees). They must stay in sync. The JSON-LD schemas in use are: `Person` + `WebSite` (home), `BlogPosting` + `BreadcrumbList` (articles), `Event` (event detail), `CollectionPage` (archive/tag pages).

---

## Market News Page — Content Strategy

The News page (`/news`) has four tabs defined in `newsDesk.ts`. Content must be refreshed regularly (target: every 1–3 weeks) to reflect the latest developments. Below are the rules for each tab.

### Tab 1 — AI & Finance Events (`desk=events`)

**Source:** Manually researched, fact-checked events.

**Criteria (prioritise in this order):**
1. Free admission or free fringe access
2. High signal-to-noise quality (practitioners, not vendor showcases)
3. Relevance: AI × Finance, AI × Energy, or Quant/Energy Modelling
4. London-based or accessible online (no geographic filter otherwise)

**Data structure:** `EventListing[]` — title, date, venue, price, description, link, source, type.

**Rules:**
- Never list events that have already passed (current date is in CLAUDE.md context).
- Verify event details from the source URL before listing.
- Always include the `link` field pointing to the official event page.
- Label `price` as "Free", "Free (fringe)", "Registration", or "Paid".

---

### Tabs 2–4 — News Desks

The three news desks are:

| Tab | `desk=` | Topic |
|-----|---------|-------|
| AI News | `ai` | LLMs, agents, evals, enterprise AI deployment |
| Markets & Power | `markets` | Energy markets, power grids, AI electricity demand, oil/gas, macro |
| Financial Infrastructure | `finance` | Payments, stablecoins, fintech licensing, agentic commerce |

**Story count per desk:** Maintain a core set of **5 stories** per desk by default. If the user explicitly asks for more, extend beyond 5 only with genuinely distinct, high-signal additions. In those cases, keep the first 5 as the editorial core and make sure any extra stories are recent enough and different enough in mechanism or search intent to justify the added count.

**Content process for each refresh:**
1. **Research** — Search for the past 2–4 weeks' most significant developments in the desk topic. Focus on developments with structural or quantitative significance, not just press releases.
2. **Lead story selection** — Pick the single highest-signal story; this becomes the featured card (`stories[0]`).
3. **Supporting stories** — 2–3 additional stories that are complementary in angle (not overlapping).
4. **Feature panel** — Update `feature.title` and `feature.summary` to reflect the current editorial angle of the desk.

**Article quality standards (all desks):**
- **Style:** Bloomberg-style lead (news + stakes in one sentence), professional analytical body, mathematically literate framing where relevant, concise strategic close.
- **Structure per story:**
  - `headline`: max 12 words, declarative, non-clickbait
  - `dek`: 1–2 sentences expanding the stakes; max 35 words
  - `paragraphs`: 4–5 paragraphs, each 3–5 sentences; each paragraph advances the argument
  - `modelView`: 1–2 sentences with a quantitative or systems framing of the core insight
  - `bottomLine`: 1 crisp sentence — the single takeaway an analyst would write in a research note
- **No filler.** Every paragraph must add information or argument not in the previous one.
- **Length discipline:** New stories should stay broadly comparable in density and reading length to the stronger existing long-form stories already on the page unless the user explicitly asks for shorter briefs.
- **No invented facts.** If a number or claim is used, there must be a real source for it.
- **Tone:** Formal, analytical, institutionally credible. This is a professional's reading list, not a blog.

**What "Bottom Line" means:**
The `bottomLine` field is the single sentence a sell-side analyst would write at the end of a research note — the one thing a reader should remember if they forget everything else. It is not a summary of the article. It is the strategic implication in its most compressed form. It should be concrete, assertive, and ideally contain a non-obvious insight. One sentence only, no hedging.

**Publishing packet (`packet` field):**
Each story includes a `packet` for potential syndication:
- `targetKeyword`: primary SEO keyword (3–6 words, buyer intent)
- `briefing`: 2–3 sentence instruction for a long-form version (1200–1500 words)
- `tone`: always `defaultTone` (Bloomberg style)
- `audience`: always `defaultAudience` (investors, operators, technical readers)
- `sourceAnchors`: verified URLs for the key sources used

---

**Desk composition rule:**
- Do not place two stories with the same search intent or mechanism on the same desk.
- If two pieces are related, separate them by editorial layer: one structural pillar, one explainer, one policy/allocation angle, one market response.

---

### GEO (Generative Engine Optimization)

The site is structured for AI search engines (Perplexity, ChatGPT, etc.) that cite sources. These story fields directly drive AI citation signals and must be written with that in mind:

- **`dek`** — becomes the meta description and the `speakable` XPath target. Write it as a self-contained, quotable sentence that stands alone without the article. This is what AI engines extract when summarising.
- **`bottomLine`** — the most cite-worthy sentence. Write it as a standalone, assertive claim — not a summary. AI engines may lift this verbatim as the key takeaway.
- **`packet.targetKeyword`** — maps to `keywords` in the `BlogPosting` JSON-LD. Match search intent exactly (3–6 words, noun phrase). This is how the article surfaces in AI-assisted search.
- **Topic tags** (`newsTopics.ts`) — auto-populate `keywords` and `article:tag` OG meta. Each story's tags should name the mechanism, not the event (e.g. `"Capacity Pricing"` not `"PJM Auction 2026"`).

## Images

Images are Unsplash public URLs — **no API key required**.

**Standard format (use this for all new stories):**
```
https://images.unsplash.com/photo-{PHOTO_ID}?w=1080&q=80&auto=format&fit=crop
```

To find a photo ID: search [unsplash.com](https://unsplash.com), open a photo, and copy the ID from the URL (e.g. `unsplash.com/photos/abc123` → ID is `abc123`).

**Image consistency rules:**
- Always use `?w=1080&q=80&auto=format&fit=crop` — this keeps all images the same resolution and file size (~100–200 KB).
- Always set `imageClassName: "object-center"` on every story and feature panel. Do not use custom vertical offsets. Consistent centering keeps all cards visually aligned across the grid.
- Do **not** use portrait-orientation photos (taller than wide) — they break the `aspect-[16/10]` card layout.
- Prefer landscape or square photos.
- Test the URL in a browser before adding it to confirm the photo ID is valid.
- Do not reuse the same photo ID across two stories in the same desk.
- During one refresh, avoid visually repetitive images across the newly added stories even if the photo IDs differ. If two candidate images communicate nearly the same scene, replace one.
- If an arXiv, OpenReview, or official paper/slide figure is materially better than stock photography, it is allowed. When used, add a visible `imageCredit` in the story data naming the source.
- For paper or slide figures, prefer figures that directly support the article's mechanism or benchmark discussion. Do not use a paper image just because it is available.

---

## Content Toolchain (Free Tools)

### Article Generation
Use **Claude Code** (this tool) directly to generate full articles from the `packet.briefing` field in each story. The briefing field contains the word count target, tone, key points, and source anchors — pass these to Claude and refine the output.

### Publishing Script
`portfolio-next/scripts/publish.ts` publishes any story to 6 platforms in one command:
```bash
cd portfolio-next
npm run publish -- --desk ai --story <slug>
npm run publish -- --list    # show all available slugs
```
Credentials live in `portfolio-next/.env.publish` (git-ignored).

**Platforms and status:**
| Platform | Method | Status |
|----------|--------|--------|
| DEV Community (dev.to) | API key | ✅ Active |
| Hashnode | Manual only (API requires paid Pro plan since June 2025) | ⚠ Manual |
| WordPress.com (`yujiazhanguk.wordpress.com`) | Application password | ✅ Active |
| **Medium** | **Manual import only** | ⚠ API closed Jan 2025 |

**Medium workflow (manual, ~2 min per article):**
1. Publish to DEV first via the script
2. Go to medium.com → Write a story → `···` menu → **Import a story**
3. Paste the DEV article URL
4. Medium imports the full article with formatting preserved
5. Review → Publish

**Batch publish all articles:**
```bash
npm run publish -- --all
```
Already-published articles are skipped automatically (422 = duplicate). DEV rate-limits at ~5 posts/5 min — the script waits 6 seconds between articles and auto-retries on 429.

### Auto-publish pipeline (GitHub Actions)

`.github/workflows/publish-articles.yml` publishes to DEV + Hashnode on demand or biweekly.

**Workflow:**
1. Review and update `newsDesk.ts`, merge to `main`
2. Check content looks correct on the live site
3. Go to **GitHub → Actions → "Publish Articles" → Run workflow**
4. Choose platforms (default: `dev,hashnode`) and run

**GitHub Secrets required** (Settings → Secrets → Actions):
| Secret | Value |
|--------|-------|
| `DEV_API_KEY` | dev.to API key |
| `HASHNODE_TOKEN` | Hashnode personal access token |
| `HASHNODE_PUB_ID` | Hashnode publication ID |

The workflow also runs automatically on the 1st and 15th of each month at 9am UTC, but will skip already-published articles safely.

### Article Formatting Rules for External Platforms

**What external articles include (different from the website):**
- **No Model View section** — removed from all external publications
- **No Bottom Line section** — removed from all external publications
- **Expanded length (~1.5x)**: two extra paragraphs added automatically by `expandParagraphs()` — a scene-setting intro and a practitioner-implications close
- **Dek** as a blockquote — visually distinct from body text
- **First sentence of each paragraph bolded** — aids scannability
- **Image caption** below the cover image
- **Author bio with photo** at the end (photo: `https://yujiazhang.co.uk/images/Photo_Yujia.jpg`)
- **Two backlinks** to `yujiazhang.co.uk` and `yujiazhang.co.uk/news` in the bio
- **DEV**: YAML front matter sets cover image and tags automatically
- **WordPress**: inline CSS for font-size 15px / line-height 1.8, styled blockquotes, flexbox author card

**Font size on the personal website (News.tsx ArticleView):**
- Dek: `text-[0.95rem] leading-[1.75]`
- Paragraphs: `text-[0.82rem] leading-[1.8] md:text-[0.88rem]`
- Paragraph spacing: `space-y-[1.1rem]`

When updating `publish.ts` formatters, maintain all rules above. The goal is polished, editorial-quality output on every platform with no manual reformatting needed.

### Social Media Distribution
Post directly on LinkedIn. Use the `dek` as the hook sentence, then 3 bullet points from `packet.keyPoints`, then link to the DEV or Hashnode article.

### Visual Assets
No external tool required. Use the Unsplash image already attached to each story. For LinkedIn, Unsplash images can be downloaded and uploaded directly (Unsplash Licence permits commercial use).

---

## Deployment

- **Primary:** Netlify auto-deploys from `main` branch (reads `portfolio-next/`).
- **Legacy keep-alive:** GitHub Actions (`.github/workflows/keepalive.yml`) pushes empty commits every 9 hours to keep the old Streamlit Cloud app from sleeping.

---

## Content Refresh Checklist

When updating `newsDesk.ts`:

- [ ] Remove or replace any events that have passed
- [ ] All event `link` fields point to real, accessible URLs
- [ ] Lead story (`stories[0]`) is the most recent and highest-signal item
- [ ] `feature.title` and `feature.summary` match the current desk angle
- [ ] No two stories on the same desk repeat the same thesis or explanatory layer
- [ ] `date` fields on stories reflect the actual publication/event date
- [ ] `sourceAnchors` URLs are real and accessible
- [ ] No paragraph repeats information from a previous paragraph
- [ ] `bottomLine` is a single sentence, no longer
- [ ] Run `npm run build` — regenerates sitemap, OG images, RSS feed, and all prerendered HTML. **Never edit `public/sitemap.xml`, `public/feed.xml`, or `public/robots.txt` by hand** — they are overwritten on every build.
