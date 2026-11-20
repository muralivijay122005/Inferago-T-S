"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Globe,
  Megaphone,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const NEEDS: { label: string; icon: LucideIcon }[] = [
  { label: "Website", icon: Globe },
  { label: "Web Application", icon: AppWindow },
  { label: "Mobile App", icon: Smartphone },
  { label: "Custom Software", icon: Code2 },
  { label: "E-commerce", icon: ShoppingBag },
  { label: "Digital Marketing", icon: Megaphone },
  { label: "SEO", icon: Search },
  { label: "AI Integration", icon: Sparkles },
  { label: "Other", icon: Plus },
];

const TIMELINES = ["As soon as possible", "1–3 months", "3–6 months", "Flexible"];

const STEPS = [
  { title: "What do you need?", hint: "Pick everything that applies." },
  { title: "Tell us about the project", hint: "A few lines is plenty to start." },
  { title: "How do we reach you?", hint: "We reply to every request personally." },
];

const DESCRIPTION_MAX = 1200;

/* Steps slide in from the side they're heading toward. */
const SLIDE = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
};

type Status = "idle" | "submitting" | "success" | "error";

type Brief = {
  services: string[];
  description: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
};

const EMPTY: Brief = {
  services: [],
  description: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  phone: "",
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/* Input whose placeholder floats up into a label once focused or filled. */
function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  multiline,
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  const shared = {
    value,
    required,
    maxLength,
    placeholder: " ",
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className:
      "peer w-full rounded-xl border border-white/10 bg-black/40 px-4 pt-6 pb-2.5 text-sm text-fg transition-all hover:border-white/20 focus:border-white/30 focus:bg-black/60 focus:ring-4 focus:ring-white/[0.06] focus:outline-none",
  };

  return (
    <label className="relative block">
      {multiline ? (
        <textarea rows={6} {...shared} className={cn(shared.className, "resize-none")} />
      ) : (
        <input type={type} autoComplete={autoComplete} {...shared} />
      )}
      <span
        className={cn(
          "pointer-events-none absolute left-4 -translate-y-1/2 text-sm text-fg-muted transition-all duration-200 peer-focus:top-3.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[11px]",
          multiline ? "top-[34px]" : "top-1/2"
        )}
      >
        {label}
        {required && " *"}
      </span>
    </label>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
        selected
          ? "border-fg bg-fg font-medium text-black"
          : "border-white/10 bg-white/[0.03] text-fg-muted hover:border-white/25 hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}

function BriefRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-4">
      <span className="text-xs text-fg-muted">{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value ? "set" : "empty"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className={cn("text-sm", value ? "text-fg" : "text-fg/25")}
        >
          {value || "—"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function ContactForm({ aside }: { aside?: ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => setBrief((b) => ({ ...b, [key]: value }));

  const toggleService = (label: string) =>
    set(
      "services",
      brief.services.includes(label) ? brief.services.filter((s) => s !== label) : [...brief.services, label]
    );

  const stepValid = [
    brief.services.length > 0,
    brief.description.trim().length > 0,
    brief.name.trim().length > 0 && isEmail(brief.email),
  ];

  const filled = [
    brief.services.length > 0,
    brief.description.trim().length > 0,
    Boolean(brief.timeline || brief.budget),
    brief.name.trim().length > 0,
    isEmail(brief.email),
  ].filter(Boolean).length;
  const completion = filled / 5;

  function go(to: number) {
    if (to > step && !stepValid[step]) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setDirection(to > step ? 1 : -1);
    setStep(to);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < STEPS.length - 1) return go(step + 1);
    if (!stepValid[step]) return setTouched(true);

    setStatus("submitting");
    const { services, ...rest } = brief;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, service: services.join(", ") }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setBrief(EMPTY);
    setStep(0);
    setStatus("idle");
  }

  const errorText = [
    "Choose at least one option to continue.",
    "Add a short description to continue.",
    "Add your name and a valid email to send.",
  ][step];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card overflow-hidden p-0">
        {/* Progress: one segment per step, clickable back to any finished step. */}
        <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4 sm:px-8">
          <div className="flex flex-1 gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                disabled={status === "success" || (i > step && !stepValid.slice(0, i).every(Boolean))}
                onClick={() => go(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08] disabled:cursor-default"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: status === "success" || i <= step ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="absolute inset-0 origin-left rounded-full bg-[image:var(--gradient-brand)]"
                />
              </button>
            ))}
          </div>
          <span className="shrink-0 text-xs text-fg-muted tabular-nums">
            {status === "success" ? "Sent" : `${step + 1} / ${STEPS.length}`}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex flex-col items-center gap-5 px-8 py-20 text-center"
            >
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="grid size-16 place-items-center rounded-full bg-fg text-black"
              >
                <Check className="size-7" strokeWidth={2.5} />
              </motion.span>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-semibold tracking-tight text-fg">
                  Thanks{brief.name ? `, ${brief.name.split(" ")[0]}` : ""}. We&apos;ll be in touch shortly.
                </p>
                <p className="text-sm text-fg-muted">We&apos;ll reply to {brief.email}.</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
              >
                Send another request
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-8 p-6 sm:p-8"
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={SLIDE}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex min-h-[340px] flex-col gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-medium tracking-[-0.03em] text-fg sm:text-3xl">{STEPS[step].title}</h3>
                    <p className="text-sm text-fg-muted">{STEPS[step].hint}</p>
                  </div>

                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {NEEDS.map(({ label, icon: Icon }) => {
                        const selected = brief.services.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleService(label)}
                            className={cn(
                              "group relative flex flex-col items-start gap-6 rounded-2xl border p-4 text-left transition-all duration-300",
                              selected
                                ? "border-fg bg-fg text-black"
                                : "border-white/[0.08] bg-white/[0.02] text-fg/85 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
                            )}
                          >
                            <Icon
                              className={cn("size-5 transition-colors", selected ? "text-black" : "text-fg-muted group-hover:text-fg")}
                              strokeWidth={1.75}
                            />
                            <span className="text-sm font-medium">{label}</span>
                            <span
                              className={cn(
                                "absolute top-3 right-3 grid size-5 place-items-center rounded-full border transition-all duration-300",
                                selected ? "scale-100 border-black bg-black text-fg" : "scale-75 border-white/15 opacity-0 group-hover:opacity-100"
                              )}
                            >
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <Field
                          label="What are you trying to build?"
                          value={brief.description}
                          onChange={(v) => set("description", v)}
                          required
                          multiline
                          maxLength={DESCRIPTION_MAX}
                        />
                        <span className="self-end text-xs text-fg/30 tabular-nums">
                          {brief.description.length} / {DESCRIPTION_MAX}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <span className="text-sm text-fg-muted">Timeline</span>
                        <div className="flex flex-wrap gap-2">
                          {TIMELINES.map((t) => (
                            <Chip key={t} selected={brief.timeline === t} onClick={() => set("timeline", brief.timeline === t ? "" : t)}>
                              {t}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <Field label="Budget (optional)" value={brief.budget} onChange={(v) => set("budget", v)} />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Name" value={brief.name} onChange={(v) => set("name", v)} required autoComplete="name" />
                      <Field
                        label="Email"
                        type="email"
                        value={brief.email}
                        onChange={(v) => set("email", v)}
                        required
                        autoComplete="email"
                      />
                      <Field label="Company" value={brief.company} onChange={(v) => set("company", v)} autoComplete="organization" />
                      <Field label="Phone" type="tel" value={brief.phone} onChange={(v) => set("phone", v)} autoComplete="tel" />
                    </div>
                  )}

                  <AnimatePresence>
                    {touched && !stepValid[step] && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-accent-orange"
                      >
                        {errorText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-fg-muted transition-all hover:text-fg",
                    step === 0 && "pointer-events-none opacity-0"
                  )}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50",
                    stepValid[step] ? "bg-fg text-black hover:bg-white" : "bg-white/[0.08] text-fg/60"
                  )}
                >
                  {status === "submitting"
                    ? "Sending…"
                    : step === STEPS.length - 1
                      ? "Send project request"
                      : "Continue"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {status === "error" && (
                <p className="text-sm text-accent-orange">Something went wrong. Please try again or email us directly.</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-6 self-start lg:sticky lg:top-24">
        {/* Live brief: fills in as the form does. */}
        <div className="card flex flex-col gap-4 p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-fg">Your brief</span>
            <span className="text-xs text-fg-muted tabular-nums">{Math.round(completion * 100)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              animate={{ scaleX: completion }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="h-full origin-left bg-[image:var(--gradient-brand)]"
            />
          </div>
          <BriefRow
            label="Needs"
            value={
              brief.services.length > 0 && (
                <span className="flex flex-wrap gap-1.5">
                  {brief.services.map((s) => (
                    <span key={s} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs">
                      {s}
                    </span>
                  ))}
                </span>
              )
            }
          />
          <BriefRow
            label="Project"
            value={
              brief.description.trim() &&
              (brief.description.length > 90 ? `${brief.description.slice(0, 90).trim()}…` : brief.description)
            }
          />
          <BriefRow label="Timeline" value={brief.timeline} />
          <BriefRow label="Budget" value={brief.budget} />
          <BriefRow
            label="Contact"
            value={[brief.name, brief.company].filter(Boolean).join(" · ") || undefined}
          />
        </div>
        {aside}
      </div>
    </div>
  );
}
