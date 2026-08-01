import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { desks } from "../src/data/newsDesk.ts";
import { getStoryTopics, getTopicsWithCounts } from "../src/data/newsTopics.ts";
import { getStoriesForHub, getTopicHubs } from "../src/data/topicHubs.ts";

const SITE_URL = (
  process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://yujiazhang.co.uk"
).replace(/\/+$/, "");
const BASE_LASTMOD_ISO = "2026-01-01T00:00:00.000Z";

function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isPagePath =
    normalizedPath !== "/" &&
    !normalizedPath.endsWith("/") &&
    !/\/[^/?#]+\.[^/?#]+(?:[?#].*)?$/.test(normalizedPath);
  return `${SITE_URL}${normalizedPath}${isPagePath ? "/" : ""}`;
}

function getLatestStoryIso() {
  let latest = 0;

  for (const desk of desks) {
    for (const story of desk.stories) {
      const storyIso = storyLastModIso(story);
      const timestamp = Date.parse(storyIso);
      if (!Number.isNaN(timestamp) && timestamp > latest) {
        latest = timestamp;
      }
    }
  }

  return latest ? new Date(latest).toISOString() : BASE_LASTMOD_ISO;
}

const LASTMOD_ISO = getLatestStoryIso();

function parseLastMod(dateLabel: string) {
  const timestamp = Date.parse(dateLabel);
  return Number.isNaN(timestamp) ? BASE_LASTMOD_ISO : new Date(timestamp).toISOString();
}

