import { Link, useParams } from "react-router-dom";

import Seo from "@/components/Seo";
import { absoluteUrl, pagePath } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  getHubTopics,
  getStoriesForHub,
  getTopicHubDefinition,
  getTopicHubs,
} from "@/data/topicHubs";

type HubParams = {
  hub?: string;
};

function HubStoryCard({
  story,
}: {
  story: ReturnType<typeof getStoriesForHub>[number];
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card">
      <Link
        to={pagePath(story.packet.backlinkPath)}
        className="grid gap-0 md:grid-cols-[11rem_minmax(0,1fr)]"
      >
        <div className="overflow-hidden border-b border-border bg-neutral-100 md:border-b-0 md:border-r">
          <div className="aspect-[16/10] md:h-full md:aspect-auto">
            <img
              src={story.image}
              alt={story.imageAlt}
              className={cn(
                "h-full w-full object-cover",
                story.imageClassName ?? "object-center"
              )}
            />
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
            <span>{story.kicker}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{story.date}</span>
          </div>
          <h3 className="mt-3 max-w-[26ch] font-serif text-xl font-bold leading-tight md:text-2xl">
            {story.headline}
          </h3>
          <p className="mt-3 max-w-[54rem] text-sm leading-relaxed text-muted">
            {story.dek}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">
            Keyword
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {story.packet.targetKeyword}
          </p>
        </div>
      </Link>
    </article>
  );
}

function HubIndexCard({
  slug,
  label,
  title,
  description,
  storyCount,
  topicCount,
}: {
  slug: string;
  label: string;
  title: string;
  description: string;
  storyCount: number;
  topicCount: number;
}) {
  return (
    <Link
      to={`/news/hub/${slug}/`}
      className="rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
          {storyCount} stories
        </span>
        <span className="rounded-full border border-border bg-transparent px-3 py-1 text-xs text-muted">
          {topicCount} topics
        </span>
      </div>
    </Link>
  );
}

export default function TopicHub() {
  const params = useParams<HubParams>();
  const hubSlug = params.hub ?? null;
  const hub = hubSlug ? getTopicHubDefinition(hubSlug) : null;
  const isHubIndex = !hub;

  if (isHubIndex) {
    const hubs = getTopicHubs();
    const pageTitle = "Topic Hubs | Signal Board";
    const pageDescription =
      "Three reading hubs that turn Signal Board into a stronger internal link graph: stablecoins and payments, agents and governance, and power markets and data centres.";

    return (
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Seo
          title={pageTitle}
          description={pageDescription}
          canonicalPath="/news/hub"
          imagePath="/images/background_picture.png"
          imageAlt="Signal Board topic hubs"
          type="website"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDescription,
            url: absoluteUrl("/news/hub"),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: hubs.length,
              itemListElement: hubs.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(`/news/hub/${item.slug}`),
                name: item.title,
              })),
            },
          }}
        />

        <div className="max-w-4xl">
          <p className="mb-3 text-sm uppercase tracking-wide text-muted">Topic hubs</p>
          <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
            Three hubs for the highest-value clusters
          </h1>
          <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-muted md:text-[1.08rem]">
            These hubs are designed to concentrate internal links, increase topical
            depth, and give readers a clearer path from overview into the article
            cluster that matters most.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {hubs.map((item) => (
            <HubIndexCard
              key={item.slug}
              slug={item.slug}
              label={item.label}
              title={item.title}
              description={item.description}
              storyCount={item.stories.length}
              topicCount={item.topics.length}
            />
          ))}
        </section>
      </div>
    );
  }

  const hubStories = getStoriesForHub(hub.slug);
  const hubTopics = getHubTopics(hub.slug);
  const pageTitle = `${hub.title} | Signal Board`;
  const pageDescription = hub.summary;
  const canonicalPath = `/news/hub/${hub.slug}`;
  const imagePath = hubStories[0]?.image ?? "/images/background_picture.png";
  const imageAlt = hubStories[0]?.imageAlt ?? hub.title;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        imagePath={imagePath}
        imageAlt={imageAlt}
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: pageTitle,
          description: pageDescription,
          url: absoluteUrl(canonicalPath),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: hubStories.length,
            itemListElement: hubStories.map((story, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(story.packet.backlinkPath),
              name: story.headline,
            })),
          },
        }}
      />

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-muted">Topic hub</p>
          <h1 className="max-w-[14ch] font-serif text-4xl font-bold leading-[0.96] md:text-5xl">
            {hub.label}
          </h1>
          <p className="mt-5 max-w-3xl text-[1.02rem] leading-relaxed text-muted md:text-[1.08rem]">
            {hub.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white">
              {hubStories.length} stories
            </span>
            <span className="rounded-full border border-border bg-accent px-3 py-1 text-xs text-muted">
              {hubTopics.length} topic tags
            </span>
            <span className="rounded-full border border-border bg-accent px-3 py-1 text-xs text-muted">
              {hub.searchIntent}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {hubTopics.map((topic) => (
              <Link
                key={topic.slug}
                to={`/news/tag/${topic.slug}/`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Articles</p>
          <div className="mt-6 space-y-4">
            {hubStories.map((story, index) => (
              <Link
                key={story.slug}
                to={pagePath(story.packet.backlinkPath)}
                className="block rounded-2xl border border-border bg-accent p-4 transition-colors hover:border-foreground"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{story.kicker}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-bold leading-tight">
                  {story.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{story.dek}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                  Target keyword
                </p>
                <p className="mt-1 text-sm leading-relaxed">{story.packet.targetKeyword}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="mt-12 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Core articles
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">
              The stories in the hub
            </h2>
          </div>
          <Link
            to="/news/archive/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            Browse archive
          </Link>
        </div>

        <div className="grid gap-5">
          {hubStories.map((story) => (
            <HubStoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
}
