import heroFarm from "@/assets/hero-farm.jpg";
import produceFlatlay from "@/assets/produce-flatlay.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
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
  image: string; // data URL or imported asset URL
  rating: number;
  createdAt: number;
};

const STORAGE_KEY = "deacomart.products.v2";
const SEEDED_KEY = "deacomart.seeded.v2";
const LEGACY_KEYS = [
  "agrimarket.products.v1",
  "agrimarket.seeded.v1",
  "deacomart.products.v1",
  "deacomart.seeded.v1",
];

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
    image: produceFlatlay,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
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
    image: heroFarm,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
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
    image: farmerPortrait,
    rating: 5.0,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
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
    image: produceFlatlay,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
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
    image: heroFarm,
    rating: 4.6,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
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
    image: farmerPortrait,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 30,
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
    image: produceFlatlay,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
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
    image: heroFarm,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
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
    image: heroFarm,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
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
    image: produceFlatlay,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
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

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  // Purge any legacy localStorage keys so the new catalog always loads cleanly.
  LEGACY_KEYS.forEach((k) => {
    try { window.localStorage.removeItem(k); } catch { /* ignore */ }
  });
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  safeWrite(SEED);
  window.localStorage.setItem(SEEDED_KEY, "1");
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
// 10 years — effectively permanent for marketplace display.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
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