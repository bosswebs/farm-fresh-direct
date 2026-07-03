import { supabase } from "@/integrations/supabase/client";

export type Category =
  | "Juices & Beverages"
  | "Teas & Herbal"
  | "Natural Health"
  | "Condiments & Staples"
  | "Fresh Produce"
  | "Poultry & Eggs";

export const CATEGORIES: Category[] = [
  "Juices & Beverages",
  "Teas & Herbal",
  "Natural Health",
  "Condiments & Staples",
  "Fresh Produce",
  "Poultry & Eggs",
];

export type Unit = "Kg" | "Litre" | "Bottle" | "Jar" | "Pack" | "Tray" | "Dozen" | "Piece";
export const UNITS: Unit[] = ["Kg", "Litre", "Bottle", "Jar", "Pack", "Tray", "Dozen", "Piece"];

export const WHATSAPP_NUMBER = "+250780165257";
export const WHATSAPP_LINK = "https://wa.me/250780165257";
export const CONTACT_EMAIL = "deaco2025@gmail.com";

export function formatRWF(n: number): string {
  return `RWF ${Math.round(n).toLocaleString()}`;
}

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  quantity: number;
  unit: Unit;
  location: string;
  farmerName: string;
  farmName: string;
  harvestDate: string; // ISO date
  image: string; // stable public image path, data URL, or uploaded image URL
  rating: number;
  createdAt: number;
  organicStatus?: boolean;
  qualityStatus?: boolean;
  foodSafetyStatus?: boolean;
};

const STORAGE_KEY = "deacomart.products.v2";
const SEEDED_KEY = "deacomart.seeded.v2";
const LEGACY_KEYS = [
  "agrimarket.products.v1",
  "agrimarket.seeded.v1",
  "deacomart.products.v1",
  "deacomart.seeded.v1",
];

