import { Link, useParams } from "react-router-dom";

import Seo from "@/components/Seo";
import { desks } from "@/data/newsDesk";
import {
  getAllStories,
  getStoriesForTopic,
  getTopicDefinition,
  getTopicsWithCounts,
  getStoryTopics,
  type StoryIndexItem,
} from "@/data/newsTopics";
import { getTopicHubs } from "@/data/topicHubs";
import { absoluteUrl, pagePath } from "@/lib/site";
import { cn } from "@/lib/utils";

type ArchiveParams = {
  tag?: string;
};

function StoryArchiveCard({
  story,
  deskLabel,
}: {
  story: StoryIndexItem;
  deskLabel: string;
}) {
  const topics = getStoryTopics(story.slug);

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card">
      <Link
        to={pagePath(story.packet.backlinkPath)}
        className="grid gap-0 md:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)]"
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
            <span>{deskLabel}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{story.date}</span>
          </div>
          <h3 className="mt-3 max-w-[26ch] font-serif text-xl font-bold leading-tight md:text-2xl">
            {story.headline}
          </h3>
          <p className="mt-3 max-w-[54rem] text-sm leading-relaxed text-muted">
            {story.dek}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span
                key={topic.slug}
                className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-mono text-muted"
              >
                {topic.label}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function Archive() {
  const params = useParams<ArchiveParams>();
  const allStories = getAllStories();
  const topics = getTopicsWithCounts();
  const topicHubs = getTopicHubs();
  const topic = params.tag ? getTopicDefinition(params.tag) : null;
  const shouldIndex = !params.tag || Boolean(topic);
  const stories = topic ? getStoriesForTopic(topic.slug) : allStories;

  const pageTitle = topic
    ? `${topic.label} Articles | Signal Board`
    : "News Archive | Signal Board";
  const pageDescription = topic
    ? topic.description
    : "Browse the full Signal Board archive of AI, finance, energy, and market analysis. Use topic filters to move from overview to deeper reading.";
  const pageCanonical = topic ? `/news/tag/${topic.slug}` : "/news/archive";
  const seoImagePath = stories[0]?.image ?? "/images/background_picture.png";
  const seoImageAlt = stories[0]?.imageAlt ?? "Signal Board archive";

  const seoJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: absoluteUrl(pageCanonical),
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
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalPath={pageCanonical}
        imagePath={seoImagePath}
        imageAlt={seoImageAlt}
        type="website"
        robots={shouldIndex ? "index,follow" : "noindex,follow"}
        jsonLd={seoJsonLd}
      />

      <div className="mb-10 max-w-4xl">
        <p className="mb-3 text-sm uppercase tracking-wide text-muted">
          Archive
        </p>
        <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
          {topic ? topic.label : "News Archive"}
        </h1>
        {params.tag && !topic && (
          <p className="mt-3 inline-flex rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-muted">
            Topic not found, showing the archive instead.
          </p>
        )}
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-muted md:text-[1.08rem]">
          {pageDescription}
        </p>
        {topic && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              to="/news/archive/"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              View all stories
            </Link>
            <Link
              to={`/news/tag/${topic.slug}/`}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white"
            >
              Current topic
            </Link>
          </div>
        )}
      </div>

      <section className="mb-12 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Topics
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Topic pages create a stronger internal link graph and help readers
              move from broad themes into the relevant stories.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {topics.map((topicItem) => (
            <Link
              key={topicItem.slug}
              to={`/news/tag/${topicItem.slug}/`}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-mono transition-colors",
                topic?.slug === topicItem.slug
                  ? "border-foreground bg-foreground text-white"
                  : "border-border bg-accent text-muted hover:border-foreground hover:text-foreground"
              )}
            >
              {topicItem.label}
              <span className="ml-2 opacity-70">({topicItem.count})</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Topic hubs
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold">
              Three high-value reading paths
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              These hubs concentrate internal links around the themes most likely
              to earn repeat visits and long-tail discovery.
            </p>
          </div>
          <Link
            to="/news/hub/"
            className="rounded-full border border-border bg-accent px-4 py-2 text-sm font-medium hover:bg-white transition-colors"
          >
            View hub index
          </Link>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {topicHubs.map((hub) => (
            <Link
              key={hub.slug}
              to={`/news/hub/${hub.slug}/`}
              className="rounded-2xl border border-border bg-accent p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                {hub.label}
              </p>
              <h3 className="mt-3 font-serif text-xl font-bold leading-tight">
                {hub.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {hub.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white">
                  {hub.stories.length} stories
                </span>
                <span className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted">
                  {hub.topics.length} topics
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Story index
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold">
              {topic ? `Articles tagged ${topic.label}` : "All stories"}
            </h2>
          </div>
          <p className="text-sm text-muted">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>

        <div className="grid gap-5">
          {stories.map((story) => {
            const deskLabel =
              desks.find((desk) => desk.id === story.deskId)?.label ??
              story.deskLabel;

            return (
              <StoryArchiveCard
                key={story.slug}
                story={story}
                deskLabel={deskLabel}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
