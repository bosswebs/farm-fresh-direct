export type ServiceItem = {
  id: string;
  iconName: string;
  title: string;
  description: string;
};

export type TeamItem = {
  id: string;
  role: string;
  name: string;
  expertise: string;
};

export type ContactInfo = {
  headquarters: string;
  phones: string;
  whatsapp: string;
  email: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  tin: string;
};

export type SiteContent = {
  services: ServiceItem[];
  team: TeamItem[];
  partners: string[];
  contact: ContactInfo;
};

const CONTENT_STORAGE_KEY = "deacomart.sitecontent.v1";

const SEED_CONTENT: SiteContent = {
  services: [
    {
      id: "s-1",
      iconName: "GraduationCap",
      title: "Farmer Training",
      description: "Structured programs across all Districts of Rwanda — modern agriculture, Hinga Ugwize, value addition, food safety, post-harvest management, and financial literacy."
    },
    {
      id: "s-2",
      iconName: "Truck",
      title: "Food & Beverage Distribution",
      description: "Wholesale and retail supply of juices, teas, honey, sesame, avocado, eggs and condiments to supermarkets, hotels, restaurants and institutions."
    },
    {
      id: "s-3",
      iconName: "Briefcase",
      title: "Consultancy Services",
      description: "Agribusiness strategy, food safety audits, project design, business development, and IT & digital transformation for the agricultural value chain."
    },
    {
      id: "s-4",
      iconName: "MessageCircle",
      title: "WhatsApp Ordering",
      description: "Order directly on WhatsApp, receive catalogues and promotions, book training, and track deliveries — fast, personal service."
    }
  ],
  team: [
    { id: "t-1", role: "CEO", name: "Dukuzumuremyi Eric", expertise: "Agribusiness Expert" },
    { id: "t-2", role: "Founder & MD", name: "Ahishakiye Claudine (Zoe)", expertise: "Business Strategy & Operations" },
    { id: "t-3", role: "Accountant", name: "Turimaso Innocent", expertise: "Finance & Accounting" },
    { id: "t-4", role: "Business Developer", name: "Habimana Joseph", expertise: "Business Development" },
    { id: "t-5", role: "Food Scientist", name: "Niyonsaba Jeanclaude", expertise: "Food Safety & Quality" },
    { id: "t-6", role: "IT Manager", name: "Bosco", expertise: "Technology & Systems" },
    { id: "t-7", role: "IT Staff", name: "Ngoboka Noel", expertise: "IT Support" },
    { id: "t-8", role: "Agronomist", name: "TBD", expertise: "Agricultural Advisory" }
  ],
  partners: [
    "Gorillas Golf Hotel",
    "Dove Hotel Kigali",
    "Great Seasons Hotel",
    "Nyagatare Farmers Coop",
    "Food & Beverage Partners"
  ],
  contact: {
    headquarters: "Kigali, Rwanda",
    phones: "+250 780 165 257 · +250 798 975 082 · +250 784 467 541",
    whatsapp: "+250 780 165 257",
    email: "deaco2025@gmail.com",
    bankName: "Equity Bank Rwanda",
    bankAccount: "4014201311299",
    bankHolder: "Deacomart Ltd",
    tin: "150039210"
  }
};

export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") return SEED_CONTENT;
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) {
      // Seed initial data
      window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(SEED_CONTENT));
      return SEED_CONTENT;
    }
    const parsed = JSON.parse(raw) as SiteContent;
    // Fallback/fill missing values to prevent errors
    return {
      services: parsed.services || SEED_CONTENT.services,
      team: parsed.team || SEED_CONTENT.team,
      partners: parsed.partners || SEED_CONTENT.partners,
      contact: { ...SEED_CONTENT.contact, ...(parsed.contact || {}) }
    };
  } catch {
    return SEED_CONTENT;
  }
}

export function updateSiteContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent("deacomart:content-changed"));
}

export function subscribeContent(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("deacomart:content-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("deacomart:content-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
