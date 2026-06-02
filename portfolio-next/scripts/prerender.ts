import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import AppFrame from "../src/AppFrame.tsx";
import {
  desks,
  eventsSectionDescription,
  eventsSectionLabel,
  findActiveEventBySlug,
  getActiveAiFinanceEvents,
  slugifyEventTitle,
} from "../src/data/newsDesk.ts";
import {
  getAllStories,
  getStoriesForTopic,
  getStoryTopics,
  getTopicDefinition,
} from "../src/data/newsTopics.ts";
import {
  getStoriesForHub,
  getTopicHubDefinition,
  getTopicHubs,
} from "../src/data/topicHubs.ts";
import { SITE_URL, absoluteUrl, storyOgImagePath } from "../src/lib/site.ts";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

type ArticleMeta = {
  publishedTime?: string;
  author: string;
  section?: string;
  tags?: string[];
};

type SeoSpec = {
  title: string;
  description: string;
  canonicalPath: string;
  imagePath?: string;
  imageAlt?: string;
  robots?: string;
  type?: "website" | "article";
  jsonLd?: JsonLd;
  articleMeta?: ArticleMeta;
};

const __dir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dir, "..");
const distDir = resolve(rootDir, "dist");
const sitemapPath = resolve(distDir, "sitemap.xml");
const templatePath = resolve(distDir, "index.html");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseDateIso(dateLabel: string) {
  const timestamp = Date.parse(dateLabel);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

function normalizePath(href: string) {
  if (href.startsWith(SITE_URL)) {
    const path = href.slice(SITE_URL.length);
    return path.startsWith("/") ? path : `/${path}`;
  }
  return href.startsWith("/") ? href : `/${href}`;
}

function readSitemapRoutes() {
  const raw = readFileSync(sitemapPath, "utf8");
  const locMatches = [...raw.matchAll(/<loc>(.*?)<\/loc>/g)];
  return locMatches.map((match) => normalizePath(match[1]));
}

function findDesk(deskId: string) {
  return desks.find((desk) => desk.id === deskId);
}

function findEvent(eventSlug: string) {
  return findActiveEventBySlug(eventSlug);
}

function getSeoForPath(pathname: string): SeoSpec {
  if (pathname === "/") {
    return {
      title: "Yujia Zhang | Industrial Mathematician",
      description:
        "Industrial mathematician and quantitative researcher building statistical and optimisation models for capital and energy markets.",
      canonicalPath: "/",
      imagePath: "/images/Photo_Yujia.jpg",
      imageAlt: "Yujia Zhang portrait",
      type: "website",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Yujia Zhang",
          jobTitle: "Industrial Mathematician",
          url: absoluteUrl("/"),
          image: absoluteUrl("/images/Photo_Yujia.jpg"),
          sameAs: ["https://www.linkedin.com/in/yujia-zhang-94417a295/"],
          knowsAbout: [
            "Energy modelling",
            "Quantitative research",
            "Optimization",
            "Capital markets",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Yujia Zhang",
          url: absoluteUrl("/"),
        },
      ],
    };
  }

  if (pathname === "/research") {
    return {
      title: "Research & Publications | Yujia Zhang",
      description:
        "Selected publications and research notes spanning model predictive control, machine learning, and remote sensing object detection.",
      canonicalPath: "/research",
      imagePath: "/images/background_picture.png",
      imageAlt: "Research background",
      type: "website",
    };
  }

  if (pathname === "/news") {
    return {
      title: `${eventsSectionLabel} | Signal Board`,
      description: eventsSectionDescription,
      canonicalPath: "/news",
      type: "website",
    };
  }

  if (pathname === "/news/archive") {
    const stories = getAllStories();
    const topicStories = stories;
    return {
      title: "News Archive | Signal Board",
      description:
        "Browse the full Signal Board archive of AI, finance, energy, and market analysis. Use topic filters to move from overview to deeper reading.",
      canonicalPath: "/news/archive",
      imagePath: topicStories[0]?.image ?? "/images/background_picture.png",
      imageAlt: topicStories[0]?.imageAlt ?? "Signal Board archive",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "News Archive | Signal Board",
        description:
          "Browse the full Signal Board archive of AI, finance, energy, and market analysis. Use topic filters to move from overview to deeper reading.",
        url: absoluteUrl("/news/archive"),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: topicStories.length,
          itemListElement: topicStories.map((story, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(story.packet.backlinkPath),
            name: story.headline,
          })),
        },
      },
    };
  }

  if (pathname === "/news/hub") {
    const hubs = getTopicHubs();
    return {
      title: "Topic Hubs | Signal Board",
      description:
        "Three reading hubs that turn Signal Board into a stronger internal link graph: stablecoins and payments, agents and governance, and power markets and data centres.",
      canonicalPath: "/news/hub",
      imagePath: "/images/background_picture.png",
      imageAlt: "Signal Board topic hubs",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Topic Hubs | Signal Board",
        description:
          "Three reading hubs that turn Signal Board into a stronger internal link graph: stablecoins and payments, agents and governance, and power markets and data centres.",
        url: absoluteUrl("/news/hub"),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: hubs.length,
          itemListElement: hubs.map((hub, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/news/hub/${hub.slug}`),
            name: hub.title,
          })),
        },
      },
    };
  }

  const hubMatch = pathname.match(/^\/news\/hub\/([^/]+)$/);
  if (hubMatch) {
    const hub = getTopicHubDefinition(hubMatch[1]);
    const stories = hub ? getStoriesForHub(hub.slug) : getAllStories();
    return {
      title: hub ? `${hub.title} | Signal Board` : "Topic Hubs | Signal Board",
      description: hub
        ? hub.summary
        : "Three reading hubs that turn Signal Board into a stronger internal link graph: stablecoins and payments, agents and governance, and power markets and data centres.",
      canonicalPath: hub ? `/news/hub/${hub.slug}` : "/news/hub",
      imagePath: stories[0]?.image ?? "/images/background_picture.png",
      imageAlt: stories[0]?.imageAlt ?? "Signal Board topic hub",
      type: "website",
      robots: hub ? "index,follow" : "noindex,follow",
      jsonLd: hub
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${hub.title} | Signal Board`,
            description: hub.summary,
            url: absoluteUrl(`/news/hub/${hub.slug}`),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: stories.length,
              itemListElement: stories.map((story, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(story.packet.backlinkPath),
                name: story.headline,
              })),
            },
          }
        : undefined,
    };
  }

  const tagMatch = pathname.match(/^\/news\/tag\/([^/]+)$/);
  if (tagMatch) {
    const topic = getTopicDefinition(tagMatch[1]);
    const stories = topic ? getStoriesForTopic(topic.slug) : getAllStories();
    return {
      title: topic ? `${topic.label} Articles | Signal Board` : "News Archive | Signal Board",
      description: topic
        ? topic.description
        : "Browse the full Signal Board archive of AI, finance, energy, and market analysis. Use topic filters to move from overview to deeper reading.",
      canonicalPath: topic ? `/news/tag/${topic.slug}` : "/news/archive",
      imagePath: stories[0]?.image ?? "/images/background_picture.png",
      imageAlt: stories[0]?.imageAlt ?? "Signal Board archive",
      robots: topic ? "index,follow" : "noindex,follow",
      type: "website",
      jsonLd: topic
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${topic.label} Articles | Signal Board`,
            description: topic.description,
            url: absoluteUrl(`/news/tag/${topic.slug}`),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: stories.length,
              itemListElement: stories.map((story, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(story.packet.backlinkPath),
                name: story.headline,
              })),
            },
          }
        : undefined,
    };
  }

  const eventMatch = pathname.match(/^\/news\/event\/([^/]+)$/);
  if (eventMatch) {
    const event = findEvent(eventMatch[1]);
    return {
      title: event ? `${event.title} | Signal Board` : `${eventsSectionLabel} | Signal Board`,
      description: event
        ? event.description
        : eventsSectionDescription,
      canonicalPath: event ? `/news/event/${eventMatch[1]}` : "/news",
      type: "website",
      jsonLd: event
        ? {
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.description,
            startDate: event.date,
            location: {
              "@type": "Place",
              name: event.venue,
            },
            url: absoluteUrl(`/news/event/${eventMatch[1]}`),
          }
        : undefined,
    };
  }

  const articleMatch = pathname.match(/^\/news\/([^/]+)\/([^/]+)$/);
  if (articleMatch) {
    const desk = findDesk(articleMatch[1]);
    const story = desk?.stories.find((item) => item.slug === articleMatch[2]);

    if (desk && story) {
      const storyImagePath = storyOgImagePath(desk.id, story.slug);
      const published = parseDateIso(story.date);
      const topics = getStoryTopics(story.slug);
      const wordCount = story.paragraphs.join(" ").split(/\s+/).length;

      return {
        title: `${story.headline} | Signal Board`,
        description: story.dek,
        canonicalPath: pathname,
        imagePath: storyImagePath,
        imageAlt: `${story.headline} - Signal Board`,
        type: "article",
        articleMeta: {
          publishedTime: published,
          author: "Yujia Zhang",
          section: desk.label,
          tags: topics.map((t) => t.label),
        },
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: story.headline,
            description: story.dek,
            image: [absoluteUrl(storyImagePath)],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": absoluteUrl(pathname),
            },
            author: {
              "@type": "Person",
              name: "Yujia Zhang",
              url: absoluteUrl("/"),
              sameAs: ["https://www.linkedin.com/in/yujia-zhang-94417a295/"],
            },
            publisher: {
              "@type": "Person",
              name: "Yujia Zhang",
              url: absoluteUrl("/"),
            },
            ...(published ? { datePublished: published, dateModified: published } : {}),
            keywords: topics.map((t) => t.label).join(", "),
            wordCount,
            articleSection: desk.label,
            speakable: {
              "@type": "SpeakableSpecification",
              xpath: ["/html/head/meta[@name='description']/@content"],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Signal Board", item: absoluteUrl("/news") },
              { "@type": "ListItem", position: 3, name: desk.label, item: absoluteUrl(`/news/${desk.id}`) },
              { "@type": "ListItem", position: 4, name: story.headline, item: absoluteUrl(pathname) },
            ],
          },
        ],
      };
    }
  }

  const deskMatch = pathname.match(/^\/news\/([^/]+)$/);
  if (deskMatch) {
    const desk = findDesk(deskMatch[1]);
    if (desk) {
      return {
        title: `${desk.label} | Signal Board`,
        description: desk.intro,
        canonicalPath: pathname,
        imagePath: desk.feature.image,
        imageAlt: desk.feature.imageAlt,
        type: "website",
      };
    }
  }

  return {
    title: "Yujia Zhang | Signal Board",
    description:
      "A live board for financial infrastructure, consequential AI, market transmission, and the energy-market events worth showing up for.",
    canonicalPath: pathname,
    type: "website",
  };
}

function renderSeoHead(seo: SeoSpec) {
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots ?? "index,follow")}" />`,
    `<meta property="og:site_name" content="Yujia Zhang" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(seo.type ?? "website")}" />`,
    `<meta property="og:url" content="${escapeHtml(absoluteUrl(seo.canonicalPath))}" />`,
    `<meta name="twitter:card" content="${seo.imagePath ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    seo.imagePath
      ? `<meta property="og:image" content="${escapeHtml(absoluteUrl(seo.imagePath))}" />`
      : "",
    seo.imageAlt ? `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />` : "",
    `<link rel="canonical" href="${escapeHtml(absoluteUrl(seo.canonicalPath))}" />`,
    `<link rel="alternate" type="application/rss+xml" title="Yujia Zhang Feed" href="${escapeHtml(absoluteUrl("/feed.xml"))}" />`,
    // Article Open Graph tags (Google Discover, social sharing)
    ...(seo.type === "article" && seo.articleMeta
        ? [
            seo.articleMeta.publishedTime
              ? `<meta property="article:published_time" content="${escapeHtml(seo.articleMeta.publishedTime)}" />`
              : "",
            `<meta property="article:author" content="${escapeHtml(seo.articleMeta.author)}" />`,
          seo.articleMeta.section
            ? `<meta property="article:section" content="${escapeHtml(seo.articleMeta.section)}" />`
            : "",
          ...(seo.articleMeta.tags ?? []).map(
            (tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`
          ),
        ]
      : []),
  ].filter(Boolean);

  return tags.join("\n    ");
}

