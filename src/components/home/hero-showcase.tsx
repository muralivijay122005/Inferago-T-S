"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Globe, Smartphone, Code2, Lock } from "lucide-react";
import { EASE_OUT } from "@/components/motion/reveal";
import { DitherField } from "@/components/ui/dither-field";
import { PROJECTS } from "@/data/projects";
import { projectHost } from "@/components/portfolio/project-card";
import { cn } from "@/lib/utils";

const CHIPS = [
  { label: "Websites", caption: "Fast, search-ready sites", icon: Globe, position: "-left-16 top-[16%]", float: "float-slow" },
  { label: "Apps", caption: "iOS, Android and web", icon: Smartphone, position: "-right-14 top-[40%]", float: "float-slower" },
  { label: "Software", caption: "Custom systems and tools", icon: Code2, position: "-left-10 bottom-[14%]", float: "float-slower" },
];

const CYCLE_MS = 4500;

/**
 * Browser-window mockup that tilts upright as it scrolls into view and
 * cycles through real client sites from the portfolio.
 */
export function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const project = PROJECTS[active];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  useEffect(() => {
    if (PROJECTS.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % PROJECTS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [active]);

  if (!project) return null;
  const host = projectHost(project);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.9 }}
      className="relative mx-auto mt-16 w-full max-w-5xl [perspective:1600px] sm:mt-24"
    >
      {/* Pixel grain rising from behind the window's top edge; the mask keeps it clear of the CTAs above. */}
      <DitherField
        interactive
        className="-z-10 left-1/2 -top-28 h-[560px] w-screen -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_35%,#000_75%,transparent)] sm:-top-40"
        shape={[0.5, 0.45, 0.75, 0.6]}
        bias={0.45}
      />

      {/* Glow behind the window. */}
      <div
        aria-hidden
        className="absolute inset-x-[8%] -bottom-10 top-[20%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(239,107,57,0.35),rgba(25,150,235,0.25)_45%,transparent_70%)] blur-3xl"
      />

      <motion.div style={{ rotateX, scale }} className="relative origin-bottom will-change-transform">
        <div className="card overflow-hidden p-0 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-surface-raised/80 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-accent-blue" />
              <span className="size-2.5 rounded-full bg-accent-orange" />
              <span className="size-2.5 rounded-full bg-accent-sand" />
            </div>
            <div className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 rounded-md bg-black/50 px-3 py-1 text-xs text-fg-muted">
              <Lock className="size-3 shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={host}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="truncate"
                >
                  {host}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="hidden gap-1 sm:flex">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${p.name}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === active ? "w-6 bg-fg" : "w-1.5 bg-white/25 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Project panel: typography on a dot grid, swapped as the cycle advances. */}
          <Link
            href={`/work/${project.slug}`}
            className="group relative isolate block aspect-[4/3] w-full overflow-hidden bg-bg-secondary text-left sm:aspect-video"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_80%_80%_at_100%_0%,#000,transparent)]"
            />
            <div
              aria-hidden
              className="absolute -top-1/3 -right-1/4 -z-10 size-[70%] rounded-full bg-[radial-gradient(circle,rgba(25,150,235,0.22),rgba(239,107,57,0.12)_45%,transparent_70%)] blur-2xl"
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="absolute inset-0 flex flex-col p-6 sm:p-10 lg:p-12"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {[project.type, project.industry].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-fg/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 text-sm text-fg/30 tabular-nums">
                    {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-3 sm:gap-4">
                  <span className="text-xs text-fg-muted sm:text-sm">Recent work</span>
                  <span className="text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-6xl lg:text-7xl">
                    {project.name}
                  </span>
                  <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <span className="absolute right-6 bottom-6 hidden rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-fg backdrop-blur-md transition-colors group-hover:border-white/40 sm:right-10 sm:bottom-10 sm:block lg:right-12 lg:bottom-12">
              View case study →
            </span>
          </Link>
        </div>

        {/* Floating capability chips (desktop only). */}
        {CHIPS.map(({ label, caption, icon: Icon, position, float }, i) => (
          <div
            key={label}
            style={{ animationDelay: `${1.5 + i * 0.15}s` }}
            className={cn("chip-in absolute z-10 hidden lg:block", position)}
          >
            <div
              className={cn(
                "flex w-max items-center gap-3 rounded-2xl border border-white/10 bg-black/70 py-2.5 pr-5 pl-2.5 text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl",
                float
              )}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-white/[0.06]">
                <Icon className="size-4 text-fg" strokeWidth={1.75} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-fg">{label}</span>
                <span className="text-xs text-fg-muted">{caption}</span>
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
