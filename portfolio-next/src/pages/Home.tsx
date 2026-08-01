import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp } from "lucide-react";
import BrandTicker from "@/components/BrandTicker";
import Seo from "@/components/Seo";
import { getTopicHubs } from "@/data/topicHubs";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stats = [
  { value: "PhD", label: "Engineering" },
  { value: "CFA", label: "Level I Passed" },
  { value: "5+", label: "Years Research" },
];

export default function Home() {
  const topicHubs = getTopicHubs();

  return (
    <>
      <Seo
        title="Yujia Zhang | Industrial Mathematician"
        description="Industrial mathematician and quantitative researcher building statistical and optimisation models for capital and energy markets."
        canonicalPath="/"
        imagePath="/images/Photo_Yujia.jpg"
        imageAlt="Yujia Zhang portrait"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Yujia Zhang",
            jobTitle: "Industrial Mathematician",
            url: "https://yujiazhang.co.uk/",
            image: "https://yujiazhang.co.uk/images/Photo_Yujia.jpg",
            sameAs: [
              "https://www.linkedin.com/in/yujia-zhang-94417a295/",
            ],
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
            url: "https://yujiazhang.co.uk/",
          },
        ]}
      />
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid gap-10 items-center md:grid-cols-[340px_minmax(0,1fr)] md:gap-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mx-auto w-full max-w-[26rem] md:mx-0"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src="/images/Photo_Yujia.jpg"
                alt="Yujia Zhang"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <div className="md:-translate-y-6 md:pl-6 lg:-translate-y-8 lg:pl-8">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-4 text-[0.98rem] text-muted tracking-[0.14em] uppercase md:text-[1.06rem]"
            >
              Quantitative Development &amp; Research
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-[9ch] font-serif text-[1.9rem] md:text-[2.2rem] lg:text-[2.6rem] font-bold leading-[0.93] tracking-tight"
            >
              Industrial
              <br />
              Mathematician
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5 max-w-lg text-[1.02rem] text-muted leading-relaxed md:text-[1.12rem]"
            >
              I build statistical and optimization models for capital and energy
              markets.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/research/"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                View Research <ArrowRight size={16} />
              </Link>
              <a
                href="https://www.linkedin.com/in/yujia-zhang-94417a295/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                LinkedIn
              </a>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Brand Ticker */}
      <BrandTicker />

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-muted uppercase tracking-wide mb-3">
            About Me
          </p>
          <h2 className="font-sans text-xl md:text-2xl font-semibold leading-snug">
            Rigor in analysis. Clarity in decision-making.
          </h2>
          <p className="mt-6 max-w-[56rem] text-[1.02rem] text-muted leading-relaxed md:text-[1.1rem]">
            I am passionate about applying quantitative methods and statistical
            modeling to capture the volatility of capital markets, with a strong
            intellectual curiosity to explore the mathematics behind data patterns.
            I have a PhD in engineering and subsequently worked as a postdoctoral
            research scientist at the University of Manchester.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-3xl md:text-4xl font-bold tracking-tight">
                {s.value}
              </p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-wide text-muted">
                Topic Hubs
              </p>
              <h2 className="font-sans text-xl md:text-2xl font-semibold leading-snug">
                Topic Clusters
              </h2>
            </div>
            <Link
              to="/news/hub/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-white w-fit"
            >
              Explore all hubs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-sm text-neutral-400 uppercase tracking-wide mb-3">
            Expertise
          </p>
          <h2 className="font-sans text-xl md:text-2xl font-semibold leading-snug max-w-xl mb-12">
            My expertise lies in optimization and prediction.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neutral-700 bg-neutral-900 p-8"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimization</h3>
              <p className="text-neutral-400 leading-relaxed">
                I specialize in transforming intricate financial and regulatory
                constraints into structured, solvable frameworks. Whether
                ensuring compliance with evolving market regulations or
                optimizing resource allocation, I build solutions that balance
                efficiency and robustness.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neutral-700 bg-neutral-900 p-8"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prediction</h3>
              <p className="text-neutral-400 leading-relaxed">
                I analyze trends and anomalies within data series using both
                linear and nonlinear models. I help businesses anticipate market
                movements, optimize strategies, and make informed financial
                decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I Do */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div>
            <p className="text-sm text-muted uppercase tracking-wide mb-3">
              Day-to-Day
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
              What I Do
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              After transitioning from academia, I worked as an energy modeller
              before moving into a front-office quantitative role focused on market
              analysis and optimisation.
            </p>
            <img
              src="/images/Aurora_refined.gif"
              alt="Aurora energy visualization"
              className="mt-8 rounded-2xl border border-border w-full"
            />
          </div>

          <div className="space-y-4 md:pt-[2.75rem]">
            {[
              "Developing software packages to analyze and process large-scale energy market datasets, including demand, supply, plant-level, time-resolution, and interconnection flow data.",
              "Developing an optimization model of electricity distribution across multiple sources (gas, coal, solar, wind, etc), generating short- and long-term price forecasts.",
              "Reliability check of new features through testing, including unit, integration, behavioural, and regression tests.",
              "Building power forward curves and running cross-commodity scenario analyses across European and GB markets.",
              'Continuously enhancing models and optimizing platform data structures: "There has to be a better way."',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="mt-1.5 text-xs font-mono text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Project */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card p-7 md:p-9"
        >
          <p className="text-sm uppercase tracking-wide text-muted">Founder Project</p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                AtlasNotes AI
              </h2>
              <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-muted md:text-[1.1rem]">
                I am the founder of AtlasNotes AI, a knowledge platform for
                professionals who want their research and best thinking to compound.
                It turns everyday work into an organised, reusable knowledge base,
                helping users develop stronger insights and create original work from
                what they already know.
              </p>
            </div>
            <div className="flex flex-col items-center gap-5 md:min-w-56">
              <img
                src="/images/atlasnotes-logo-square.png"
                alt="AtlasNotes AI logo"
                className="h-[6.75rem] w-[6.75rem] rounded-2xl object-cover shadow-lg"
              />
              <a
                href="https://atlasnote.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Explore AtlasNotes AI <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-card border border-border p-10 md:p-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Let's exchange ideas.
          </h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Whether it's a question, a collaboration, or just an interesting
            thought &mdash; I'd love to hear from you 😊.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a
              href="mailto:yujia.zhang.uom@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Send Email <ArrowRight size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/yujia-zhang-94417a295/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