const PRODUCT_IMAGES = {
  passionJuice: "/images/JAMA FRUITS JUICE.jpeg",
  hibiscusTea: "/images/HIBISCUS TEA.jpeg",
  honey: "/images/detox.jpeg",
  avocado: "/images/AVOCADO AIL.jpeg",
  sesame: "/images/pumpkin seeds.jpeg",
  eggs: "/images/amagi.jpg",
  greenTea: "/images/green tea.jpeg",
  salsa: "/images/AMBIANCE JUICES.jpeg",
  blackTea: "/images/black tea.jpeg",
  gingerTea: "/images/ginger tea.jpeg",
} as const;

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const SEED: Product[] = [
  {
    id: "seed-1",
    name: "Passion Fruit Juice",
    category: "Juices & Beverages",
    description:
      "100% natural passion juice bottled fresh from Rwandan orchards. No added preservatives — crisp, tangy, and refreshing.",
    price: 2500,
    quantity: 240,
    unit: "Bottle",
    location: "Kigali, Rwanda",
    farmerName: "Deacomart Ltd",
    farmName: "Deacomart Distribution",
    harvestDate: today(-1),
    image: PRODUCT_IMAGES.passionJuice,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-2",
    name: "Hibiscus Herbal Tea",
    category: "Teas & Herbal",
    description:
      "Caffeine-free hibiscus blend grown by Nyagatare farmers. Bright, floral and rich in antioxidants.",
    price: 3200,
    quantity: 80,
    unit: "Pack",
    location: "Nyagatare, Rwanda",
    farmerName: "Nyagatare Farmers Cooperative",
    farmName: "Cyabayaga Tea Growers",
    harvestDate: today(-10),
    image: PRODUCT_IMAGES.hibiscusTea,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: false,
  },
  {
    id: "seed-3",
    name: "Pure Rwandan Honey",
    category: "Natural Health",
    description:
      "Raw, unfiltered honey harvested by smallholder beekeepers trained by Deacomart. Single-origin and traceable.",
    price: 6500,
    quantity: 60,
    unit: "Jar",
    location: "Musanze, Rwanda",
    farmerName: "Habimana Joseph",
    farmName: "Volcanoes Apiary",
    harvestDate: today(-30),
    image: PRODUCT_IMAGES.honey,
    rating: 5.0,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-4",
    name: "Hass Avocado",
    category: "Fresh Produce",
    description: "Buttery, ripe Hass avocados delivered the day after harvest. Perfect for hotels and restaurants.",
    price: 1800,
    quantity: 150,
    unit: "Kg",
    location: "Huye, Rwanda",
    farmerName: "Southern Growers Group",
    farmName: "Huye Avocado Farm",
    harvestDate: today(-2),
    image: PRODUCT_IMAGES.avocado,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    organicStatus: true,
    qualityStatus: false,
    foodSafetyStatus: true,
  },
  {
    id: "seed-5",
    name: "Roasted Sesame Seeds",
    category: "Natural Health",
    description: "Sun-dried, lightly roasted sesame — high in calcium and protein. Ideal for bakeries and home kitchens.",
    price: 4200,
    quantity: 18,
    unit: "Kg",
    location: "Bugesera, Rwanda",
    farmerName: "Eastern Oilseed Coop",
    farmName: "Bugesera Sesame Farm",
    harvestDate: today(-25),
    image: PRODUCT_IMAGES.sesame,
    rating: 4.6,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    organicStatus: false,
    qualityStatus: true,
    foodSafetyStatus: false,
  },
  {
    id: "seed-6",
    name: "Free-Range Eggs",
    category: "Poultry & Eggs",
    description: "Pasture-raised eggs from happy hens. Delivered daily to Kigali partners and households.",
    price: 3600,
    quantity: 90,
    unit: "Tray",
    location: "Kigali, Rwanda",
    farmerName: "Deacomart Poultry Partners",
    farmName: "Hilltop Poultry",
    harvestDate: today(0),
    image: PRODUCT_IMAGES.eggs,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 30,
    organicStatus: false,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-7",
    name: "Green Tea Leaves",
    category: "Teas & Herbal",
    description: "Premium loose-leaf green tea from Rwanda's highland plantations. Smooth, grassy and clean.",
    price: 3000,
    quantity: 120,
    unit: "Pack",
    location: "Nyabihu, Rwanda",
    farmerName: "Highland Tea Growers",
    farmName: "Nyabihu Tea Estate",
    harvestDate: today(-7),
    image: PRODUCT_IMAGES.greenTea,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: false,
  },
  {
    id: "seed-8",
    name: "House-Made Salsa",
    category: "Condiments & Staples",
    description: "Fresh tomato salsa with onion, coriander and chilli — produced under Deacomart food safety standards.",
    price: 2800,
    quantity: 45,
    unit: "Jar",
    location: "Kigali, Rwanda",
    farmerName: "Deacomart Ltd",
    farmName: "Deacomart Kitchen",
    harvestDate: today(-3),
    image: PRODUCT_IMAGES.salsa,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
    organicStatus: false,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-9",
    name: "Black Tea Leaves",
    category: "Teas & Herbal",
    description: "Full-bodied Rwandan black tea from highland estates — rich, malty and aromatic. Wholesale and retail.",
    price: 2800,
    quantity: 100,
    unit: "Pack",
    location: "Nyabihu, Rwanda",
    farmerName: "Highland Tea Growers",
    farmName: "Nyabihu Tea Estate",
    harvestDate: today(-9),
    image: PRODUCT_IMAGES.blackTea,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-10",
    name: "Ginger Herbal Tea",
    category: "Teas & Herbal",
    description: "Warming ginger infusion blended with Rwandan herbs — naturally caffeine-free and soothing.",
    price: 3500,
    quantity: 70,
    unit: "Pack",
    location: "Musanze, Rwanda",
    farmerName: "Volcanoes Herb Coop",
    farmName: "Musanze Herbal Gardens",
    harvestDate: today(-12),
    image: PRODUCT_IMAGES.gingerTea,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
  {
    id: "seed-11",
    name: "Premium Organic Eggs Tray",
    category: "Poultry & Eggs",
    description: "Farm fresh organic eggs, high in protein, harvested from pasture-fed chickens. Packed carefully in a tray of 30 eggs.",
    price: 4500,
    quantity: 60,
    unit: "Tray",
    location: "Musanze, Rwanda",
    farmerName: "EcoWise Poultry Farm",
    farmName: "Musanze Poultry Partners",
    harvestDate: today(-1),
    image: "/images/page_30_eggs.width-610.jpg",
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    organicStatus: true,
    qualityStatus: true,
    foodSafetyStatus: true,
  },
];

function safeRead(): Product[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

function safeWrite(items: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("agrimarket:products-changed"));
}

function refreshSeedProductImages(items: Product[]): Product[] {
  const seedImageById = new Map(SEED.map((product) => [product.id, product.image]));
  let changed = false;
  const refreshed = items.map((product) => {
    const seedImage = seedImageById.get(product.id);
    if (!seedImage || product.image === seedImage) return product;
    changed = true;
    return { ...product, image: seedImage };
  });
  return changed ? refreshed : items;
}

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  // Purge legacy keys
  LEGACY_KEYS.forEach((k) => {
    try { window.localStorage.removeItem(k); } catch { /* ignore */ }
  });
  let current = safeRead();
  if (current.length === 0) {
    safeWrite(SEED);
    window.localStorage.setItem(SEEDED_KEY, "1");
    return;
  }

  // Merge any missing seed products
  const currentIds = new Set(current.map((p) => p.id));
  const missingSeeds = SEED.filter((p) => !currentIds.has(p.id));
  if (missingSeeds.length > 0) {
    current = [...current, ...missingSeeds];
    safeWrite(current);
  }

  const refreshed = refreshSeedProductImages(current);
  if (refreshed !== current) safeWrite(refreshed);
  if (!window.localStorage.getItem(SEEDED_KEY)) {
    window.localStorage.setItem(SEEDED_KEY, "1");
  }
}

