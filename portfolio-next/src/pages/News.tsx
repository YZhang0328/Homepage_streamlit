import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  desks,
  type DeskId,
  type EventListing,
  type FeaturePanelData,
  type NewsDesk,
  type NewsStory,
  eventsSectionDescription,
  eventsSectionLabel,
  findActiveEventBySlug,
  getActiveAiFinanceEvents,
  slugifyEventTitle,
} from "@/data/newsDesk";
import { getStoryTopics, getTopicsWithCounts } from "@/data/newsTopics";
import { getTopicHubs } from "@/data/topicHubs";
import Seo from "@/components/Seo";
import { absoluteUrl, storyOgImagePath } from "@/lib/site";
import { cn } from "@/lib/utils";

type SectionId = "events" | DeskId;
type NewsRouteParams = {
  desk?: string;
  story?: string;
  event?: string;
};


const defaultSectionId: SectionId = "events";
const sectionIds: SectionId[] = ["events", "ai", "markets", "finance"];

function isSectionId(value: string | null): value is SectionId {
  return value !== null && sectionIds.includes(value as SectionId);
}

function buildNewsPath(sectionId: SectionId, storySlug?: string) {
  if (sectionId === "events") {
    return "/news";
  }

  return storySlug ? `/news/${sectionId}/${storySlug}` : `/news/${sectionId}`;
}

function buildEventPath(eventSlug?: string) {
  return eventSlug ? `/news/event/${eventSlug}` : "/news";
}

