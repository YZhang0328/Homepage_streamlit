/**
 * publish.ts - Cross-platform article publisher
 *
 * Publishes stories from newsDesk.ts to DEV Community, Hashnode, and WordPress.com.
 * Medium: manual import only (API closed Jan 2025). Write.as/Ghost/Tumblr: removed.
 *
 * Usage:
 *   npm run publish -- --desk ai --story openai-promptfoo-evals-infrastructure
 *   npm run publish -- --desk markets --story pjm-capacity-auction --platforms dev,hashnode
 *   npm run publish -- --desk ai --story openai-promptfoo-evals-infrastructure --dry-run
 *   npm run publish -- --list          (show all available desk/story slugs)
 *   npm run publish -- --all           (publish every story, skipping duplicates)
 *
 * Required env vars (fill in portfolio-next/.env.publish):
 *   DEV_API_KEY           dev.to/settings/account -> DEV API Key
 *   HASHNODE_TOKEN        hashnode.com/settings/developer -> Personal Access Token
 *   HASHNODE_PUB_ID       Hashnode publication ID (from your blog dashboard URL)
 *   WORDPRESS_SITE        yourblog.wordpress.com (no https://)
 *   WORDPRESS_USER        Your WordPress.com username
 *   WORDPRESS_APP_PASS    Application password from WordPress.com profile
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHmac, randomBytes } from "node:crypto";
import { desks, type NewsStory, type NewsDesk } from "../src/data/newsDesk.js";

const __dir = dirname(fileURLToPath(import.meta.url));
const HOMEPAGE = "https://yujiazhang.co.uk";

// Env loader

function loadEnv() {
  const envPath = resolve(__dir, "../.env.publish");
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.publish not found; rely on shell env vars
  }
}

// CLI args

const ALL_PLATFORMS = ["dev"]; // Hashnode now requires a paid Pro plan (June 2025)

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--list")) return { mode: "list" } as const;
  if (args.includes("--hashnode-pubid")) return { mode: "hashnode-pubid" } as const;

  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const platforms = (get("--platforms") ?? get("--platform") ?? ALL_PLATFORMS.join(",")).split(",").map((s) => s.trim());
  const dryRun = args.includes("--dry-run");

  if (args.includes("--all")) {
    return { mode: "all", platforms, dryRun } as const;
  }

  const desk = get("--desk");
  const story = get("--story");

  if (!desk || !story) {
    console.error(
      "Usage:\n" +
      "  npm run publish -- --desk <id> --story <slug> [--platforms dev,hashnode,...] [--dry-run]\n" +
      "  npm run publish -- --all [--platforms dev,hashnode,...] [--dry-run]\n" +
      "  npm run publish -- --list"
    );
    process.exit(1);
  }
  return { mode: "one", desk, story, platforms, dryRun } as const;
}

// Formatters

function canonicalUrl(story: NewsStory, desk: NewsDesk) {
  return `${HOMEPAGE}/news/${desk.id}/${story.slug}`;
}

/** Bold the first sentence of each paragraph for scannability. */
function boldLeads(paragraphs: string[]): string[] {
  return paragraphs.map((p) => {
    const stop = p.search(/(?<=[^A-Z])\. /);
    if (stop > 0 && stop < 120) return `**${p.slice(0, stop + 1)}**${p.slice(stop + 1)}`;
    return p;
  });
}


const AUTHOR_BIO =
  "Yujia Zhang — Energy Modeller & Quant Researcher (PhD). I cover AI infrastructure, power markets, and financial systems.";
const AUTHOR_LINK_TEXT = "live market intelligence at yujiazhang.co.uk/news";
const AUTHOR_LINK_MD = `🔗 live market intelligence at [yujiazhang.co.uk/news](${HOMEPAGE}/news)`;

/**
 * DEV Community - technical audience, front matter for cover/tags,
 * expanded paragraphs, short author bio, no Model View / Bottom Line.
 */
