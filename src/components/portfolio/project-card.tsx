import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import type { Project } from "@/data/projects";

export function projectHost(project: Project) {
  return project.clientUrl
    ? new URL(project.clientUrl).host.replace(/^www\./, "")
    : `inferago.com/work/${project.slug}`;
}

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-surface p-7 transition-colors duration-500 hover:border-white/20 sm:min-h-[380px] sm:p-9"
    >
      {/* Dot grid fading in from the top-right corner; brand gradient hairline on hover. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_75%_65%_at_100%_0%,#000,transparent)]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[image:var(--gradient-brand)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-sm text-fg-muted">
          {index !== undefined && (
            <span className="text-fg/30 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          )}
          {project.type}
        </span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-fg-muted transition-colors duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-black">
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-16">
        <h3 className="text-3xl font-medium tracking-[-0.03em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 sm:text-4xl">
          {project.name}
        </h3>
        <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-fg-muted">{project.description}</p>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5 text-sm">
        <span className="text-fg/80">{project.industry}</span>
        <span className="flex min-w-0 items-center gap-1.5 text-fg-muted">
          <Globe className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{projectHost(project)}</span>
        </span>
      </div>
    </Link>
  );
}
