import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { DitherField } from "@/components/ui/dither-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactChannels } from "@/components/contact/contact-channels";
import { COMPANY_CONTACT } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact | Inferago Tech & Digital Services",
  description: "Tell us what you're trying to build.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-44 pb-24 sm:pt-52 sm:pb-32">
      <DitherField
        tone="grey"
        interactive
        className="inset-x-0 top-0 h-[520px]"
        shape={[0.78, 0, 0.5, 0.7]}

      />

      <Container className="relative flex flex-col gap-12">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build"
          highlight="something."
          description="Three quick steps. Tell us what you're trying to build and we'll help you figure out the right approach."
          className="[&_h2]:text-5xl sm:[&_h2]:text-6xl lg:[&_h2]:text-7xl"
        />
        <ContactForm aside={<ContactChannels contact={COMPANY_CONTACT} />} />
      </Container>
    </section>
  );
}
