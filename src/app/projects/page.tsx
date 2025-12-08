"use client"
import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import Link from "next/link";
import Navbar from "@/sections/Navbar";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Tag from "@/components/Tag";
import design1 from "@/assets/images/design-example-1.png";
import design2 from "@/assets/images/design-example-2.png";
import logoSvg from "@/assets/images/logo.svg";
import avatarLula from "@/assets/images/avatar-lula-meyers.jpg";
import avatarOwen from "@/assets/images/avatar-owen-garcia.jpg";

const ACCENTS = [
  { from: "from-fuchsia-500/15", to: "to-purple-500/15" },
  { from: "from-cyan-500/15", to: "to-blue-500/15" },
  { from: "from-amber-500/15", to: "to-orange-500/15" },
  { from: "from-pink-500/15", to: "to-rose-500/15" },
  { from: "from-emerald-500/15", to: "to-teal-500/15" },
  { from: "from-violet-500/15", to: "to-indigo-500/15" },
];

const CATEGORY_ACCENT: Record<Required<Project>["category"], { from: string; to: string; text: string; dot: string; border: string }> = {
  web: { from: "from-cyan-500/25", to: "to-blue-500/25", text: "text-cyan-200", dot: "bg-cyan-300", border: "border-cyan-400/40" },
  ml: { from: "from-emerald-500/25", to: "to-teal-500/25", text: "text-emerald-200", dot: "bg-emerald-300", border: "border-emerald-400/40" },
  ai: { from: "from-fuchsia-500/25", to: "to-purple-500/25", text: "text-fuchsia-200", dot: "bg-fuchsia-300", border: "border-fuchsia-400/40" },
};

type Project = {
  title: string;
  description: string;
  image: StaticImageData;
  developer: string;
  devRole: string;
  developerAvatar: StaticImageData;
  tech: string[];
  link?: string;
  category: "web" | "ml" | "ai";
};

const PROJECTS: Project[] = [
  {
    title: "Club Landing Redesign",
    description:
      "A dark, glassy, motion‑forward landing experience with smooth gradients, subtle depth, and tasteful micro‑interactions.",
    image: design1,
    developer: "Lula Meyers",
    devRole: "Lead Designer",
    developerAvatar: avatarLula,
    tech: ["Next.js", "React", "Tailwind", "Framer Motion"],
    link: "https://example.com",
    category: "web",
  },
  {
    title: "Member Portal",
    description:
      "A lightweight portal for events, projects, and resources with fast navigation and crisp typography.",
    image: design2,
    developer: "Owen Garcia",
    devRole: "Frontend Engineer",
    developerAvatar: avatarOwen,
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    link: "https://example.com",
    category: "web",
  },
];