function toMarkdownDev(story: NewsStory, desk: NewsDesk): string {
  const paras = boldLeads(story.paragraphs);
  const tags = deskTags(desk.id);
  const frontMatter = [
    "---",
    `title: ${story.headline}`,
    "published: true",
    `tags: ${tags.join(", ")}`,
    `canonical_url: ${canonicalUrl(story, desk)}`,
    `cover_image: ${story.image}`,
    "---",
    "",
  ].join("\n");

  const body = [
    `> ${story.dek}`,
    "",
    `*${story.kicker} - ${story.date}*`,
    "",
    "---",
    "",
    paras.join("\n\n"),
    "",
    "---",
    "",
    "### About the author",
    "",
    AUTHOR_BIO,
    "",
    AUTHOR_LINK_MD,
  ].join("\n");

  return frontMatter + body;
}

/**
 * Hashnode - developer/startup audience, clean markdown,
 * expanded paragraphs, short author bio, no Model View / Bottom Line.
 */
function toMarkdownHashnode(story: NewsStory, desk: NewsDesk): string {
  const paras = boldLeads(story.paragraphs);
  return [
    `# ${story.headline}`,
    "",
    `> ${story.dek}`,
    "",
    `![${story.imageAlt}](${story.image})`,
    `*${story.imageAlt} - ${story.date}*`,
    "",
    "---",
    "",
    paras.join("\n\n"),
    "",
    "---",
    "",
    "## About the author",
    "",
    AUTHOR_BIO,
    "",
    AUTHOR_LINK_MD,
  ].join("\n");
}

/**
 * WordPress.com - professional/general audience, clean HTML,
 * expanded paragraphs, short author bio, no Model View / Bottom Line.
 */
function toHtmlWordPress(story: NewsStory, desk: NewsDesk): string {
  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const paras = story.paragraphs
    .map((p) => {
      const stop = p.search(/(?<=[^A-Z])\. /);
      const formatted =
        stop > 0 && stop < 120
          ? `<strong>${p.slice(0, stop + 1)}</strong>${p.slice(stop + 1)}`
          : p;
      return `<p style="font-size:15px;line-height:1.8;margin-bottom:1.2em;">${inline(formatted)}</p>`;
    })
    .join("\n");

  return [
    `<figure><img src="${story.image}" alt="${story.imageAlt}" style="max-width:100%;border-radius:8px;margin-bottom:0.5em;"></figure>`,
    `<p style="font-size:13px;color:#888;text-align:center;margin-bottom:1.5em;">${inline(story.imageAlt)}</p>`,
    "",
    `<blockquote style="border-left:3px solid #ccc;padding:0.8em 1.2em;margin:1.5em 0;font-style:italic;color:#555;"><p>${inline(story.dek)}</p></blockquote>`,
    "",
    `<p style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;"><strong>${story.kicker}</strong> - ${story.date}</p>`,
    "",
    "<hr>",
    "",
    paras,
    "",
    "<hr>",
    "",
    "<h3>About the author</h3>",
    `<p style="margin:0 0 0.6em;font-size:15px;"><strong>${AUTHOR_BIO}</strong></p>`,
    `<p style="margin:0;font-size:14px;"><a href="${HOMEPAGE}/news" style="color:#1a73e8;font-weight:600;">${AUTHOR_LINK_TEXT}</a></p>`,
  ].join("\n");
}

function deskTags(deskId: string): string[] {
  const base = ["finance", "markets", "analytics"];
  if (deskId === "ai") return ["ai", "machinelearning", ...base].slice(0, 4);
  if (deskId === "markets") return ["energy", "markets", ...base].slice(0, 4);
  return ["fintech", "finance", ...base].slice(0, 4);
}