export function listProducts(): Product[] {
  ensureSeeded();
  return safeRead().sort((a, b) => b.createdAt - a.createdAt);
}

export function getProduct(id: string): Product | undefined {
  return listProducts().find((p) => p.id === id);
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "rating">;

export function createProduct(input: ProductInput): Product {
  const product: Product = {
    ...input,
    id: uid(),
    rating: 0,
    createdAt: Date.now(),
  };
  safeWrite([product, ...safeRead()]);
  return product;
}

export function updateProduct(id: string, patch: Partial<ProductInput>) {
  const items = safeRead().map((p) => (p.id === id ? { ...p, ...patch } : p));
  safeWrite(items);
}

export function deleteProduct(id: string) {
  safeWrite(safeRead().filter((p) => p.id !== id));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<string> {
  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
  const allowedTypes = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ]);
  const ext = allowedTypes.get(file.type);
  if (!ext) throw new Error("Only JPG, PNG, and WebP images are supported.");
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be no larger than 1.5 MB.");
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.slice(0, 8).every((value, index) =>
    value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  const isWebp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if ((ext === "jpg" && !isJpeg) || (ext === "png" && !isPng) || (ext === "webp" && !isWebp)) {
    throw new Error("The uploaded file content does not match its image type.");
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error("Failed to sign URL");
  return data.signedUrl;
}

export function subscribe(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("agrimarket:products-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("agrimarket:products-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export const ALL_LOCATIONS = (): string[] => {
  const set = new Set<string>();
  listProducts().forEach((p) => set.add(p.location));
  return Array.from(set).sort();
};

// --- Farmer Training Academy Schemas & Stores ---
export type TrainingRegistration = {
  id: string;
  courseTitle: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  registeredAt: number;
};

const REGISTRATIONS_KEY = "deacomart.registrations.v1";

export function listRegistrations(): TrainingRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) as TrainingRegistration[] : [];
  } catch {
    return [];
  }
}

export function registerForTraining(reg: Omit<TrainingRegistration, "id" | "registeredAt">): TrainingRegistration {
  const newReg: TrainingRegistration = {
    ...reg,
    id: "reg-" + Math.random().toString(36).slice(2, 10),
    registeredAt: Date.now(),
  };
  const list = listRegistrations();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([newReg, ...list]));
    window.dispatchEvent(new CustomEvent("agrimarket:registrations-changed"));
  }
  return newReg;
}

// --- Consultancy Schemas & Stores ---
export type ConsultancyBooking = {
  id: string;
  serviceTitle: string;
  name: string;
  email: string;
  phone: string;
  scale: string;
  notes: string;
  date: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  bookedAt: number;
};

const BOOKINGS_KEY = "deacomart.bookings.v1";

export function listBookings(): ConsultancyBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) as ConsultancyBooking[] : [];
  } catch {
    return [];
  }
}

export function bookConsultancy(booking: Omit<ConsultancyBooking, "id" | "bookedAt" | "status">): ConsultancyBooking {
  const newBooking: ConsultancyBooking = {
    ...booking,
    id: "book-" + Math.random().toString(36).slice(2, 10),
    status: "Pending",
    bookedAt: Date.now(),
  };
  const list = listBookings();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([newBooking, ...list]));
    window.dispatchEvent(new CustomEvent("agrimarket:bookings-changed"));
  }
  return newBooking;
}

export function updateBookingStatus(id: string, status: ConsultancyBooking["status"]) {
  const list = listBookings().map((b) => (b.id === id ? { ...b, status } : b));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("agrimarket:bookings-changed"));
  }
}

// --- Partnership Schemas & Stores ---
export type PartnershipApplication = {
  id: string;
  organizationName: string;
  partnerType: string;
  contactName: string;
  phone: string;
  email: string;
  details: string;
  appliedAt: number;
};

const PARTNERSHIPS_KEY = "deacomart.partnerships.v1";

export function listPartnerships(): PartnershipApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PARTNERSHIPS_KEY);
    return raw ? JSON.parse(raw) as PartnershipApplication[] : [];
  } catch {
    return [];
  }
}

export function applyForPartnership(app: Omit<PartnershipApplication, "id" | "appliedAt">): PartnershipApplication {
  const newApp: PartnershipApplication = {
    ...app,
    id: "part-" + Math.random().toString(36).slice(2, 10),
    appliedAt: Date.now(),
  };
  const list = listPartnerships();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PARTNERSHIPS_KEY, JSON.stringify([newApp, ...list]));
    window.dispatchEvent(new CustomEvent("agrimarket:partnerships-changed"));
  }
  return newApp;
}
