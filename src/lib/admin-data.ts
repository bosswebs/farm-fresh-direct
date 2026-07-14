// Deacomart Admin — Type Definitions & Shared Utilities
// NOTE: All data previously in this file has been migrated to real database queries.
// See src/lib/admin-data.server.ts for the server functions that fetch live data.

// ─── Shared Types ─────────────────────────────────────────────────
export type FarmerStatus = "active" | "pending" | "suspended" | "rejected";
export type OrderStatus = "pending" | "confirmed" | "processing" | "in_transit" | "delivered" | "cancelled";
export type PaymentMethod = "mtn_momo" | "airtel_money" | "bank_transfer" | "card";
export type UserRole =
  | "super_admin"
  | "marketplace_manager"
  | "finance_manager"
  | "training_manager"
  | "consultancy_manager"
  | "logistics_manager"
  | "content_manager"
  | "support_officer";

// ─── Farmer ───────────────────────────────────────────────────────
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  sector: string;
  farmName: string;
  farmSize: string;
  products: string[];
  status: FarmerStatus;
  kycStatus: "verified" | "pending" | "failed";
  registeredDate: string;
  totalSales: number;
  trainingsAttended: number;
  performanceScore: number;
  profileImage?: string;
}

// ─── Buyer ────────────────────────────────────────────────────────
export interface Buyer {
  id: string;
  name: string;
  type: "individual" | "hotel" | "restaurant" | "supermarket" | "institution";
  phone: string;
  email: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinDate: string;
}

// ─── Product ──────────────────────────────────────────────────────
export type ProductStatus = "active" | "pending" | "rejected" | "suspended" | "featured";

export interface Product {
  id: string;
  name: string;
  category: string;
  farmer: string;
  farmerId: string;
  district: string;
  price: number;
  unit: string;
  quantity: number;
  status: ProductStatus;
  qualityStatus: "certified_organic" | "quality_verified" | "food_safety_approved" | "standard";
  listedDate: string;
  sales: number;
  image: string;
}

// ─── Order ────────────────────────────────────────────────────────
export interface Order {
  id: string;
  buyer: string;
  buyerId: string;
  farmer: string;
  product: string;
  quantity: number;
  unit: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  orderDate: string;
  deliveryDate?: string;
  district: string;
}

// ─── Staff ────────────────────────────────────────────────────────
export interface StaffMember {
  id: string;
  name: string;
  role: "trainer" | "consultant" | "driver" | "admin" | "support";
  department: string;
  phone: string;
  email: string;
  district: string;
  status: "active" | "on_leave" | "inactive";
  joinDate: string;
  assignedTasks: number;
  authUserId?: string | null;
  loginRole?: string | null;
}

// ─── Training Course ──────────────────────────────────────────────
export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  trainer: string;
  duration: string;
  sessions: number;
  participants: number;
  completionRate: number;
  nextSession: string;
  district: string;
  status: "active" | "upcoming" | "completed";
}

// ─── Consultancy Request ──────────────────────────────────────────
export interface ConsultancyRequest {
  id: string;
  client: string;
  service: string;
  consultant: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  requestDate: string;
  dueDate: string;
  invoiceAmount: number;
  invoiceStatus: "draft" | "sent" | "paid" | "overdue";
  district: string;
}

// ─── Delivery ─────────────────────────────────────────────────────
export interface Delivery {
  id: string;
  orderId: string;
  buyer: string;
  farmer: string;
  driver: string;
  vehicle: string;
  pickupDistrict: string;
  deliveryDistrict: string;
  status: "scheduled" | "picked_up" | "in_transit" | "delivered" | "failed";
  scheduledDate: string;
  actualDelivery?: string;
  distance: string;
}

// ─── Partner ──────────────────────────────────────────────────────
export interface Partner {
  id: string;
  name: string;
  type: "hotel" | "supermarket" | "cooperative" | "ngo" | "government";
  district: string;
  contactPerson: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  since: string;
  totalOrders: number;
  totalValue: number;
}

// ─── Rwanda Geographic Provinces (structural, not data) ───────────
export const rwandaProvinces = [
  {
    name: "Kigali City",
    farmers: 0, // populated at runtime from DB
    districts: ["Gasabo", "Kicukiro", "Nyarugenge"],
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Northern Province",
    farmers: 0,
    districts: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
    color: "from-teal-500 to-teal-700",
  },
  {
    name: "Southern Province",
    farmers: 0,
    districts: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Eastern Province",
    farmers: 0,
    districts: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
    color: "from-violet-500 to-violet-700",
  },
  {
    name: "Western Province",
    farmers: 0,
    districts: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"],
    color: "from-orange-500 to-orange-700",
  },
];

// ─── Utilities ────────────────────────────────────────────────────

/**
 * Format a number as Rwandan Francs (RWF).
 * e.g. 1_500_000 → "RWF 1.5M"
 */
export function formatRWF(amount: number): string {
  if (amount === 0) return "RWF 0";
  if (Math.abs(amount) >= 1_000_000) {
    return `RWF ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `RWF ${(amount / 1_000).toFixed(0)}K`;
  }
  return `RWF ${amount.toLocaleString()}`;
}

/**
 * Return a Tailwind CSS class string for a given status string.
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    featured: "text-teal-700 bg-teal-50 border-teal-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    confirmed: "text-teal-700 bg-teal-50 border-teal-200",
    processing: "text-purple-700 bg-purple-50 border-purple-200",
    in_transit: "text-blue-700 bg-blue-50 border-blue-200",
    in_progress: "text-blue-700 bg-blue-50 border-blue-200",
    delivered: "text-emerald-700 bg-emerald-50 border-emerald-200",
    completed: "text-emerald-700 bg-emerald-50 border-emerald-200",
    suspended: "text-orange-700 bg-orange-50 border-orange-200",
    on_leave: "text-orange-700 bg-orange-50 border-orange-200",
    rejected: "text-red-700 bg-red-50 border-red-200",
    failed: "text-red-700 bg-red-50 border-red-200",
    cancelled: "text-red-700 bg-red-50 border-red-200",
    inactive: "text-gray-600 bg-gray-50 border-gray-200",
    paid: "text-emerald-700 bg-emerald-50 border-emerald-200",
    refunded: "text-rose-700 bg-rose-50 border-rose-200",
    draft: "text-gray-600 bg-gray-50 border-gray-200",
    sent: "text-blue-700 bg-blue-50 border-blue-200",
    overdue: "text-red-700 bg-red-50 border-red-200",
    scheduled: "text-indigo-700 bg-indigo-50 border-indigo-200",
    picked_up: "text-blue-700 bg-blue-50 border-blue-200",
    upcoming: "text-violet-700 bg-violet-50 border-violet-200",
    verified: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };
  return map[status] ?? "text-gray-600 bg-gray-50 border-gray-200";
}