function storyLastModIso(story: { date: string }) {
  return parseLastMod(story.date);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeAttr(value: string) {
  return escapeXml(value).replace(/\n/g, " ");
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function htmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function storyHtmlContent(story: { headline: string; dek: string; paragraphs: string[]; image: string; imageAlt: string }) {
  const body = story.paragraphs.map((paragraph) => `<p>${htmlEscape(paragraph)}</p>`).join("");
  return [
    `<p><strong>${htmlEscape(story.dek)}</strong></p>`,
    `<p><img src="${htmlEscape(story.image)}" alt="${htmlEscape(story.imageAlt)}" style="max-width:100%;height:auto;" /></p>`,
    body,
  ].join("");
}

function wrapText(value: string, maxChars: number, maxLines: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines.map((line) =>
      line.length > maxChars ? `${line.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...` : line
    );
  }

  const truncated = lines.slice(0, maxLines);
  const lastIndex = truncated.length - 1;
  const lastLine = truncated[lastIndex];
  truncated[lastIndex] =
    lastLine.length > maxChars
      ? `${lastLine.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`
      : `${lastLine}...`;

  return truncated;
}

const deskThemes: Record<
  string,
  {
    bgA: string;
    bgB: string;
    accent: string;
    accentSoft: string;
    highlight: string;
    foreground: string;
  }
> = {
  finance: {
    bgA: "#07111d",
    bgB: "#123258",
    accent: "#93c5fd",
    accentSoft: "#2563eb",
    highlight: "#fbbf24",
    foreground: "#f8fbff",
  },
  ai: {
    bgA: "#10091f",
    bgB: "#34114f",
    accent: "#d8b4fe",
    accentSoft: "#7c3aed",
    highlight: "#67e8f9",
    foreground: "#fbf7ff",
  },
  markets: {
    bgA: "#06131b",
    bgB: "#173a2a",
    accent: "#86efac",
    accentSoft: "#16a34a",
    highlight: "#fbbf24",
    foreground: "#f2fff6",
  },
};

function buildSignalBars(seed: number) {
  return Array.from({ length: 7 }, (_, index) => {
    const value = (seed >> (index * 3)) & 15;
    return 42 + value * 8;
  });
}

function renderOgSvg(args: {
  deskId: string;
  deskLabel: string;
  kicker: string;
  headline: string;
  dek: string;
  image: string;
  date: string;
  slug: string;
}) {
  const theme = deskThemes[args.deskId] ?? deskThemes.finance;
  const titleLines = wrapText(args.headline, 19, 4);
  const dekLines = wrapText(args.dek, 44, 3);
  const topics = getStoryTopics(args.slug).slice(0, 2);
  const titleYStart = 188;
  const titleLineHeight = 58;
  const dekYStart = titleYStart + titleLines.length * titleLineHeight + 18;
  const chipY = dekYStart + dekLines.length * 32 + 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(args.headline)}</title>
  <desc id="desc">${escapeXml(args.dek)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${theme.bgA}" />
      <stop offset="100%" stop-color="${theme.bgB}" />
    </linearGradient>
    <linearGradient id="photoOverlay" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#02040a" stop-opacity="0.82" />
      <stop offset="48%" stop-color="#02040a" stop-opacity="0.58" />
      <stop offset="100%" stop-color="#02040a" stop-opacity="0.16" />
    </linearGradient>
    <linearGradient id="photoTint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.34" />
      <stop offset="100%" stop-color="${theme.highlight}" stop-opacity="0.12" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${theme.accentSoft}" stop-opacity="0.75" />
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.highlight}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.65" />
    </linearGradient>
    <linearGradient id="titleFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.foreground}" stop-opacity="1" />
      <stop offset="100%" stop-color="${theme.foreground}" stop-opacity="0.84" />
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.11" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.3" />
    </filter>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" fill="none" />
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <image href="${escapeAttr(args.image)}" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice" />
  <rect width="1200" height="630" fill="url(#photoOverlay)" />
  <rect width="1200" height="630" fill="url(#photoTint)" opacity="0.38" />
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.35" />
  <circle cx="980" cy="126" r="150" fill="${theme.accent}" fill-opacity="0.16" filter="url(#blur)" />
  <circle cx="1050" cy="472" r="180" fill="${theme.highlight}" fill-opacity="0.14" filter="url(#blur)" />
  <circle cx="208" cy="520" r="110" fill="${theme.accentSoft}" fill-opacity="0.24" filter="url(#blur)" />
  <path d="M760 0H1200V286C1110 216 978 154 760 0Z" fill="#ffffff" fill-opacity="0.04" />

  <rect x="42" y="42" width="1116" height="546" rx="36" fill="#050b14" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.12" filter="url(#softShadow)" />
  <rect x="64" y="64" width="640" height="502" rx="30" fill="#02040a" fill-opacity="0.42" stroke="#ffffff" stroke-opacity="0.10" />
  <rect x="64" y="64" width="8" height="502" rx="4" fill="url(#accent)" />

  <g>
    <text x="92" y="110" fill="${theme.foreground}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="0.16em">SIGNAL BOARD</text>
    <text x="92" y="138" fill="${theme.accent}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="0.22em">${escapeXml(args.deskLabel.toUpperCase())}</text>
    <rect x="92" y="152" width="144" height="36" rx="18" fill="url(#accent)" />
    <text x="164" y="176" fill="#ffffff" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700">${escapeXml(args.kicker.toUpperCase())}</text>
  </g>

  <text x="92" y="${titleYStart}" fill="url(#titleFade)" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800" letter-spacing="-0.045em">
    ${titleLines
      .map((line, index) => {
        const dy = index === 0 ? 0 : titleLineHeight;
        return `<tspan x="92" dy="${dy}">${escapeXml(line)}</tspan>`;
      })
      .join("")}
  </text>

  <text x="92" y="${dekYStart}" fill="#d7e3f3" fill-opacity="0.96" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="500">
    ${dekLines
      .map((line, index) => {
        const dy = index === 0 ? 0 : 34;
        return `<tspan x="92" dy="${dy}">${escapeXml(line)}</tspan>`;
      })
      .join("")}
  </text>

  <line x1="92" y1="${chipY - 8}" x2="300" y2="${chipY - 8}" stroke="url(#accentLine)" stroke-width="3" stroke-linecap="round" />
  <g>
    ${topics
      .map((topic, index) => {
        const x = 92 + index * 188;
        const fill = index === 0 ? "url(#accent)" : "#ffffff";
        const fillOpacity = index === 0 ? 1 : 0.08;
        const strokeOpacity = index === 0 ? 0.1 : 0.28;
        return `
        <rect x="${x}" y="${chipY}" width="170" height="36" rx="18" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${theme.accent}" stroke-opacity="${strokeOpacity}" />
        <text x="${x + 85}" y="${chipY + 24}" fill="${theme.foreground}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600">${escapeXml(topic.label)}</text>`;
      })
      .join("")}
  </g>

  <g filter="url(#softShadow)">
    <rect x="736" y="94" width="380" height="430" rx="30" fill="#07111e" fill-opacity="0.44" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="766" y="142" fill="${theme.foreground}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="0.16em">SOCIAL COVER</text>
    <text x="766" y="182" fill="#f8fbff" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${escapeXml(args.deskLabel)}</text>
    <text x="766" y="216" fill="#d9e5f7" fill-opacity="0.78" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="500">${escapeXml(args.date)}</text>
    <rect x="766" y="244" width="320" height="1" fill="#ffffff" fill-opacity="0.12" />
    <text x="766" y="290" fill="${theme.foreground}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.04em">TOPICS</text>
    <text x="766" y="324" fill="#d9e5f7" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(topics[0]?.label ?? args.kicker)}</text>
    <text x="766" y="360" fill="#d9e5f7" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(topics[1]?.label ?? args.deskLabel)}</text>
    <circle cx="998" cy="342" r="92" fill="${theme.accent}" fill-opacity="0.12" />
    <circle cx="998" cy="342" r="62" fill="none" stroke="${theme.highlight}" stroke-opacity="0.34" stroke-width="10" />
    <circle cx="998" cy="342" r="28" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.14" />
    <circle cx="998" cy="342" r="10" fill="${theme.highlight}" />
    <g transform="translate(780 404)">
      ${buildSignalBars(hashString(args.slug))
        .map((height, index) => {
          const x = index * 36;
          const barHeight = Math.max(24, height);
          const y = 96 - barHeight;
          const fill = index % 2 === 0 ? theme.accent : theme.highlight;
          return `<rect x="${x}" y="${y}" width="20" height="${barHeight}" rx="10" fill="${fill}" fill-opacity="${index % 2 === 0 ? 0.72 : 0.58}" />`;
        })
        .join("")}
    </g>
    <text x="766" y="482" fill="#d9e5f7" fill-opacity="0.82" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="0.08em">DATA / CONTEXT / TIMING</text>
  </g>

  <text x="92" y="548" fill="#ffffff" fill-opacity="0.72" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="500">${escapeAttr(args.date)}</text>
  <text x="670" y="548" fill="#ffffff" fill-opacity="0.72" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="500">${escapeXml(`/news/${args.deskId}/${args.slug}`)}</text>
