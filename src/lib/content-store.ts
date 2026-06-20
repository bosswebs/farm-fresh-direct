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

const PUBLISHED_KEY = "deacomart.content.v1"; // live content shown on landing
const DRAFT_KEY = "deacomart.content.draft.v1"; // edits in admin, not yet live
const EVENT = "deacomart:content-changed";

export type ContentMode = "published" | "draft";

function readKey(key: string): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...DEFAULT_CONTENT, ...parsed };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function getContent(mode: ContentMode = "published"): SiteContent {
  return readKey(mode === "draft" ? DRAFT_KEY : PUBLISHED_KEY);
}

export function getDraft(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  // If no draft yet, seed from published so editing starts from current live state.
  const raw = window.localStorage.getItem(DRAFT_KEY);
  if (raw) return readKey(DRAFT_KEY);
  return readKey(PUBLISHED_KEY);
}

export function saveDraft(c: SiteContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function publishDraft(c: SiteContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PUBLISHED_KEY, JSON.stringify(c));
  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function discardDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function resetContent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PUBLISHED_KEY);
  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function hasDraftChanges(): boolean {
  if (typeof window === "undefined") return false;
  const draft = window.localStorage.getItem(DRAFT_KEY);
  if (!draft) return false;
  const published = window.localStorage.getItem(PUBLISHED_KEY) ?? JSON.stringify(DEFAULT_CONTENT);
  return draft !== published;
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

// ----- Simple local admin auth (local-only backend) -----
// Password is stored hashed in localStorage on first setup. Session flag in sessionStorage.
const ADMIN_PASS_KEY = "deacomart.admin.pass.v1";
const ADMIN_SESSION_KEY = "deacomart.admin.session.v1";
export const DEFAULT_ADMIN_PASSWORD = "deacomart2026";

async function hash(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getStoredPasswordHash(): Promise<string> {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(ADMIN_PASS_KEY);
  if (existing) return existing;
  const h = await hash(DEFAULT_ADMIN_PASSWORD);
  window.localStorage.setItem(ADMIN_PASS_KEY, h);
  return h;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const stored = await getStoredPasswordHash();
  const candidate = await hash(password);
  const ok = candidate === stored;
  if (ok && typeof window !== "undefined") {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  }
  return ok;
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function adminSignOut() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export async function changeAdminPassword(current: string, next: string): Promise<boolean> {
  const ok = await verifyAdminPassword(current);
  if (!ok) return false;
  const h = await hash(next);
  window.localStorage.setItem(ADMIN_PASS_KEY, h);
  return true;
}