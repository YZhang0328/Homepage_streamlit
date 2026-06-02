import { desks, type NewsStory } from "./newsDesk";

export interface TopicDefinition {
  slug: string;
  label: string;
  description: string;
}

export const topicDefinitions: Record<string, TopicDefinition> = {
  stablecoins: {
    slug: "stablecoins",
    label: "Stablecoins",
    description:
      "Articles on stablecoin infrastructure, payment rails, custody, liquidity, and the regulatory stack around digital money.",
  },
  payments: {
    slug: "payments",
    label: "Payments",
    description:
      "Analysis of payment networks, settlement, cross-border transfer, and the economics of payment infrastructure.",
  },
  regulation: {
    slug: "regulation",
    label: "Regulation",
    description:
      "Coverage of policy, compliance, supervision, and the regulatory frameworks shaping markets and technology.",
  },
  fintech: {
    slug: "fintech",
    label: "Fintech",
    description:
      "Stories about financial technology firms, banking strategy, platform economics, and balance-sheet control.",
  },
  treasury: {
    slug: "treasury",
    label: "Treasury",
    description:
      "Coverage of cash management, liquidity, settlement operations, and how finance teams move money internally and across borders.",
  },
  "agentic-commerce": {
    slug: "agentic-commerce",
    label: "Agentic Commerce",
    description:
      "Articles on AI-initiated payments, purchase authorization, liability, and the trust layers around agent-led transactions.",
  },
  mcp: {
    slug: "mcp",
    label: "MCP",
    description:
      "Model Context Protocol coverage, including enterprise adoption, standards, and the tooling layer for agents.",
  },
  "enterprise-ai": {
    slug: "enterprise-ai",
    label: "Enterprise AI",
    description:
      "Articles about enterprise adoption, vendor share, procurement, and the commercial layer of AI systems.",
  },
  agents: {
    slug: "agents",
    label: "Agents",
    description:
      "Coverage of agentic workflows, autonomous software agents, orchestration, and production deployment.",
  },
  "ai-governance": {
    slug: "ai-governance",
    label: "AI Governance",
    description:
      "Content on evals, review gates, auditability, permission boundaries, and the governance of AI systems.",
  },
  "software-engineering": {
    slug: "software-engineering",
    label: "Software Engineering",
    description:
      "Articles on code generation, maintenance workflows, testing, and the economics of engineering output.",
  },
  "power-markets": {
    slug: "power-markets",
    label: "Power Markets",
    description:
      "Analysis of electricity markets, capacity pricing, grid economics, and market structure in power systems.",
  },
  "capacity-pricing": {
    slug: "capacity-pricing",
    label: "Capacity Pricing",
    description:
      "Coverage of capacity auctions, reserve margins, and how reliability costs are allocated across electricity customers.",
  },
  "rate-design": {
    slug: "rate-design",
    label: "Rate Design",
    description:
      "Coverage of tariff design, cost allocation, bill impacts, and who pays for grid upgrades.",
  },
  "data-centres": {
    slug: "data-centres",
    label: "Data Centres",
    description:
      "Stories on data centre demand, power supply, siting decisions, and the infrastructure behind AI workloads.",
  },
  "load-growth": {
    slug: "load-growth",
    label: "Load Growth",
    description:
      "Articles on data-centre demand, electrification, and the load additions that reshape power markets and grid planning.",
  },
  "energy-islands": {
    slug: "energy-islands",
    label: "Energy Islands",
    description:
      "Coverage of dedicated off-grid power for data centres and the emergence of private generation stacks.",
  },
  electricity: {
    slug: "electricity",
    label: "Electricity",
    description:
      "Articles on electricity supply, capacity, transmission, and how load growth changes pricing and planning.",
  },
  oil: {
    slug: "oil",
    label: "Oil",
    description:
      "Markets commentary on oil, gas, supply shocks, persistence, and their implications for portfolios.",
  },
  macro: {
    slug: "macro",
    label: "Macro",
    description:
      "Broader cross-asset and macroeconomic framing for energy, inflation, and portfolio construction.",
  },
};