/** Converts the subset of markdown produced by toMarkdown() into HTML. */
function markdownToHtml(md: string): string {
  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const lines = md.split("\n");
  const out: string[] = [];
  let buf: string[] = [];

  const flush = () => {
    if (buf.length) {
      out.push(`<p>${inline(buf.join(" "))}</p>`);
      buf = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line) { flush(); continue; }

    if (line.startsWith("# ")) { flush(); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("## ")) { flush(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line === "---") { flush(); out.push("<hr>"); continue; }

    const img = line.match(/^!\[(.+?)\]\((.+?)\)$/);
    if (img) {
      flush();
      out.push(`<img src="${img[2]}" alt="${img[1]}" style="max-width:100%;border-radius:8px;margin:1em 0">`);
      continue;
    }

    buf.push(line);
  }
  flush();
  return out.join("\n");
}

// DEV Community

async function publishToDev(story: NewsStory, desk: NewsDesk, _markdown: string, dryRun: boolean) {
  const apiKey = process.env.DEV_API_KEY;
  if (!apiKey) { console.warn("  [DEV] DEV_API_KEY not set - skipping DEV Community"); return; }

  const tags = deskTags(desk.id);
  const payload = {
    article: {
      title: story.headline,
      body_markdown: toMarkdownDev(story, desk),
      published: true,
      tags,
      canonical_url: canonicalUrl(story, desk),
    },
  };

  if (dryRun) { console.log("  [DEV dry-run]", story.headline); return; }

  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify(payload),
  });
  if (res.status === 422) { console.log("  [DEV] already published (skipped)"); return; }
  if (res.status === 429) {
    console.log("  [DEV] rate limited - waiting 5 min then retrying...");
    await new Promise((r) => setTimeout(r, 310_000));
    return publishToDev(story, desk, _markdown, dryRun);
  }
  if (!res.ok) throw new Error(`DEV ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { url: string };
  console.log(`  [DEV] ${data.url}`);
}

// Write.as
// Medium removed: stopped issuing new API tokens as of Jan 1 2025.
// Write.as

async function publishToWriteAs(story: NewsStory, desk: NewsDesk, markdown: string, dryRun: boolean) {
  const token = process.env.WRITEAS_TOKEN;
  const collection = process.env.WRITEAS_COLLECTION;
  if (!token) { console.warn("  [Write.as] WRITEAS_TOKEN not set - skipping Write.as"); return; }

  // Write.as accepts plain text/markdown. We send the markdown directly.
  const payload: Record<string, string> = {
    body: markdown,
    title: story.headline,
    font: "norm",       // "norm" = serif, readable body font
    lang: "en",
  };
  // If a collection (blog) is configured, post to it so the article is listed publicly.
  const endpoint = collection
    ? `https://write.as/api/collections/${collection}/posts`
    : "https://write.as/api/posts";

  if (dryRun) { console.log("  [Write.as dry-run]", endpoint, story.headline); return; }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Write.as ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    data: { id: string; slug?: string; collection?: { alias: string; url: string } };
  };
  const d = json.data;
  const postUrl = d.collection
    ? `${d.collection.url}${d.slug ?? d.id}`
    : `https://write.as/${d.id}`;
  console.log(`  [Write.as] ${postUrl}`);
}

// Hashnode

/**
 * Returns the set of canonical URLs already published to this Hashnode publication.
 * Paginates through up to 500 posts (enough for any personal blog).
 */
async function hashnodePublishedUrls(token: string, pubId: string): Promise<Set<string>> {
  const urls = new Set<string>();
  let cursor: string | null = null;

  for (let page = 0; page < 10; page++) {
    const afterArg = cursor ? `, after: "${cursor}"` : "";
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        query: `query GetPosts($id: ObjectId!) {
          publication(id: $id) {
            posts(first: 50${afterArg}) {
              edges { node { canonicalUrl } cursor }
              pageInfo { hasNextPage endCursor }
            }
          }
        }`,
        variables: { id: pubId },
      }),
    });
    if (!res.ok) break;
    const json = (await res.json()) as {
      data?: {
        publication?: {
          posts?: {
            edges?: Array<{ node: { canonicalUrl?: string }; cursor: string }>;
            pageInfo?: { hasNextPage: boolean; endCursor?: string };
          };
        };
      };
    };
    const posts = json.data?.publication?.posts;
    for (const edge of posts?.edges ?? []) {
      if (edge.node.canonicalUrl) urls.add(edge.node.canonicalUrl);
    }
    if (!posts?.pageInfo?.hasNextPage) break;
    cursor = posts?.pageInfo?.endCursor ?? null;
    if (!cursor) break;
  }
  return urls;
}