function replaceSeoBlock(template: string, seo: SeoSpec) {
  const headBlock = renderSeoHead(seo);
  return template.replace(
    /<!-- SEO_STATIC_START -->[\s\S]*?<!-- SEO_STATIC_END -->/,
    `<!-- SEO_STATIC_START -->\n    ${headBlock}\n    <!-- SEO_STATIC_END -->`
  );
}

function outputPathForRoute(routePath: string) {
  if (routePath === "/") {
    return resolve(distDir, "index.html");
  }

  const normalized = routePath.replace(/^\/+/, "");
  return resolve(distDir, normalized, "index.html");
}

function main() {
  const template = readFileSync(templatePath, "utf8");
  const routes = new Set(readSitemapRoutes());

  for (const event of getActiveAiFinanceEvents()) {
    const slug = slugifyEventTitle(event.title);
    routes.add(`/news/event/${slug}`);
  }

  for (const routePath of routes) {
    const seo = getSeoForPath(routePath);
    const renderedMarkup = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [routePath] },
        createElement(AppFrame)
      )
    );
    const html = replaceSeoBlock(
      template.replace(/<div id="root"><\/div>/, `<div id="root">${renderedMarkup}</div>`),
      seo
    ).replace(
      /<!-- SEO_JSONLD_START -->[\s\S]*?<!-- SEO_JSONLD_END -->/,
      seo.jsonLd
        ? `<!-- SEO_JSONLD_START -->\n    <script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>\n    <!-- SEO_JSONLD_END -->`
        : `<!-- SEO_JSONLD_START --><!-- SEO_JSONLD_END -->`
    );

    const outPath = outputPathForRoute(routePath);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, "utf8");
  }

  console.log(`Prerendered ${routes.size} routes into dist/`);
}

main();
