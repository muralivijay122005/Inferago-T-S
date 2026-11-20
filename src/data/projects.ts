export type Project = {
  slug: string;
  name: string;
  client?: string;
  industry: string;
  type: string;
  category: "web" | "apps" | "software" | "ecommerce" | "ai" | "marketing";
  services: string[];
  description: string;
  problem?: string;
  approach?: string;
  solution?: string;
  features?: string[];
  technology?: string[];
  timeline?: string;
  results?: string;
  clientUrl?: string;
};

// Minimal real entries — populated from each live site's own public
// metadata (title/description) since detailed case-study copy (problem/
// approach/solution/results) hasn't been provided yet. Expand with that
// detail once available rather than inventing it.
export const PROJECTS: Project[] = [
  {
    slug: "grotec-agro",
    name: "Grotec Agro",
    client: "GROTEC Organic Private Limited",
    industry: "Agriculture",
    type: "CRM & HRMS Platform",
    category: "software",
    services: ["Custom Software"],
    description:
      "GROTEC FarmerOS, an integrated CRM and HRMS platform managing leads, customers, telecallers, attendance, payroll and KPIs across field operations.",
    clientUrl: "https://crm.grotecagro.com",
  },
  {
    slug: "perceptic",
    name: "Perceptic",
    industry: "Digital Marketing",
    type: "Agency Website",
    category: "web",
    services: ["Website Development"],
    description:
      "A website for Perceptic, a digital marketing agency running data-driven audience targeting, performance advertising and analytics.",
    clientUrl: "https://perceptic.vercel.app",
  },
  {
    slug: "algodon-fashion",
    name: "Algodon Fashion",
    industry: "Fashion & Apparel",
    type: "E-commerce Store",
    category: "ecommerce",
    services: ["E-commerce Development"],
    description:
      "An online store for Algodon Fashion's hand block-printed, 100% organic cotton shirts, crafted in India with botanical dyes.",
    clientUrl: "https://www.algodonfashion.com",
  },
  {
    slug: "care-dent",
    name: "Care Dent",
    industry: "Dental Equipment & Clinical Solutions",
    type: "Business Website",
    category: "web",
    services: ["Website Development"],
    description: "A website for Care Dent, a dental equipment and clinical solutions supplier.",
    clientUrl: "https://www.caredent.net",
  },
  {
    slug: "feline-genuine-lubricants",
    name: "Feline Genuine Lubricants",
    industry: "Industrial Lubricants",
    type: "Business Website",
    category: "web",
    services: ["Website Development"],
    description:
      "Premium industrial-grade engine oils and lubricants formulated to exceed international standards.",
    clientUrl: "https://felinelube.vercel.app",
  },
];