async function publishToHashnode(story: NewsStory, desk: NewsDesk, _markdown: string, dryRun: boolean) {
  // Hashnode free API was discontinued in June 2025 — now requires a paid Pro plan.
  // See: https://hashnode.com/announcements/graphql-api
  console.warn("  [Hashnode] API requires Pro plan (paid) — skipped. Publish manually at hashnode.com.");
  return;

  const token = process.env.HASHNODE_TOKEN;
  const pubId = process.env.HASHNODE_PUB_ID;
  if (!token || !pubId) { console.warn("  [Hashnode] HASHNODE_TOKEN/HASHNODE_PUB_ID not set - skipping Hashnode"); return; }

  if (dryRun) { console.log("  [Hashnode dry-run]", story.headline); return; }

  // Pre-check: skip if already published (avoids relying on error message wording)
  const published = await hashnodePublishedUrls(token, pubId);
  if (published.has(canonicalUrl(story, desk))) {
    console.log("  [Hashnode] already published (skipped)");
    return;
  }

  const variables = {
    input: {
      title: story.headline,
      contentMarkdown: toMarkdownHashnode(story, desk),
      publicationId: pubId,
      tags: [],
      originalArticleURL: canonicalUrl(story, desk),
      coverImageOptions: { coverImageURL: story.image },
    },
  };

  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      query: `mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) { post { url } }
      }`,
      variables,
    }),
  });
  if (!res.ok) throw new Error(`Hashnode ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: { publishPost?: { post?: { url: string } } }; errors?: unknown[] };
  if (json.errors) throw new Error(`Hashnode GraphQL: ${JSON.stringify(json.errors)}`);
  console.log(`  [Hashnode] ${json.data?.publishPost?.post?.url}`);
}

// Ghost

/** Generates a signed JWT for the Ghost Admin API (no external library needed). */
function ghostJWT(adminKey: string): string {
  const [id, secret] = adminKey.split(":");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", kid: id, typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ exp: now + 300, iat: now, aud: "/admin/" })).toString("base64url");
  const sig = createHmac("sha256", Buffer.from(secret, "hex"))
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

async function publishToGhost(story: NewsStory, desk: NewsDesk, markdown: string, dryRun: boolean) {
  const ghostUrl = process.env.GHOST_URL?.replace(/\/$/, "");
  const adminKey = process.env.GHOST_ADMIN_KEY;
  if (!ghostUrl || !adminKey) { console.warn("  [Ghost] GHOST_URL/GHOST_ADMIN_KEY not set - skipping Ghost"); return; }

  const html = markdownToHtml(markdown);
  const payload = {
    posts: [{
      title: story.headline,
      html,
      status: "published",
      feature_image: story.image,
      canonical_url: canonicalUrl(story, desk),
      excerpt: story.dek,
      tags: [desk.label, "Finance", "AI", "Markets"].map((n) => ({ name: n })),
    }],
  };

  if (dryRun) { console.log("  [Ghost dry-run]", ghostUrl, story.headline); return; }

  const res = await fetch(`${ghostUrl}/ghost/api/admin/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Ghost ${ghostJWT(adminKey)}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Ghost ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { posts: Array<{ url: string }> };
  console.log(`  [Ghost] ${json.posts[0]?.url}`);
}

// Tumblr