function toIsoDate(dateLabel: string) {
  const timestamp = Date.parse(dateLabel);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

function EventCard({
  event,
  onOpen,
}: {
  event: EventListing;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium">
              {event.type}
            </span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
              {event.price}
            </span>
          </div>
          <h3 className="font-semibold leading-snug group-hover:underline">
            {event.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {event.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> {event.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {event.venue}
            </span>
          </div>
        </div>
        <ExternalLink
          size={16}
          className="mt-1 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </button>
  );
}

function EventDetailView({
  event,
  onBack,
}: {
  event: EventListing;
  onBack: () => void;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 md:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to events
      </button>

      <div className="mt-6 max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium">
            {event.type}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {event.price}
          </span>
        </div>
        <h3 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
          {event.title}
        </h3>
        <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">
          {event.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} /> {event.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} /> {event.venue}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.assign(event.link)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Open official page
            <ExternalLink size={16} />
          </button>
          <span className="rounded-full border border-border bg-accent px-4 py-2 text-sm text-muted">
            Source: {event.source}
          </span>
        </div>
      </div>
    </article>
  );
}

function FeaturePanel({ feature }: { feature: FeaturePanelData }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="grid md:grid-cols-[1.28fr_0.72fr]">
        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {feature.label}
          </p>
          <h2 className="mt-3 max-w-[18ch] font-serif text-2xl font-bold leading-tight md:text-3xl">
            {feature.title}
          </h2>
          <p className="mt-4 max-w-[38rem] text-sm leading-relaxed text-muted md:text-[0.98rem]">
            {feature.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {feature.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-mono text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-border md:border-l md:border-t-0 md:p-5">
          <div className="h-full w-full overflow-hidden rounded-2xl">
            <div className="aspect-[4/5] md:h-full md:aspect-auto">
              <img
                src={feature.image}
                alt={feature.imageAlt}
                className={cn(
                  "h-full w-full object-cover",
                  feature.imageClassName ?? "object-center"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefCard({
  story,
  onOpen,
  featured = false,
  showCta = false,
  ctaLabel = "Read full article",
  showArrow = true,
  eyebrow,
  showDek = true,
}: {
  story: NewsStory;
  onOpen: () => void;
  featured?: boolean;
  showCta?: boolean;
  ctaLabel?: string;
  showArrow?: boolean;
  eyebrow?: string;
  showDek?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
      )}
    >
      <div
        className="overflow-hidden border-b border-border bg-neutral-100"
      >
        <div className={cn(featured ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[16/10]")}>
          <img
            src={story.image}
            alt={story.imageAlt}
            className={cn("h-full w-full object-cover", story.imageClassName ?? "object-center")}
          />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-5 md:p-6", featured ? "md:p-7 lg:p-8" : "")}>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
          <span>{story.kicker}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{story.date}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-serif font-bold leading-tight",
            featured
              ? "max-w-none text-[2rem] leading-[1.02] md:text-[2.35rem]"
              : showDek
                ? "max-w-[24ch] text-2xl"
                : "max-w-[20ch] text-xl leading-snug"
          )}
        >
          {story.headline}
        </h3>
        {showDek && (
          <p className="mt-3 max-w-[42rem] text-[1rem] leading-relaxed text-muted">
            {story.dek}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {getStoryTopics(story.slug).map((topic) => (
            <span
              key={topic.slug}
              className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-mono text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              {topic.label}
            </span>
          ))}
        </div>
        {showCta && (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            {ctaLabel}
            {showArrow && <ArrowRight size={16} />}
          </span>
        )}
      </div>
    </button>
  );
}

function MarketsGuidePanel({
  desk,
  onOpenStory,
}: {
  desk: NewsDesk;
  onOpenStory: (storySlug: string) => void;
}) {
  const [pillarStory, supportStory, ...relatedStories] = desk.stories;

  if (!pillarStory || !supportStory) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <BriefCard
          story={pillarStory}
          onOpen={() => onOpenStory(pillarStory.slug)}
          featured
          showCta
          ctaLabel="Read full article"
        />
        <BriefCard
          story={supportStory}
          onOpen={() => onOpenStory(supportStory.slug)}
          featured
          showCta
          ctaLabel="Read full article"
        />
      </div>

      {relatedStories.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-accent p-4">
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {relatedStories.map((story) => (
              <BriefCard
                key={story.slug}
                story={story}
                onOpen={() => onOpenStory(story.slug)}
                showCta
                ctaLabel="Read full article"
                showArrow={false}
                showDek={false}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FinanceGuidePanel({
  desk,
  onOpenStory,
}: {
  desk: NewsDesk;
  onOpenStory: (storySlug: string) => void;
}) {
  const [pillarStory, supportStory, ...relatedStories] = desk.stories;

  if (!pillarStory || !supportStory) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <BriefCard
          story={pillarStory}
          onOpen={() => onOpenStory(pillarStory.slug)}
          featured
          showCta
          ctaLabel="Read full article"
        />
        <BriefCard
          story={supportStory}
          onOpen={() => onOpenStory(supportStory.slug)}
          featured
          showCta
          ctaLabel="Read full article"
        />
      </div>

      {relatedStories.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-accent p-4">
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {relatedStories.map((story) => (
              <BriefCard
                key={story.slug}
                story={story}
                onOpen={() => onOpenStory(story.slug)}
                showCta
                ctaLabel="Read full article"
                showArrow={false}
                showDek={false}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function RelatedBriefsPanel({
  desk,
  currentSlug,
  onOpenStory,
}: {
  desk: NewsDesk;
  currentSlug: string;
  onOpenStory: (storySlug: string) => void;
}) {
  const relatedStories = desk.stories.filter((story) => story.slug !== currentSlug);

  if (!relatedStories.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Related briefs
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          These are the adjacent reads for this market arc. Each one adds a
          different layer: mechanism, allocation, infrastructure, or commodity
          backdrop.
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {relatedStories.slice(0, 2).map((story) => (
          <BriefCard
            key={story.slug}
            story={story}
            onOpen={() => onOpenStory(story.slug)}
            showCta
            ctaLabel="Read full article"
            showArrow={false}
            showDek={false}
          />
        ))}
      </div>
    </section>
  );
}

function FinanceRelatedBriefsPanel({
  desk,
  currentSlug,
  onOpenStory,
}: {
  desk: NewsDesk;
  currentSlug: string;
  onOpenStory: (storySlug: string) => void;
}) {
  const relatedStories = desk.stories.filter((story) => story.slug !== currentSlug);

  if (!relatedStories.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Related briefs
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          These are the adjacent reads for the finance arc. Each one adds a
          different layer: stack ownership, regulation, balance-sheet control,
          treasury, or agentic commerce.
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {relatedStories.slice(0, 4).map((story) => (
          <BriefCard
            key={story.slug}
            story={story}
            onOpen={() => onOpenStory(story.slug)}
            showCta
            ctaLabel="Read full article"
            showArrow={false}
            showDek={false}
          />
        ))}
      </div>
    </section>
  );
}

function ArticleView({
  story,
  onBack,
}: {
  story: NewsStory;
  onBack: () => void;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 md:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to briefs
      </button>

      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-neutral-100">
            <div className="aspect-[4/5]">
              <img
                src={story.image}
                alt={story.imageAlt}
                className={cn("h-full w-full object-cover", story.imageClassName ?? "object-center")}
              />
            </div>
          </div>
          {story.imageCredit && (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Image source: {story.imageCredit}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Full Article
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
            <span>{story.kicker}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{story.date}</span>
          </div>
          <h3 className="mt-3 max-w-[34ch] font-serif text-2xl font-bold leading-tight">
            {story.headline}
          </h3>
          <p className="mt-3 max-w-[56rem] text-[0.95rem] leading-[1.75] text-muted">
            {story.dek}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {getStoryTopics(story.slug).map((topic) => (
              <Link
                key={topic.slug}
                to={`/news/tag/${topic.slug}`}
                className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-mono text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {topic.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 space-y-[1.1rem]">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[56rem] text-[0.82rem] leading-[1.8] text-foreground/80 md:text-[0.88rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-accent p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Model View</p>
        <p className="mt-2 text-sm leading-relaxed">{story.modelView}</p>
      </div>
      <div className="mt-5 border-l-2 border-border pl-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Bottom Line</p>
        <p className="mt-0.5 text-xs text-muted italic">
          The one thing to remember — the strategic implication in its most compressed form.
        </p>
        <p className="mt-2 text-sm leading-relaxed">{story.bottomLine}</p>
      </div>
    </article>
  );
}


export default function News() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams<NewsRouteParams>();
  const articleAnchorRef = useRef<HTMLDivElement | null>(null);

  const routeSectionId = isSectionId(params.desk ?? null)
    ? (params.desk as SectionId)
    : isSectionId(searchParams.get("desk"))
      ? (searchParams.get("desk") as SectionId)
      : defaultSectionId;
  const routeStorySlug = params.story ?? searchParams.get("story") ?? undefined;
  const routeEventSlug = params.event ?? searchParams.get("event") ?? undefined;
  const activeEvents = getActiveAiFinanceEvents();

  const activeSectionId = routeSectionId;
  const activeDesk =
    activeSectionId === "events"
      ? null
      : desks.find((desk) => desk.id === activeSectionId) ?? desks[0];
  const selectedSlug = routeStorySlug;
  const selectedStory =
    activeDesk?.stories.find((story) => story.slug === selectedSlug) ?? null;
  const selectedEvent =
    routeSectionId === "events" && routeEventSlug
      ? findActiveEventBySlug(routeEventSlug) ?? null
      : null;

  useEffect(() => {
    const canonicalPath = selectedEvent
      ? buildEventPath(routeEventSlug)
      : buildNewsPath(activeSectionId, selectedSlug ?? undefined);
    const currentPath = `${location.pathname}${location.search}`;

    if (location.pathname.startsWith("/news") && currentPath !== canonicalPath) {
      navigate(canonicalPath, { replace: true });
    }
  }, [
    activeSectionId,
    location.pathname,
    location.search,
    navigate,
    searchParams,
    routeEventSlug,
    selectedSlug,
    selectedEvent,
  ]);

  useEffect(() => {
    if (selectedStory && articleAnchorRef.current) {
      articleAnchorRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [selectedStory]);

  const updateRoute = (sectionId: SectionId, storySlug?: string) => {
    const nextPath = buildNewsPath(sectionId, storySlug);
    navigate(nextPath);
  };

  const renderDesk = (desk: NewsDesk) => {
    if (selectedStory) {
      return (
        <div className="space-y-8">
          <ArticleView
            story={selectedStory}
            onBack={() => updateRoute(desk.id)}
          />

          {desk.id === "finance" ? (
            <FinanceRelatedBriefsPanel
              desk={desk}
              currentSlug={selectedStory.slug}
              onOpenStory={(storySlug) => updateRoute(desk.id, storySlug)}
            />
          ) : desk.id !== "markets" && (
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">More Briefs</p>
              <p className="mt-2 max-w-[42rem] text-sm leading-relaxed text-muted">
                The note above is the full article. The briefs below open their own
                full articles.
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {desk.stories
                  .filter((story) => story.slug !== selectedStory.slug)
                  .map((story) => (
                    <BriefCard
                      key={story.slug}
                      story={story}
                      onOpen={() => updateRoute(desk.id, story.slug)}
                      showCta
                      ctaLabel="Read full article"
                      showArrow={false}
                      showDek={false}
                    />
                ))}
              </div>
            </div>
          )}
          {desk.id === "markets" && (
            <RelatedBriefsPanel
              desk={desk}
              currentSlug={selectedStory.slug}
              onOpenStory={(storySlug) => updateRoute(desk.id, storySlug)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="max-w-[58rem] text-sm leading-relaxed text-muted md:text-[0.98rem]">
          {desk.intro}
        </p>
        {desk.id === "finance" ? (
          <FinanceGuidePanel
            desk={desk}
            onOpenStory={(storySlug) => updateRoute(desk.id, storySlug)}
          />
        ) : desk.id === "markets" ? (
          <MarketsGuidePanel
            desk={desk}
            onOpenStory={(storySlug) => updateRoute(desk.id, storySlug)}
          />
        ) : (
          <>
            <FeaturePanel feature={desk.feature} />
            <BriefCard
              story={desk.stories[0]}
              featured
              onOpen={() => updateRoute(desk.id, desk.stories[0].slug)}
              showCta
            />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                More Briefs
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {desk.stories.slice(1).map((story) => (
                <BriefCard
                  key={story.slug}
                  story={story}
                  onOpen={() => updateRoute(desk.id, story.slug)}
                  showCta
                  ctaLabel="Read full article"
                  showArrow={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderEvents = () => {
    if (selectedEvent) {
      return <EventDetailView event={selectedEvent} onBack={() => updateRoute("events")} />;
    }

    return (
      <div className="space-y-4">
        <p className="mb-6 max-w-[58rem] text-sm leading-relaxed text-muted md:text-[0.98rem]">
          {eventsSectionDescription}
        </p>
        {activeEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm leading-relaxed text-muted">
            No active events are listed right now. Check back soon for the next
            AI, finance, and energy-market gatherings.
          </div>
        ) : null}
        {activeEvents.map((event) => (
          <EventCard
            key={event.title}
            event={event}
            onOpen={() => navigate(buildEventPath(slugifyEventTitle(event.title)))}
          />
        ))}
      </div>
    );
  };

  const tabs: Array<{ id: SectionId; label: string }> = [
    { id: "events", label: eventsSectionLabel },
    { id: "ai", label: "AI News" },
    { id: "markets", label: "Markets & Power" },
    { id: "finance", label: "Financial Infrastructure" },
  ];

  const pageTitle = selectedStory
    ? `${selectedStory.headline} | Signal Board`
    : selectedEvent
      ? `${selectedEvent.title} | Signal Board`
    : activeSectionId === "events"
      ? `${eventsSectionLabel} | Signal Board`
      : `${activeDesk?.label ?? "Signal Board"} | Signal Board`;

  const pageDescription = selectedStory
    ? selectedStory.dek
    : selectedEvent
      ? selectedEvent.description
    : activeSectionId === "events"
      ? eventsSectionDescription
      : activeDesk?.intro ??
        "A live board for financial infrastructure, AI, market transmission, and energy-market events.";

  const canonicalPath = selectedEvent
    ? buildEventPath(routeEventSlug)
    : buildNewsPath(activeSectionId, selectedSlug ?? undefined);
  const seoImagePath = selectedStory
    ? storyOgImagePath(activeSectionId, selectedStory.slug)
    : activeDesk?.feature.image;
  const seoImageAlt = selectedStory
    ? `${selectedStory.headline} - Signal Board`
    : selectedEvent
      ? `${selectedEvent.title} - Signal Board`
    : activeDesk?.feature.imageAlt;
  const seoArticleMeta =
    selectedStory && activeDesk
      ? {
          publishedTime: toIsoDate(selectedStory.date) ?? undefined,
          author: "Yujia Zhang",
          section: activeDesk.label,
          tags: getStoryTopics(selectedStory.slug).map((t) => t.label),
        }
      : undefined;

  const seoJsonLd = selectedStory
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: selectedStory.headline,
          description: selectedStory.dek,
          image: seoImagePath ? [absoluteUrl(seoImagePath)] : undefined,
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(canonicalPath) },
          author: {
            "@type": "Person",
            name: "Yujia Zhang",
            url: absoluteUrl("/"),
            sameAs: ["https://www.linkedin.com/in/yujia-zhang-94417a295/"],
            },
            publisher: { "@type": "Person", name: "Yujia Zhang", url: absoluteUrl("/") },
            datePublished: toIsoDate(selectedStory.date),
            dateModified: toIsoDate(selectedStory.date),
            keywords: getStoryTopics(selectedStory.slug).map((t) => t.label).join(", "),
          wordCount: selectedStory.paragraphs.join(" ").split(/\s+/).length,
          articleSection: activeDesk?.label,
          speakable: {
            "@type": "SpeakableSpecification",
            xpath: ["/html/head/meta[@name='description']/@content"],
          },
        },
        ...(activeDesk
          ? [
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "Signal Board", item: absoluteUrl("/news") },
                  { "@type": "ListItem", position: 3, name: activeDesk.label, item: absoluteUrl(`/news/${activeDesk.id}`) },
                  { "@type": "ListItem", position: 4, name: selectedStory.headline, item: absoluteUrl(canonicalPath) },
                ],
              },
            ]
          : []),
      ]
      : selectedEvent
        ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: selectedEvent.title,
          description: selectedEvent.description,
          startDate: selectedEvent.date,
          location: {
            "@type": "Place",
            name: selectedEvent.venue,
          },
          url: absoluteUrl(canonicalPath),
        }
    : undefined;

  const topicHubs = getTopicHubs();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        imagePath={seoImagePath}
        imageAlt={seoImageAlt}
        type={selectedStory ? "article" : "website"}
        jsonLd={seoJsonLd}
        articleMeta={seoArticleMeta}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="mb-3 text-sm uppercase tracking-wide text-muted">Signal Board</p>
        <h1 className="max-w-[60rem] font-sans text-[1.35rem] font-semibold leading-[1.15] md:text-[1.85rem]">
          Finance, AI &amp; Market Briefings
        </h1>
        <p className="mt-4 max-w-[56rem] text-[1.02rem] leading-relaxed text-muted md:text-[1.1rem]">
          A live board for financial infrastructure, AI, market
          transmission, and energy-market events.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            to="/news/archive"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Browse archive
          </Link>
          {getTopicsWithCounts()
            .slice(0, 6)
            .map((topic) => (
              <Link
                key={topic.slug}
                to={`/news/tag/${topic.slug}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {topic.label}
              </Link>
            ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {topicHubs.map((hub) => (
            <Link
              key={hub.slug}
              to={`/news/hub/${hub.slug}`}
              className="rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                Topic hub
              </p>
              <h2 className="mt-3 font-serif text-xl font-bold leading-tight">
                {hub.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {hub.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
                  {hub.stories.length} stories
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["financial infrastructure", "agent infrastructure", "energy transmission", "energy-market events"].map(
            (pill) => (
              <span
                key={pill}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted"
              >
                {pill}
              </span>
            )
          )}
        </div>
      </motion.div>

      <div className="mb-10 flex w-fit items-center gap-1 rounded-full bg-accent p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => updateRoute(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-all",
              activeSectionId === tab.id
                ? "bg-foreground text-white shadow-sm"
                : "text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div ref={articleAnchorRef} className="scroll-mt-28">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`${activeSectionId}:${selectedStory?.slug ?? "briefs"}`}
            initial={{ opacity: 0.98, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.98, y: -6 }}
            transition={{ duration: 0.14 }}
          >
            {activeSectionId === "events" || !activeDesk
              ? renderEvents()
              : renderDesk(activeDesk)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