</svg>
`;
}

const publicDir = resolve(process.cwd(), "public");
mkdirSync(publicDir, { recursive: true });

const routes = new Set<string>(["/", "/research", "/news", "/news/archive"]);
const routeLastMods = new Map<string, string>();

routeLastMods.set("/", LASTMOD_ISO);
routeLastMods.set("/research", LASTMOD_ISO);
routeLastMods.set("/news", LASTMOD_ISO);
routeLastMods.set("/news/archive", LASTMOD_ISO);
routes.add("/news/hub");
routeLastMods.set("/news/hub", LASTMOD_ISO);

for (const desk of desks) {
  routes.add(`/news/${desk.id}`);
  const deskLastMod =
    desk.stories.reduce((latest, story) => {
      const storyIso = storyLastModIso(story);
      return storyIso > latest ? storyIso : latest;
    }, LASTMOD_ISO);
  routeLastMods.set(`/news/${desk.id}`, deskLastMod);

  for (const story of desk.stories) {
    const storyRoute = `/news/${desk.id}/${story.slug}`;
    routes.add(storyRoute);
    routeLastMods.set(storyRoute, storyLastModIso(story));
  }
}

const tagLastMods = new Map<string, string>();
for (const desk of desks) {
  for (const story of desk.stories) {
    const storyIso = storyLastModIso(story);
    for (const topic of getStoryTopics(story.slug)) {
      const current = tagLastMods.get(topic.slug);
      if (!current || storyIso > current) {
        tagLastMods.set(topic.slug, storyIso);
      }
    }
  }
}

for (const topic of getTopicsWithCounts()) {
  const route = `/news/tag/${topic.slug}`;
  routes.add(route);
  routeLastMods.set(route, tagLastMods.get(topic.slug) ?? LASTMOD_ISO);
}

for (const hub of getTopicHubs()) {
  const route = `/news/hub/${hub.slug}`;
  routes.add(route);

  const latestHubStory = getStoriesForHub(hub.slug).reduce((latest, story) => {
    const storyIso = storyLastModIso(story);
    return storyIso > latest ? storyIso : latest;
  }, LASTMOD_ISO);

  routeLastMods.set(route, latestHubStory);
}

const urls = Array.from(routes).sort((a, b) => a.localeCompare(b));

for (const desk of desks) {
  const ogDir = resolve(publicDir, "og", desk.id);
  mkdirSync(ogDir, { recursive: true });

  for (const story of desk.stories) {
    const svg = renderOgSvg({
      deskId: desk.id,
      deskLabel: desk.label,
      kicker: story.kicker,
      headline: story.headline,
      dek: story.dek,
      image: story.image,
      date: story.date,
      slug: story.slug,
    });

    const pngPath = resolve(ogDir, `${story.slug}.png`);
    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    writeFileSync(pngPath, resvg.render().asPng());
  }
}

const feedStories = desks
  .flatMap((desk) => desk.stories.map((story) => ({ desk, story })))
  .sort((a, b) => Date.parse(b.story.date) - Date.parse(a.story.date));

const feedItems = feedStories
  .slice(0, 24)
  .map(({ desk, story }) => {
    const link = absoluteUrl(`/news/${desk.id}/${story.slug}`);
    const pubDate = parseLastMod(story.date);
    const categories = getStoryTopics(story.slug)
      .map((topic) => `<category>${escapeXml(topic.label)}</category>`)
      .join("\n    ");

    return `  <item>
    <title>${escapeXml(story.headline)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
    <description>${escapeXml(story.dek)}</description>
    <author>yujiazhang.co.uk (Yujia Zhang)</author>
    ${categories}
    <content:encoded><![CDATA[${storyHtmlContent(story)}]]></content:encoded>
  </item>`;
  })
  .join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
  <title>Yujia Zhang - Signal Board</title>
  <link>${escapeXml(absoluteUrl("/news"))}</link>
  <description>AI infrastructure, power markets, and financial systems from the Signal Board desk.</description>
  <language>en-gb</language>
  <lastBuildDate>${new Date(LASTMOD_ISO).toUTCString()}</lastBuildDate>
  <generator>portfolio-next generate-seo.ts</generator>
  <image>
    <url>${escapeXml(absoluteUrl("/images/Photo_Yujia.jpg"))}</url>
    <title>Yujia Zhang - Signal Board</title>
    <link>${escapeXml(absoluteUrl("/news"))}</link>
  </image>
${feedItems}
</channel>
</rss>
`;

function getSitemapMeta(route: string): { changefreq: string; priority: string } {
  if (route === "/" || route === "/news") return { changefreq: "weekly", priority: "1.0" };
  if (route === "/research" || route === "/news/archive") return { changefreq: "monthly", priority: "0.8" };
  if (route === "/news/hub") return { changefreq: "weekly", priority: "0.9" };
  if (/^\/news\/hub\/[^/]+$/.test(route)) return { changefreq: "weekly", priority: "0.8" };
  if (/^\/news\/[^/]+\/[^/]+$/.test(route)) return { changefreq: "monthly", priority: "0.8" };
  if (/^\/news\/[^/]+$/.test(route)) return { changefreq: "weekly", priority: "0.7" };
  if (/^\/news\/tag\//.test(route)) return { changefreq: "weekly", priority: "0.5" };
  return { changefreq: "monthly", priority: "0.6" };
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((route) => {
    const { changefreq, priority } = getSitemapMeta(route);
    return `  <url>
    <loc>${escapeXml(absoluteUrl(route))}</loc>
    <lastmod>${escapeXml(routeLastMods.get(route) ?? LASTMOD_ISO)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

writeFileSync(resolve(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(publicDir, "feed.xml"), feed, "utf8");
writeFileSync(resolve(publicDir, "robots.txt"), robots, "utf8");

console.log(`SEO files generated for ${urls.length} URLs and feed.xml.`);