function ProjectCard({ project, index, variant = "list" as const }: { project: Project; index: number; variant?: "list" | "detail" }) {
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <motion.article
      layout
      initial={variant === "detail" ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: variant === "detail" ? 0 : 0.05 * index }}
      whileHover={variant === "list" ? { y: -2 } : undefined}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 backdrop-blur transition"
    >
      <div className="absolute -inset-24 -z-10 bg-gradient-to-br from-white/5 to-white/0 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
      </div>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <div className={`group relative w-full overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none ${variant === "detail" ? "h-56 md:h-auto" : "h-56 md:h-full"}`}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="h-full w-full">
              <Image src={project.image} alt={project.title} placeholder="blur" className="h-full w-full object-cover" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
          </div>
        </div>
        <div className="md:col-span-7">
          <div className={`${variant === "detail" ? "flex flex-col" : "flex h-full flex-col"} gap-4 p-6 md:p-8`}>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/60">
              <Image src={logoSvg} alt="Club" className="h-4 w-4" /> Project
            </div>
            <h3 className="text-2xl font-semibold leading-tight md:text-3xl">{project.title}</h3>
            <p className="text-white/80">{project.description}</p>

            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -inset-24 bg-gradient-to-br ${accent.from} ${accent.to} blur-3xl`} />
                </div>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px w-full opacity-50"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ originX: 0 }}
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </motion.div>
                <div className="relative text-xs uppercase tracking-widest text-white/60">Developer</div>
                <div className="relative mt-2 flex items-center gap-3">
                  <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-full border border-white/15">
                    <Image src={project.developerAvatar} alt={project.developer} width={36} height={36} className="h-full w-full object-cover" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold leading-tight text-white/90">{project.developer}</div>
                    <div className="text-sm text-white/65">{project.devRole}</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -inset-24 bg-gradient-to-br ${accent.from} ${accent.to} blur-3xl`} />
                </div>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px w-full opacity-50"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ originX: 0 }}
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </motion.div>
                <div className="relative text-xs uppercase tracking-widest text-white/60">Tech Stack</div>
                <div className="relative mt-2 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <motion.span
                      key={t}
                      whileHover={{ y: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      <span className="relative z-[1]">{t}</span>
                      <span className="pointer-events-none absolute inset-0">
                        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </span>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-1 text-sm text-white/60">
              <div>Crafted with care by our club</div>
              {project.link && (
                <Link
                  href={project.link}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/80 transition hover:border-white/25 hover:bg-white/10"
                  target="_blank"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const CATEGORIES: { key: Project["category"]; label: string }[] = [
  { key: "web", label: "WebDev" },
  { key: "ml", label: "Machine Learning" },
  { key: "ai", label: "AI" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = React.useState<Project["category"]>("web");
  const filtered = React.useMemo(() => PROJECTS.filter(p => p.category === activeCategory), [activeCategory]);
  const [activeTitle, setActiveTitle] = React.useState<string | null>(filtered[0]?.title ?? null);
  React.useEffect(() => {
    setActiveTitle(filtered[0]?.title ?? null);
  }, [activeCategory]);

  const activeProject = React.useMemo(() => filtered.find(p => p.title === activeTitle) ?? null, [filtered, activeTitle]);

  return (
    <>
      <Navbar />
      <section className="relative pt-24 pb-20">
        <div className="container max-w-6xl">
          <div className="relative mb-5 text-center">
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pointer-events-none absolute -inset-8 -z-10"
            >
              <motion.div
                className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-r from-fuchsia-500/15 via-purple-500/10 to-indigo-500/15 blur-3xl"
                animate={{ opacity: [0.6, 0.9, 0.6], y: [0, -6, 0] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>
            <Tag className="mx-auto">Our Work</Tag>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 text-balance text-4xl font-semibold md:text-6xl"
            >
              <span>Projects</span>{" "}
              <span className="text-white/60">built by</span>{" "}
              <span className="text-[#E45A92]">the club</span>
            </motion.h2>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <LayoutGroup>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm backdrop-blur transition hover:border-white/25 hover:bg-white/10 ${activeCategory === cat.key ? CATEGORY_ACCENT[cat.key].border + " text-white" : "border-white/15 bg-white/5 text-white/80"}`}
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeCategory === cat.key ? CATEGORY_ACCENT[cat.key].dot : "bg-white/50"}`} />
                    <span className={activeCategory === cat.key ? CATEGORY_ACCENT[cat.key].text : ""}>{cat.label}</span>
                  </span>
                  {activeCategory === cat.key && (
                    <motion.span layoutId="active-cat" className={`absolute inset-0 rounded-full bg-gradient-to-r ${CATEGORY_ACCENT[cat.key].from} ${CATEGORY_ACCENT[cat.key].to}`} />
                  )}
                </button>
              ))}
            </LayoutGroup>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <aside className="md:col-span-4 lg:col-span-3">
              <LayoutGroup>
                <nav className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-2 backdrop-blur">
                  {filtered.map((proj) => {
                    const isActive = proj.title === activeTitle;
                    return (
                      <button
                        key={proj.title}
                        onClick={() => setActiveTitle(proj.title)}
                        className="group relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-white/40 group-hover:bg-white/70" />
                          <span className="font-medium">{proj.title}</span>
                        </div>
                        {isActive && (
                          <motion.span layoutId="active-dot-proj" className="h-6 w-6 rounded-full border border-white/15 bg-white/10" />
                        )}
                        {isActive && (
                          <motion.div layoutId="active-bg-proj" className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r ${CATEGORY_ACCENT[activeCategory].from} ${CATEGORY_ACCENT[activeCategory].to}`} />
                        )}
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="px-4 py-6 text-sm text-white/60">No projects yet for this category.</div>
                  )}
                </nav>
              </LayoutGroup>
            </aside>

            <div className="md:col-span-8 lg:col-span-9">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-6 md:p-10 backdrop-blur">
                <AnimatePresence mode="wait">
                  {!activeProject ? (
                    <motion.div
                      key="proj-placeholder"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="mx-auto max-w-2xl text-center"
                    >
                      <div className="mb-4 text-sm uppercase tracking-widest text-white/50">Projects</div>
                      <p className="text-balance text-2xl font-medium text-white/90 md:text-3xl">
                        Select a category and a project from the left to preview details.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeProject.title}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <ProjectCard project={activeProject} index={0} variant="detail" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-center text-sm text-white/60">
                <Link href="/" className="underline decoration-white/20 underline-offset-4 hover:decoration-white/50">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


