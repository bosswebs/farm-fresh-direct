import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/products-store";

export type Service = { title: string; desc: string; icon: string };
export type TeamMember = { role: string; name: string; expertise: string };
export type ContactInfo = {
  headquarters: string;
  phones: string;
  whatsapp: string;
  email: string;
  bank: string;
};
export type TermsInfo = {
  intro: string;
  bullets: string[];
  bankName: string;
  accountName: string;
  accountNumber: string;
  tin: string;
  lpoHours: number;
};

export type SiteContent = {
  servicesHeading: string;
  servicesIntro: string;
  services: Service[];
  partners: string[];
  team: TeamMember[];
  contact: ContactInfo;
  terms: TermsInfo;
};

export const DEFAULT_CONTENT: SiteContent = {
  servicesHeading: "Four pillars. One eco-conscious mission.",
  servicesIntro:
    "From the farm gate to the supermarket shelf, Deacomart strengthens every link in Rwanda's agricultural value chain.",
  services: [
    {
      icon: "GraduationCap",
      title: "Farmer Training",
      desc: "Structured programs across all Districts of Rwanda — modern agriculture, Hinga Ugwize, value addition, food safety, post-harvest management, and financial literacy.",
    },
    {
      icon: "Truck",
      title: "Food & Beverage Distribution",
      desc: "Wholesale and retail supply of juices, teas, honey, sesame, avocado, eggs and condiments to supermarkets, hotels, restaurants and institutions.",
    },
    {
      icon: "Briefcase",
      title: "Consultancy Services",
      desc: "Agribusiness strategy, food safety audits, project design, business development, and IT & digital transformation for the agricultural value chain.",
    },
    {
      icon: "MessageCircle",
      title: "WhatsApp Ordering",
      desc: "Order directly on WhatsApp, receive catalogues and promotions, book training, and track deliveries — fast, personal service.",
    },
  ],
  partners: [
    "Gorillas Golf Hotel",
    "Dove Hotel Kigali",
    "Great Seasons Hotel",
    "Nyagatare Farmers Coop",
    "Food & Beverage Partners",
  ],
  team: [
    { role: "CEO", name: "Dukuzumuremyi Eric", expertise: "Agribusiness Expert" },
    { role: "Founder & MD", name: "Ahishakiye Claudine (Zoe)", expertise: "Business Strategy & Operations" },
    { role: "Accountant", name: "Turimaso Innocent", expertise: "Finance & Accounting" },
    { role: "Business Developer", name: "Habimana Joseph", expertise: "Business Development" },
    { role: "Food Scientist", name: "Niyonsaba Jeanclaude", expertise: "Food Safety & Quality" },
    { role: "IT Manager", name: "Bosco", expertise: "Technology & Systems" },
    { role: "IT Staff", name: "Ngoboka Noel", expertise: "IT Support" },
    { role: "Agronomist", name: "TBD", expertise: "Agricultural Advisory" },
  ],
  contact: {
    headquarters: "Kigali, Rwanda",
    phones: "+250 780 165 257 · +250 798 975 082 · +250 784 467 541",
    whatsapp: `${WHATSAPP_NUMBER} (Orders & Inquiries)`,
    email: CONTACT_EMAIL,
    bank: "Equity Bank — Deacomart Ltd · Acc. 4014201311299",
  },
  terms: {
    intro:
      "Deacomart Ltd operates under transparent, customer-first delivery and payment terms. Please review before placing wholesale or institutional orders.",
    bullets: [
      "Flexible booking arrangements for training and consultancy services.",
      "Local Purchase Order (LPO) confirmation required at least 2 hours before delivery.",
      "Delivery available across all Districts of Rwanda; same-day delivery within Kigali for orders confirmed before 12:00.",
      "All prices are quoted in Rwandan Francs (RWF) and exclude VAT unless otherwise stated.",
      "Payment accepted via bank transfer, mobile money (MoMo), or cash on delivery for verified institutional clients.",
      "Invoices and EBM receipts issued for every transaction (TIN 150039210).",
    ],
    bankName: "Equity Bank",
    accountName: "Deacomart Ltd",
    accountNumber: "4014201311299",
    tin: "150039210",
    lpoHours: 2,
  },
};

const STORAGE_KEY = "deacomart.content.v1";
const EVENT = "deacomart:content-changed";

export function getContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...DEFAULT_CONTENT, ...parsed };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(c: SiteContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function resetContent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeContent(cb: () => void) {
  const h = () => cb();
  window.addEventListener(EVENT, h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener(EVENT, h);
    window.removeEventListener("storage", h);
  };
}