/** Builds an OAuth 1.0a Authorization header (HMAC-SHA1, no library). */
function tumblrAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSec: string,
  oauthToken: string,
  oauthSec: string,
  extraParams: Record<string, string> = {}
): string {
  const enc = (s: string) => encodeURIComponent(s);
  const nonce = randomBytes(16).toString("hex");
  const ts = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: ts,
    oauth_token: oauthToken,
    oauth_version: "1.0",
  };

  const allParams = { ...oauthParams, ...extraParams };
  const paramStr = Object.keys(allParams)
    .sort()
    .map((k) => `${enc(k)}=${enc(allParams[k])}`)
    .join("&");

  const base = `${method}&${enc(url)}&${enc(paramStr)}`;
  const sigKey = `${enc(consumerSec)}&${enc(oauthSec)}`;
  const sig = createHmac("sha1", sigKey).update(base).digest("base64");

  oauthParams["oauth_signature"] = sig;
  return (
    "OAuth " +
    Object.keys(oauthParams)
      .map((k) => `${enc(k)}="${enc(oauthParams[k])}"`)
      .join(", ")
  );
}

async function publishToTumblr(story: NewsStory, desk: NewsDesk, markdown: string, dryRun: boolean) {
  const consumerKey = process.env.TUMBLR_CONSUMER_KEY;
  const consumerSec = process.env.TUMBLR_CONSUMER_SEC;
  const oauthToken = process.env.TUMBLR_OAUTH_TOKEN;
  const oauthSec = process.env.TUMBLR_OAUTH_SECRET;
  const blog = process.env.TUMBLR_BLOG;

  if (!consumerKey || !consumerSec || !oauthToken || !oauthSec || !blog) {
    console.warn("  [Tumblr] credentials not fully set - skipping Tumblr");
    return;
  }

  const html = markdownToHtml(markdown);
  const apiUrl = `https://api.tumblr.com/v2/blog/${blog}/posts`;
  const bodyParams = { type: "text", title: story.headline, body: html, native_inline_images: "true" };

  if (dryRun) { console.log("  [Tumblr dry-run]", blog, story.headline); return; }

  const authHeader = tumblrAuthHeader(
    "POST",
    apiUrl,
    consumerKey,
    consumerSec,
    oauthToken,
    oauthSec,
    bodyParams
  );

  const form = new URLSearchParams(bodyParams);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authHeader,
    },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(`Tumblr ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { response?: { id: string } };
  const postId = json.response?.id;
  const postUrl = `https://${blog}/post/${postId}`;
  console.log(`  [Tumblr] ${postUrl}`);
}

// WordPress.com

async function publishToWordPress(story: NewsStory, desk: NewsDesk, _markdown: string, dryRun: boolean) {
  const site = process.env.WORDPRESS_SITE;
  const user = process.env.WORDPRESS_USER;
  const appPass = process.env.WORDPRESS_APP_PASS;

  if (!site || !user || !appPass) {
    console.warn("  [WordPress] credentials not fully set - skipping WordPress.com");
    return;
  }

  const html = toHtmlWordPress(story, desk);
  // WordPress.com hosted sites require the public-api.wordpress.com proxy endpoint
  const endpoint = `https://public-api.wordpress.com/wp/v2/sites/${site}/posts`;
  const credentials = Buffer.from(`${user}:${appPass}`).toString("base64");

  const payload = {
    title: story.headline,
    content: html,
    status: "publish",
    excerpt: story.dek,
    meta: { _genesis_description: story.dek },
  };

  if (dryRun) { console.log("  [WordPress dry-run]", endpoint, story.headline); return; }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`WordPress ${res.status}: ${body.slice(0, 300)}`);
  let json: { link: string };
  try { json = JSON.parse(body) as { link: string }; }
  catch { throw new Error(`WordPress returned non-JSON (${res.status}): ${body.slice(0, 200)}`); }
  console.log(`  [WordPress] ${json.link}`);
}