export const storyTopicSlugs: Record<string, string[]> = {
  "stablecoin-stack-race-2026": ["stablecoins", "payments", "fintech", "regulation"],
  "genius-act-stablecoins-payment-infrastructure": [
    "stablecoins",
    "payments",
    "regulation",
  ],
  "revolut-us-bank-charter": ["fintech", "regulation", "payments"],
  "stablecoin-treasury-management-2026": [
    "stablecoins",
    "payments",
    "treasury",
    "fintech",
  ],
  "agentic-commerce-liability-stack-2026": [
    "agentic-commerce",
    "payments",
    "regulation",
    "fintech",
  ],
  "coinbase-checkout-stablecoin-acceptance-2026": [
    "stablecoins",
    "payments",
    "fintech",
    "treasury",
  ],
  "mastercard-yellow-card-stablecoin-corridors-2026": [
    "stablecoins",
    "payments",
    "treasury",
    "fintech",
  ],
  "adyen-sap-unified-payment-stack-2026": [
    "payments",
    "fintech",
    "treasury",
    "regulation",
  ],
  "mcp-97-million-installs-standard": ["mcp", "agents", "enterprise-ai"],
  "anthropic-enterprise-dominance-2026": [
    "enterprise-ai",
    "ai-governance",
    "agents",
  ],
  "claude-code-autonomous-software-agent": [
    "agents",
    "software-engineering",
    "ai-governance",
  ],
  "microsoft-frontier-suite": ["agents", "enterprise-ai", "ai-governance"],
  "openai-promptfoo-evals-infrastructure": [
    "ai-governance",
    "agents",
    "software-engineering",
  ],
  "openai-codex-safety-controls-2026": [
    "agents",
    "software-engineering",
    "ai-governance",
  ],
  "gamedevbench-multimodal-agents-2026": [
    "agents",
    "software-engineering",
    "ai-governance",
  ],
  "pjm-capacity-prices-data-centers-2026": [
    "rate-design",
    "power-markets",
    "electricity",
  ],
  "why-pjm-capacity-prices-matter": [
    "capacity-pricing",
    "power-markets",
    "electricity",
  ],
  "ai-power-market-reset-2026": [
    "load-growth",
    "power-markets",
    "electricity",
  ],
  "energy-islands-shadow-grid-2026": [
    "energy-islands",
    "data-centres",
    "electricity",
  ],
  "pjm-shared-reliability-market-design-2026": [
    "rate-design",
    "power-markets",
    "electricity",
  ],
  "pjm-large-load-curtailment-strategy-2026": [
    "load-growth",
    "power-markets",
    "electricity",
  ],
  "ferc-summer-reliability-large-load-2026": [
    "rate-design",
    "load-growth",
    "power-markets",
    "electricity",
  ],
  "oil-supply-shock-math": ["oil", "macro", "power-markets"],
};

export function getAllStories(): Array<NewsStory & { deskId: string; deskLabel: string }> {
  return desks.flatMap((desk) =>
    desk.stories.map((story) => ({
      ...story,
      deskId: desk.id,
      deskLabel: desk.label,
    }))
  );
}

export type StoryIndexItem = ReturnType<typeof getAllStories>[number];

export function getStoryTopicSlugs(storySlug: string) {
  return storyTopicSlugs[storySlug] ?? [];
}

export function getStoryTopics(storySlug: string) {
  return getStoryTopicSlugs(storySlug)
    .map((slug) => topicDefinitions[slug])
    .filter((topic): topic is TopicDefinition => Boolean(topic));
}

export function getTopicDefinition(topicSlug: string) {
  return topicDefinitions[topicSlug] ?? null;
}

export function getTopicsWithCounts() {
  const counts = new Map<string, number>();

  for (const story of getAllStories()) {
    for (const topicSlug of getStoryTopicSlugs(story.slug)) {
      counts.set(topicSlug, (counts.get(topicSlug) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([slug, count]) => ({
      ...topicDefinitions[slug],
      count,
    }))
    .filter((topic): topic is TopicDefinition & { count: number } => Boolean(topic))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getStoriesForTopic(topicSlug: string) {
  return getAllStories().filter((story) =>
    getStoryTopicSlugs(story.slug).includes(topicSlug)
  );
}
