import { motion } from "framer-motion";
import Seo from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  image: string;
  methodology: string;
  description: string;
}

const publications: Publication[] = [
  {
    title:
      "Robust tube-based model predictive control for wave energy converters",
    authors: "Yujia Zhang et al.",
    journal: "IEEE Transactions on Sustainable Energy",
    year: "2022",
    image: "/images/paper_1.png",
    description:
      "Developed a robust tube-based Model Predictive Control (RTMPC) strategy for energy maximization in Wave Energy Converters (WECs), addressing constraints and model uncertainties.",
    methodology:
      "Integrated disturbance invariant sets into the MPC framework to explicitly handle uncertainties and ensure robustness without increasing computational complexity.",
  },
  {
    title:
      "Robust nonlinear model predictive control of an autonomous launch and recovery system",
    authors: "Yujia Zhang et al.",
    journal: "IEEE Transactions on Control Systems Technology",
    year: "2023",
    image: "/images/paper_2.png",
    description:
      "Developed an autonomous optimization-based control system for lifeboat launch and recovery in high sea states.",
    methodology:
      "Adopted Tube-based Model Predictive Control (TMPC) to assess risk and optimize control. Model uncertainties and constraints are incorporated to ensure robust performance despite inaccurate environmental disturbance predictions.",
  },
  {
    title:
      "Robust Learning-based Model Predictive Control for Wave Energy Converters",
    authors: "Yujia Zhang et al.",
    journal: "IEEE Transactions on Sustainable Energy",
    year: "2024",
    image: "/images/paper_3.png",
    description:
      "Developed a machine learning based MPC strategy for WECs to balance the objectives of maximizing energy extraction and ensuring safety.",
    methodology:
      "Used machine learning to dynamically adjust uncertainty sets in MPC. Adopted a quantile-regression-based LSTM network to predict and optimize uncertainty bounds in real-time.",
  },
];

export default function Research() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Seo
        title="Research & Publications | Yujia Zhang"
        description="Selected publications and research notes spanning model predictive control, machine learning, and remote sensing object detection."
        canonicalPath="/research"
        imagePath="/images/background_picture.png"
        imageAlt="Research background"
      />
      {/* Intro */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-20 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16"
      >
        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-muted">
            Academic Work
          </p>
          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight md:text-4xl">
            Research &amp; Publications
          </h1>

          <div className="mt-6 space-y-6">
            <div className="space-y-4 text-sm text-muted">
              <blockquote className="border-l-2 border-border pl-4 italic leading-relaxed">
                "Mathematics is not about numbers, equations, computations, or
                algorithms: it is about understanding."
                <span className="ml-2 inline not-italic text-xs">
                  &mdash; William Paul Thurston
                </span>
              </blockquote>
              <blockquote className="border-l-2 border-border pl-4 italic leading-relaxed">
                "The goal is to turn data into information, and information into
                insight."
                <span className="ml-2 inline not-italic text-xs">
                  &mdash; Carly Fiorina
                </span>
              </blockquote>
            </div>

            <div className="space-y-5 text-[15px] text-muted leading-relaxed md:text-base">
              <p>
                In most of my research, I <strong className="text-foreground">worked extensively with mathematics</strong>,
                focusing on <strong className="text-foreground">model predictive control</strong>, an approach
                that brings optimization and prediction together for
                decision-making in dynamic systems.
              </p>
              <p>
                Beyond control theory, I also developed substantial experience in{" "}
                <strong className="text-foreground">machine learning</strong>, using data-driven methods to
                improve system modeling, prediction, and classification.
              </p>
              <p>
                I have around one year of postdoctoral research experience,
                supported by <strong className="text-foreground">UK Research and Innovation (UKRI)</strong> and
                the <strong className="text-foreground">Royal Society of Engineering</strong>.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[21.5rem] justify-self-center md:mt-8 md:justify-self-end lg:mt-8">
          <div className="aspect-[1913/2300] overflow-hidden rounded-[1.75rem] border border-border bg-neutral-100 shadow-sm">
            <img
              src="/images/background_picture.png"
              alt="Research background"
              className="block h-full w-full object-cover object-bottom"
            />
          </div>
        </div>
      </motion.section>

      {/* Publications */}
      <div className="space-y-12">
        <h2 className="font-serif text-2xl md:text-3xl font-bold">
          Selected Publications
        </h2>

        {publications.map((pub, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="grid md:grid-cols-2 gap-8 rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <div className="overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={pub.image}
                alt={pub.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-muted uppercase tracking-wide">
                {pub.journal} &middot; {pub.year}
              </span>
              <h3 className="mt-2 font-serif text-xl md:text-2xl font-bold leading-snug">
                {pub.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{pub.authors}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {pub.description}
              </p>
              <div className="mt-4 rounded-xl bg-accent p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
                  Methodology
                </p>
                <p className="text-sm leading-relaxed">{pub.methodology}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* ML Research */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-20"
      >
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
          Machine Learning Research
        </h2>

        <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:p-8 lg:gap-12">
          <div className="mx-auto w-full max-w-[28rem] space-y-4">
            <img
              src="/images/ML_remote_sensing_images.png"
              alt="ML remote sensing"
              className="rounded-xl border border-border"
            />
            <img
              src="/images/ML_remote_sensing_images_2.png"
              alt="ML remote sensing results"
              className="rounded-xl border border-border"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs text-muted uppercase tracking-wide">
              2019 &middot; Remote Sensing
            </span>
            <h3 className="mt-2 font-serif text-xl font-bold leading-snug">
              Multi-Model Fusion for Remote Sensing Object Detection
            </h3>
            <div className="mt-4 space-y-4 text-sm text-muted leading-relaxed">
              <p>
                This work improved object detection in remote sensing imagery,
                where targets are often small, dense, and difficult to localize
                consistently across large aerial scenes.
              </p>
              <p>
                <strong className="text-foreground">Objective:</strong> Improve remote sensing object
                detection through multi-model fusion, with a focus on more
                reliable localization and classification under challenging image
                conditions.
              </p>
              <p>
                <strong className="text-foreground">Multi-Model Fusion:</strong> Combines Fast R-CNN &amp;
                R-FCN to improve accuracy by leveraging the complementary
                strengths of both detectors. The framework uses minimal
                bounding-box information for initialization and refinement,
                supporting more stable proposals and stronger final
                localization.
              </p>
              <p>
                <strong className="text-foreground">Self-Paced Learning:</strong> Training progressed from
                easier, higher-confidence samples to more ambiguous cases,
                improving stability and generalization.
              </p>
              <p>
                <strong className="text-foreground">Impact:</strong> The pipeline improved robustness
                across scale variation, cluttered backgrounds, and sparse
                visual cues in geospatial vision tasks.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
