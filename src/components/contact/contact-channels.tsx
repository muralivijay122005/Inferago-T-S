"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import type { CompanyContact } from "@/data/company";

const CONTACT_LABELS: Record<keyof CompanyContact, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  location: "Location",
};

function hrefFor(key: keyof CompanyContact, value: string) {
  if (key === "email") return `mailto:${value}`;
  if (key === "phone") return `tel:${value.replace(/\s/g, "")}`;
  if (key === "whatsapp") return `https://wa.me/${value.replace(/\D/g, "")}`;
  if (key === "linkedin" || key === "instagram") return value;
  return undefined;
}

export function ContactChannels({ contact }: { contact: CompanyContact }) {
  const [copied, setCopied] = useState<string | null>(null);
  const channels = (Object.entries(contact) as [keyof CompanyContact, string | undefined][]).filter(
    (entry): entry is [keyof CompanyContact, string] => Boolean(entry[1])
  );

  if (channels.length === 0) return null;

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1800);
    } catch {
      // Clipboard can be blocked; the link beside it still works.
    }
  }

  return (
    <div className="card flex flex-col gap-4 p-7">
      <span className="text-sm font-medium text-fg">Prefer to reach us directly?</span>
      {channels.map(([key, value]) => {
        const href = hrefFor(key, value);
        return (
          <div key={key} className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            <span className="text-xs text-fg-muted">{CONTACT_LABELS[key]}</span>
            <div className="flex items-center gap-2">
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex min-w-0 flex-1 items-center justify-between gap-3 rounded-full border border-white/10 px-4 py-2.5 text-sm text-fg transition-colors hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <span className="truncate">{value}</span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                </a>
              ) : (
                <span className="flex-1 text-sm text-fg">{value}</span>
              )}
              <button
                type="button"
                onClick={() => copy(key, value)}
                aria-label={`Copy ${CONTACT_LABELS[key].toLowerCase()}`}
                className="relative grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied === key ? "done" : "copy"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {copied === key ? <Check className="size-4 text-fg" /> : <Copy className="size-4" />}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence>
                  {copied === key && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 rounded-md bg-fg px-2 py-1 text-[11px] font-medium whitespace-nowrap text-black"
                    >
                      Copied
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
