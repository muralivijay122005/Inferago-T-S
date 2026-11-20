import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { DitherField } from "@/components/ui/dither-field";
import { Eyebrow } from "@/components/ui/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { TechnologyBadge } from "@/components/shared/technology-badge";
import { projectHost } from "@/components/portfolio/project-card";
import { PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} | Inferago Tech & Digital Services`,
    description: project.description,
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-fg-muted">
      {children}
    </h2>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const story = [
    { label: "The Challenge", text: project.problem },
    { label: "The Approach", text: project.approach },
    { label: "The Solution", text: project.solution },
  ].filter((s): s is { label: string; text: string } => Boolean(s.text));

  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-14 sm:pt-52">
        <DitherField
          tone="grey"
          interactive
          className="inset-x-0 top-0 h-[520px]"
          shape={[0.78, 0, 0.5, 0.7]}

        />
        <Container className="relative flex flex-col gap-6">
          <Eyebrow>{project.services.join(" · ")}</Eyebrow>
          <h1 className="text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {project.description}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">
            {[
              { label: "Industry", value: project.industry },
              { label: "Services", value: project.services.join(", ") },
              ...(project.timeline ? [{ label: "Timeline", value: project.timeline }] : []),
            ].map((meta) => (
              <div key={meta.label} className="flex flex-col gap-1 bg-black/80 px-6 py-5 backdrop-blur-md">
                <span className="text-sm text-fg-muted">
                  {meta.label}
                </span>
                <span className="text-sm text-fg">{meta.value}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {project.clientUrl && (
        <section className="pb-12">
          <Container>
            <a
              href={project.clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group card relative flex flex-col gap-8 overflow-hidden p-8 transition-colors duration-500 hover:border-white/20 sm:flex-row sm:items-end sm:justify-between sm:p-12"
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_70%_90%_at_100%_100%,#000,transparent)]"
              />
              <div className="flex flex-col gap-3">
                <span className="text-sm text-fg-muted">Live at</span>
                <span className="flex items-center gap-3 text-3xl font-medium tracking-[-0.03em] break-all text-fg sm:text-5xl">
                  <Globe className="size-6 shrink-0 text-fg-muted sm:size-8" strokeWidth={1.5} />
                  {projectHost(project)}
                </span>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-black">
                Visit site
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Container>
        </section>
      )}

      {story.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {story.map((s, i) => (
              <div key={s.label} className="card flex flex-col gap-4 p-7">
                <span className="mb-4 text-sm text-fg-muted tabular-nums">
                  0{i + 1}
                </span>
                <SectionLabel>{s.label}</SectionLabel>
                <p className="text-sm leading-relaxed text-fg/80">{s.text}</p>
              </div>
            ))}
          </Container>
        </section>
      )}

      {project.features && project.features.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="flex flex-col gap-6">
            <SectionLabel>Features</SectionLabel>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-surface px-5 py-4 text-sm text-fg/85"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-fg-muted" strokeWidth={2.5} />
                  {feature}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {project.technology && project.technology.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="flex flex-col gap-6">
            <SectionLabel>Technology</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {project.technology.map((tech) => (
                <TechnologyBadge key={tech} name={tech} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {project.results && (
        <section className="py-20 sm:py-24">
          <Container>
            <div className="card flex flex-col gap-4 p-8 sm:p-12">
              <SectionLabel>Result</SectionLabel>
              <p className="max-w-3xl text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl">
                {project.results}
              </p>
            </div>
          </Container>
        </section>
      )}

      <CTASection
        title="Have a Similar Project?"
        description="Tell us what you're trying to build. We'll help you figure out the right approach."
      />
    </>
  );
}
