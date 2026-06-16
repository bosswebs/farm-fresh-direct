import heroFarm from "@/assets/hero-farm.jpg";
import produceFlatlay from "@/assets/produce-flatlay.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";

export type Category =
  | "Vegetables"
  | "Fruits"
  | "Grains & Cereals"
  | "Dairy"
  | "Poultry & Eggs"
  | "Herbs & Spices";

export const CATEGORIES: Category[] = [
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Dairy",
  "Poultry & Eggs",
  "Herbs & Spices",
];

export type Unit = "Kg" | "Ton" | "Sack" | "Crate" | "Dozen" | "Piece";
export const UNITS: Unit[] = ["Kg", "Ton", "Sack", "Crate", "Dozen", "Piece"];

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

const STORAGE_KEY = "agrimarket.products.v1";
const SEEDED_KEY = "agrimarket.seeded.v1";

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
    name: "Vine-Ripened Heirloom Tomatoes",
    category: "Vegetables",
    description:
      "Hand-picked heirloom tomatoes grown without pesticides. Rich, sweet, and perfect for sauces or salads.",
    price: 3.5,
    quantity: 120,
    unit: "Kg",
    location: "Nakuru, Kenya",
    farmerName: "Joseph K.",
    farmName: "Green Valley Farm",
    harvestDate: today(-1),
    image: produceFlatlay,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "seed-2",
    name: "Organic Lettuce Heads",
    category: "Vegetables",
    description:
      "Crisp, fresh lettuce harvested this morning. Grown using regenerative practices.",
    price: 1.2,
    quantity: 80,
    unit: "Piece",
    location: "Nairobi, Kenya",
    farmerName: "Amina W.",
    farmName: "Sunrise Greens",
    harvestDate: today(0),
    image: heroFarm,
    rating: 4.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "seed-3",
    name: "Free-Range Eggs",
    category: "Poultry & Eggs",
    description: "Pasture-raised, brown-shell eggs from happy hens.",
    price: 4.0,
    quantity: 40,
    unit: "Dozen",
    location: "Kiambu, Kenya",
    farmerName: "Daniel M.",
    farmName: "Hilltop Poultry",
    harvestDate: today(0),
    image: farmerPortrait,
    rating: 5.0,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "seed-4",
    name: "Sweet Mangoes",
    category: "Fruits",
    description: "Juicy Kent mangoes at peak ripeness. Limited stock.",
    price: 2.2,
    quantity: 60,
    unit: "Kg",
    location: "Mombasa, Kenya",
    farmerName: "Grace O.",
    farmName: "Coastal Orchards",
    harvestDate: today(-2),
    image: produceFlatlay,
    rating: 4.7,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: "seed-5",
    name: "Whole-Grain Maize",
    category: "Grains & Cereals",
    description: "Sun-dried, non-GMO maize. Ideal for flour or animal feed.",
    price: 0.8,
    quantity: 5,
    unit: "Ton",
    location: "Eldoret, Kenya",
    farmerName: "Peter R.",
    farmName: "Highland Grains",
    harvestDate: today(-30),
    image: heroFarm,
    rating: 4.6,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: "seed-6",
    name: "Fresh Cow Milk",
    category: "Dairy",
    description: "Pasteurized whole milk from grass-fed cows. Delivered daily.",
    price: 1.0,
    quantity: 200,
    unit: "Kg",
    location: "Limuru, Kenya",
    farmerName: "Sarah N.",
    farmName: "Meadow Dairy",
    harvestDate: today(0),
    image: farmerPortrait,
    rating: 4.9,
    createdAt: Date.now() - 1000 * 60 * 30,
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
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  if (safeRead().length === 0) safeWrite(SEED);
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