// Hashnode

async function lookupHashnodePubId() {
  const token = process.env.HASHNODE_TOKEN;
  if (!token) {
    console.error("HASHNODE_TOKEN not set in .env.publish");
    process.exit(1);
  }
  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      query: `{ me { publications(first: 10) { edges { node { id title url } } } } }`,
    }),
  });
  if (!res.ok) throw new Error(`Hashnode ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    data?: { me?: { publications?: { edges?: Array<{ node: { id: string; title: string; url: string } }> } } };
  };
  const pubs = json.data?.me?.publications?.edges ?? [];
  if (!pubs.length) { console.log("No publications found on this Hashnode account."); return; }
  console.log("\nYour Hashnode publication IDs:\n");
  for (const { node } of pubs) {
    console.log(`  Title : ${node.title}`);
    console.log(`  URL   : ${node.url}`);
    console.log(`  ID    : ${node.id}   -> paste this as HASHNODE_PUB_ID`);
    console.log();
  }
}

// List command

function listSlugs() {
  console.log("\nAvailable stories:\n");
  for (const desk of desks) {
    console.log(`  Desk: ${desk.id} (${desk.label})`);
    for (const story of desk.stories) {
      console.log(`    --desk ${desk.id} --story ${story.slug}`);
      console.log(`      "${story.headline}"`);
    }
    console.log();
  }
}

// Main

async function publishOne(story: NewsStory, desk: NewsDesk, platforms: string[], dryRun: boolean) {
  console.log(`\n${"-".repeat(60)}`);
  console.log(`  "${story.headline}"`);
  console.log(`  ${desk.label}`);
  console.log(`${"-".repeat(60)}`);

  const tasks: Promise<void>[] = [];
  if (platforms.includes("dev"))       tasks.push(publishToDev(story, desk, "", dryRun));
  if (platforms.includes("hashnode"))  tasks.push(publishToHashnode(story, desk, "", dryRun));
  if (platforms.includes("writeas"))   tasks.push(publishToWriteAs(story, desk, "", dryRun));
  if (platforms.includes("ghost"))     tasks.push(publishToGhost(story, desk, "", dryRun));
  if (platforms.includes("tumblr"))    tasks.push(publishToTumblr(story, desk, "", dryRun));
  if (platforms.includes("wordpress")) tasks.push(publishToWordPress(story, desk, "", dryRun));

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error(`  [error] ${String(r.reason)}`);
  }
}

async function main() {
  loadEnv();
  const args = parseArgs();

  if (args.mode === "list") { listSlugs(); return; }
  if (args.mode === "hashnode-pubid") { await lookupHashnodePubId(); return; }

  if (args.mode === "all") {
    const { platforms, dryRun } = args;
    console.log(`\nPublishing ALL ${desks.reduce((n, d) => n + d.stories.length, 0)} stories -> ${platforms.join(", ")}${dryRun ? "  [DRY RUN]" : ""}`);
    for (const desk of desks) {
      for (const story of desk.stories) {
        await publishOne(story, desk, platforms, dryRun);
        if (!dryRun) await new Promise((r) => setTimeout(r, 6000));
      }
    }
    console.log(`\n${"-".repeat(60)}`);
    console.log("  All done. Import each DEV article into Medium manually.");
    console.log(`${"-".repeat(60)}\n`);
    return;
  }

  // mode === "one"
  const { desk: deskId, story: slug, platforms, dryRun } = args;
  const desk = desks.find((d) => d.id === deskId);
  if (!desk) { console.error(`Desk "${deskId}" not found. Run --list to see options.`); process.exit(1); }
  const story = desk.stories.find((s) => s.slug === slug);
  if (!story) { console.error(`Story "${slug}" not found. Run --list to see options.`); process.exit(1); }

  await publishOne(story, desk, platforms, dryRun);
  console.log(`\n  Done. Click any link above to verify the backlinks.\n`);
}

main();




