// Deacomart Admin Mock Data — Realistic Rwanda Agribusiness Data

export type FarmerStatus = "active" | "pending" | "suspended" | "rejected";
export type OrderStatus = "pending" | "confirmed" | "processing" | "in_transit" | "delivered" | "cancelled";
export type PaymentMethod = "mtn_momo" | "airtel_money" | "bank_transfer" | "card";
export type UserRole = "super_admin" | "marketplace_manager" | "finance_manager" | "training_manager" | "consultancy_manager" | "logistics_manager" | "content_manager" | "support_officer";

// ─── KPI Stats ───────────────────────────────────────────────────
export const adminStats = {
  totalFarmers: 4_872,
  totalBuyers: 12_540,
  activeProducts: 3_218,
  ordersToday: 247,
  monthlyRevenue: 68_450_000, // RWF
  districtsCovered: 30,
  farmersTrained: 2_134,
  consultancyRequests: 89,
  activePartnerships: 43,
  deliveryPerformance: 94.2, // %
  customerSatisfaction: 4.6, // out of 5
  pendingApprovals: 38,
};

// ─── Revenue Analytics ────────────────────────────────────────────
export const revenueData = [
  { month: "Jan", revenue: 42_000_000, orders: 1820, farmers: 3200 },
  { month: "Feb", revenue: 48_500_000, orders: 2100, farmers: 3450 },
  { month: "Mar", revenue: 55_200_000, orders: 2380, farmers: 3700 },
  { month: "Apr", revenue: 51_800_000, orders: 2250, farmers: 3900 },
  { month: "May", revenue: 62_100_000, orders: 2700, farmers: 4200 },
  { month: "Jun", revenue: 68_450_000, orders: 2950, farmers: 4872 },
];

export const categoryPerformance = [
  { category: "Vegetables", sales: 28_400_000, products: 842, growth: 12 },
  { category: "Fruits", sales: 18_200_000, products: 560, growth: 8 },
  { category: "Cereals & Grains", sales: 14_600_000, products: 320, growth: 15 },
  { category: "Dairy & Eggs", sales: 9_800_000, products: 180, growth: 22 },
  { category: "Beverages", sales: 7_200_000, products: 145, growth: 30 },
  { category: "Honey & Natural", sales: 5_100_000, products: 98, growth: 18 },
  { category: "Organic Foods", sales: 4_300_000, products: 73, growth: 25 },
];

export const impactMetrics = [
  { month: "Jan", farmersReached: 3200, trained: 180, revenue: 42_000_000, loss_reduction: 12 },
  { month: "Feb", farmersReached: 3450, trained: 220, revenue: 48_500_000, loss_reduction: 14 },
  { month: "Mar", farmersReached: 3700, trained: 310, revenue: 55_200_000, loss_reduction: 16 },
  { month: "Apr", farmersReached: 3900, trained: 280, revenue: 51_800_000, loss_reduction: 15 },
  { month: "May", farmersReached: 4200, trained: 380, revenue: 62_100_000, loss_reduction: 18 },
  { month: "Jun", farmersReached: 4872, trained: 420, revenue: 68_450_000, loss_reduction: 21 },
];

// ─── Farmers ──────────────────────────────────────────────────────
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

export const farmers: Farmer[] = [
  { id: "F001", name: "Uwimana Marie", phone: "+250 788 123 456", email: "marie.uwimana@gmail.com", district: "Burera", sector: "Cyanika", farmName: "EcoFarm Burera", farmSize: "2.5 ha", products: ["Tomatoes", "Onions", "Carrots"], status: "active", kycStatus: "verified", registeredDate: "2024-01-15", totalSales: 4_200_000, trainingsAttended: 5, performanceScore: 92 },
  { id: "F002", name: "Nkurunziza Jean", phone: "+250 722 234 567", email: "jean.nk@gmail.com", district: "Musanze", sector: "Kinigi", farmName: "Kinigi Green Farm", farmSize: "1.8 ha", products: ["Potatoes", "Beans", "Cabbage"], status: "active", kycStatus: "verified", registeredDate: "2024-02-03", totalSales: 3_150_000, trainingsAttended: 3, performanceScore: 85 },
  { id: "F003", name: "Mukamana Solange", phone: "+250 733 345 678", email: "solange.m@yahoo.com", district: "Nyagatare", sector: "Karama", farmName: "Nyagatare Fields", farmSize: "4.2 ha", products: ["Maize", "Sorghum", "Sunflower"], status: "active", kycStatus: "verified", registeredDate: "2024-01-28", totalSales: 6_800_000, trainingsAttended: 7, performanceScore: 96 },
  { id: "F004", name: "Habimana Eric", phone: "+250 780 456 789", email: "eric.hab@gmail.com", district: "Rwamagana", sector: "Munyaga", farmName: "East Valley Farm", farmSize: "3.0 ha", products: ["Sweet Potatoes", "Cassava"], status: "pending", kycStatus: "pending", registeredDate: "2024-06-10", totalSales: 0, trainingsAttended: 1, performanceScore: 0 },
  { id: "F005", name: "Mukandayisenga Rose", phone: "+250 788 567 890", email: "rose.mk@gmail.com", district: "Rulindo", sector: "Base", farmName: "Highland Rose Farm", farmSize: "1.5 ha", products: ["Strawberries", "Passion Fruit", "Avocado"], status: "active", kycStatus: "verified", registeredDate: "2024-03-20", totalSales: 5_400_000, trainingsAttended: 4, performanceScore: 90 },
  { id: "F006", name: "Ntwari Samuel", phone: "+250 722 678 901", email: "sam.ntwari@gmail.com", district: "Gakenke", sector: "Coko", farmName: "Gakenke Organics", farmSize: "2.0 ha", products: ["Coffee", "Banana", "Ginger"], status: "suspended", kycStatus: "failed", registeredDate: "2024-04-05", totalSales: 1_200_000, trainingsAttended: 2, performanceScore: 45 },
  { id: "F007", name: "Uwase Claudine", phone: "+250 733 789 012", email: "claudine.u@gmail.com", district: "Huye", sector: "Mbazi", farmName: "Southern Star Farm", farmSize: "3.5 ha", products: ["Coffee", "Tea", "Banana"], status: "active", kycStatus: "verified", registeredDate: "2024-02-14", totalSales: 7_200_000, trainingsAttended: 8, performanceScore: 98 },
  { id: "F008", name: "Ndayisaba Pierre", phone: "+250 780 890 123", email: "pierre.nd@gmail.com", district: "Kayonza", sector: "Mukarange", farmName: "Kayonza Sunrise Farm", farmSize: "2.8 ha", products: ["Mango", "Pineapple", "Passion Fruit"], status: "active", kycStatus: "verified", registeredDate: "2024-01-09", totalSales: 4_900_000, trainingsAttended: 6, performanceScore: 88 },
  { id: "F009", name: "Bizimana Théoneste", phone: "+250 788 901 234", email: "theo.biz@gmail.com", district: "Gicumbi", sector: "Mutete", farmName: "Northern Plains Farm", farmSize: "5.0 ha", products: ["Wheat", "Barley", "Potato"], status: "pending", kycStatus: "pending", registeredDate: "2024-06-12", totalSales: 0, trainingsAttended: 0, performanceScore: 0 },
  { id: "F010", name: "Kagabo Vestine", phone: "+250 722 012 345", email: "vestine.k@gmail.com", district: "Kirehe", sector: "Mpanga", farmName: "Eastern Hope Farm", farmSize: "2.1 ha", products: ["Rice", "Fish", "Beans"], status: "active", kycStatus: "verified", registeredDate: "2024-03-01", totalSales: 3_800_000, trainingsAttended: 4, performanceScore: 82 },
];

// ─── Buyers ───────────────────────────────────────────────────────
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

export const buyers: Buyer[] = [
  { id: "B001", name: "Kigali Serena Hotel", type: "hotel", phone: "+250 252 597 100", email: "procurement@serena.rw", district: "Kigali", totalOrders: 142, totalSpent: 18_500_000, status: "active", joinDate: "2024-01-10" },
  { id: "B002", name: "Nakumatt Rwanda", type: "supermarket", phone: "+250 788 200 000", email: "orders@nakumatt.rw", district: "Kigali", totalOrders: 320, totalSpent: 42_000_000, status: "active", joinDate: "2024-01-05" },
  { id: "B003", name: "University of Rwanda", type: "institution", phone: "+250 252 530 190", email: "catering@ur.ac.rw", district: "Kigali", totalOrders: 89, totalSpent: 12_300_000, status: "active", joinDate: "2024-02-20" },
  { id: "B004", name: "Mukarukundo Gisèle", type: "individual", phone: "+250 788 441 223", email: "gisele.m@gmail.com", district: "Gasabo", totalOrders: 24, totalSpent: 420_000, status: "active", joinDate: "2024-04-12" },
  { id: "B005", name: "Meze Fresh Restaurant", type: "restaurant", phone: "+250 722 550 880", email: "kitchen@mezefresh.rw", district: "Kigali", totalOrders: 210, totalSpent: 8_900_000, status: "active", joinDate: "2024-03-01" },
  { id: "B006", name: "Rubavu Palace Hotel", type: "hotel", phone: "+250 788 620 100", email: "food@rubavupalace.rw", district: "Rubavu", totalOrders: 67, totalSpent: 5_200_000, status: "active", joinDate: "2024-03-15" },
  { id: "B007", name: "Rwanda Broadcasting Agency", type: "institution", phone: "+250 252 582 000", email: "admin@rba.rw", district: "Kigali", totalOrders: 32, totalSpent: 1_800_000, status: "inactive", joinDate: "2024-02-08" },
  { id: "B008", name: "Ndagijimana Alexis", type: "individual", phone: "+250 733 882 214", email: "alexis.nd@gmail.com", district: "Nyarugenge", totalOrders: 15, totalSpent: 280_000, status: "active", joinDate: "2024-05-20" },
];

// ─── Products ─────────────────────────────────────────────────────
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

export const products: Product[] = [
  { id: "P001", name: "Fresh Tomatoes", category: "Vegetables", farmer: "Uwimana Marie", farmerId: "F001", district: "Burera", price: 800, unit: "kg", quantity: 500, status: "featured", qualityStatus: "certified_organic", listedDate: "2024-05-01", sales: 2840, image: "🍅" },
  { id: "P002", name: "Irish Potatoes", category: "Vegetables", farmer: "Nkurunziza Jean", farmerId: "F002", district: "Musanze", price: 400, unit: "kg", quantity: 1200, status: "active", qualityStatus: "quality_verified", listedDate: "2024-04-15", sales: 4200, image: "🥔" },
  { id: "P003", name: "Yellow Maize", category: "Cereals & Grains", farmer: "Mukamana Solange", farmerId: "F003", district: "Nyagatare", price: 350, unit: "kg", quantity: 3000, status: "active", qualityStatus: "food_safety_approved", listedDate: "2024-03-20", sales: 8900, image: "🌽" },
  { id: "P004", name: "Passion Fruit", category: "Fruits", farmer: "Mukandayisenga Rose", farmerId: "F005", district: "Rulindo", price: 1200, unit: "kg", quantity: 300, status: "featured", qualityStatus: "certified_organic", listedDate: "2024-04-28", sales: 1650, image: "🌿" },
  { id: "P005", name: "Arabica Coffee (Raw)", category: "Beverages", farmer: "Uwase Claudine", farmerId: "F007", district: "Huye", price: 4500, unit: "kg", quantity: 200, status: "active", qualityStatus: "certified_organic", listedDate: "2024-02-10", sales: 890, image: "☕" },
  { id: "P006", name: "Green Bananas", category: "Fruits", farmer: "Ntwari Samuel", farmerId: "F006", district: "Gakenke", price: 300, unit: "bunch", quantity: 800, status: "suspended", qualityStatus: "standard", listedDate: "2024-05-10", sales: 340, image: "🍌" },
  { id: "P007", name: "Fresh Eggs (Tray)", category: "Dairy & Eggs", farmer: "Kagabo Vestine", farmerId: "F010", district: "Kirehe", price: 3500, unit: "tray", quantity: 150, status: "active", qualityStatus: "food_safety_approved", listedDate: "2024-06-01", sales: 620, image: "🥚" },
  { id: "P008", name: "Sweet Cassava", category: "Vegetables", farmer: "Habimana Eric", farmerId: "F004", district: "Rwamagana", price: 250, unit: "kg", quantity: 2000, status: "pending", qualityStatus: "standard", listedDate: "2024-06-12", sales: 0, image: "🌱" },
  { id: "P009", name: "Mango (Alphonso)", category: "Fruits", farmer: "Ndayisaba Pierre", farmerId: "F008", district: "Kayonza", price: 600, unit: "kg", quantity: 450, status: "active", qualityStatus: "quality_verified", listedDate: "2024-04-05", sales: 2100, image: "🥭" },
  { id: "P010", name: "Ginger Root", category: "Natural Health Products", farmer: "Ntwari Samuel", farmerId: "F006", district: "Gakenke", price: 2000, unit: "kg", quantity: 100, status: "pending", qualityStatus: "certified_organic", listedDate: "2024-06-13", sales: 0, image: "🫚" },
];

// ─── Orders ───────────────────────────────────────────────────────
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

export const orders: Order[] = [
  { id: "ORD-2024-001", buyer: "Kigali Serena Hotel", buyerId: "B001", farmer: "Uwimana Marie", product: "Fresh Tomatoes", quantity: 200, unit: "kg", total: 160_000, status: "delivered", paymentMethod: "bank_transfer", paymentStatus: "paid", orderDate: "2024-06-10", deliveryDate: "2024-06-12", district: "Kigali" },
  { id: "ORD-2024-002", buyer: "Nakumatt Rwanda", buyerId: "B002", farmer: "Nkurunziza Jean", product: "Irish Potatoes", quantity: 500, unit: "kg", total: 200_000, status: "in_transit", paymentMethod: "mtn_momo", paymentStatus: "paid", orderDate: "2024-06-15", district: "Kigali" },
  { id: "ORD-2024-003", buyer: "Meze Fresh Restaurant", buyerId: "B005", farmer: "Mukandayisenga Rose", product: "Passion Fruit", quantity: 50, unit: "kg", total: 60_000, status: "processing", paymentMethod: "airtel_money", paymentStatus: "paid", orderDate: "2024-06-17", district: "Kigali" },
  { id: "ORD-2024-004", buyer: "Mukarukundo Gisèle", buyerId: "B004", farmer: "Ndayisaba Pierre", product: "Mango (Alphonso)", quantity: 10, unit: "kg", total: 6_000, status: "pending", paymentMethod: "mtn_momo", paymentStatus: "pending", orderDate: "2024-06-18", district: "Gasabo" },
  { id: "ORD-2024-005", buyer: "University of Rwanda", buyerId: "B003", farmer: "Mukamana Solange", product: "Yellow Maize", quantity: 1000, unit: "kg", total: 350_000, status: "confirmed", paymentMethod: "bank_transfer", paymentStatus: "paid", orderDate: "2024-06-14", district: "Kigali" },
  { id: "ORD-2024-006", buyer: "Rubavu Palace Hotel", buyerId: "B006", farmer: "Uwase Claudine", product: "Arabica Coffee (Raw)", quantity: 30, unit: "kg", total: 135_000, status: "delivered", paymentMethod: "card", paymentStatus: "paid", orderDate: "2024-06-08", deliveryDate: "2024-06-10", district: "Rubavu" },
  { id: "ORD-2024-007", buyer: "Ndagijimana Alexis", buyerId: "B008", farmer: "Kagabo Vestine", product: "Fresh Eggs (Tray)", quantity: 5, unit: "tray", total: 17_500, status: "cancelled", paymentMethod: "mtn_momo", paymentStatus: "refunded", orderDate: "2024-06-16", district: "Nyarugenge" },
  { id: "ORD-2024-008", buyer: "Nakumatt Rwanda", buyerId: "B002", farmer: "Uwimana Marie", product: "Fresh Tomatoes", quantity: 300, unit: "kg", total: 240_000, status: "in_transit", paymentMethod: "bank_transfer", paymentStatus: "paid", orderDate: "2024-06-17", district: "Kigali" },
];

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
}

export const staff: StaffMember[] = [
  { id: "S001", name: "Dr. Kayitesi Ange", role: "trainer", department: "Training Academy", phone: "+250 788 100 200", email: "ange.k@deacomart.rw", district: "Kigali", status: "active", joinDate: "2023-08-01", assignedTasks: 12 },
  { id: "S002", name: "Ir. Habonimana Claude", role: "consultant", department: "Consultancy", phone: "+250 722 100 300", email: "claude.h@deacomart.rw", district: "Kigali", status: "active", joinDate: "2023-09-15", assignedTasks: 8 },
  { id: "S003", name: "Nzabonimpa Jean-Paul", role: "driver", department: "Logistics", phone: "+250 733 400 500", email: "jp.n@deacomart.rw", district: "Kigali", status: "active", joinDate: "2024-01-10", assignedTasks: 6 },
  { id: "S004", name: "Mukeshimana Diane", role: "admin", department: "Administration", phone: "+250 788 200 300", email: "diane.m@deacomart.rw", district: "Kigali", status: "active", joinDate: "2023-07-01", assignedTasks: 24 },
  { id: "S005", name: "Irakoze Benjamin", role: "trainer", department: "Training Academy", phone: "+250 722 300 400", email: "ben.i@deacomart.rw", district: "Musanze", status: "active", joinDate: "2023-10-20", assignedTasks: 9 },
  { id: "S006", name: "Uwingabire Sandrine", role: "support", department: "Customer Support", phone: "+250 733 500 600", email: "sandrine.u@deacomart.rw", district: "Kigali", status: "on_leave", joinDate: "2024-02-01", assignedTasks: 0 },
  { id: "S007", name: "Ntirampeba Victor", role: "driver", department: "Logistics", phone: "+250 780 600 700", email: "victor.n@deacomart.rw", district: "Huye", status: "active", joinDate: "2024-03-15", assignedTasks: 4 },
];

// ─── Training ─────────────────────────────────────────────────────
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

export const trainingCourses: TrainingCourse[] = [
  { id: "TC001", title: "Modern Agriculture Techniques", category: "Modern Agriculture", trainer: "Dr. Kayitesi Ange", duration: "5 days", sessions: 8, participants: 120, completionRate: 87, nextSession: "2024-07-01", district: "Kigali", status: "active" },
  { id: "TC002", title: "Hinga Ugwize Program", category: "Hinga Ugwize", trainer: "Irakoze Benjamin", duration: "3 days", sessions: 12, participants: 200, completionRate: 92, nextSession: "2024-06-25", district: "Musanze", status: "active" },
  { id: "TC003", title: "Post-Harvest Loss Management", category: "Post-Harvest Management", trainer: "Dr. Kayitesi Ange", duration: "2 days", sessions: 6, participants: 85, completionRate: 95, nextSession: "2024-07-10", district: "Nyagatare", status: "upcoming" },
  { id: "TC004", title: "Financial Literacy for Farmers", category: "Financial Literacy", trainer: "Irakoze Benjamin", duration: "2 days", sessions: 10, participants: 160, completionRate: 78, nextSession: "2024-06-28", district: "Huye", status: "active" },
  { id: "TC005", title: "Food Safety & Quality Standards", category: "Food Safety", trainer: "Dr. Kayitesi Ange", duration: "3 days", sessions: 5, participants: 70, completionRate: 100, nextSession: "Completed", district: "Kigali", status: "completed" },
  { id: "TC006", title: "Value Addition & Processing", category: "Value Addition", trainer: "Ir. Habonimana Claude", duration: "4 days", sessions: 4, participants: 55, completionRate: 65, nextSession: "2024-07-15", district: "Rulindo", status: "upcoming" },
  { id: "TC007", title: "Agribusiness Entrepreneurship", category: "Agribusiness Development", trainer: "Ir. Habonimana Claude", duration: "5 days", sessions: 3, participants: 40, completionRate: 50, nextSession: "2024-07-20", district: "Rwamagana", status: "upcoming" },
];

// ─── Consultancy ──────────────────────────────────────────────────
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

export const consultancyRequests: ConsultancyRequest[] = [
  { id: "C001", client: "Rwanda Farmers Coop Ltd", service: "Agribusiness Strategy", consultant: "Ir. Habonimana Claude", status: "in_progress", priority: "high", requestDate: "2024-06-01", dueDate: "2024-07-15", invoiceAmount: 3_500_000, invoiceStatus: "sent", district: "Kigali" },
  { id: "C002", client: "Ministry of Agriculture", service: "Agricultural Project Design", consultant: "Ir. Habonimana Claude", status: "in_progress", priority: "high", requestDate: "2024-05-15", dueDate: "2024-08-30", invoiceAmount: 8_000_000, invoiceStatus: "paid", district: "Kigali" },
  { id: "C003", client: "Musanze Agro-Processing Ltd", service: "Food Safety Audits", consultant: "Dr. Kayitesi Ange", status: "completed", priority: "medium", requestDate: "2024-04-10", dueDate: "2024-06-10", invoiceAmount: 1_200_000, invoiceStatus: "paid", district: "Musanze" },
  { id: "C004", client: "Kagera Tea SACCO", service: "Market Access Advisory", consultant: "Ir. Habonimana Claude", status: "pending", priority: "medium", requestDate: "2024-06-12", dueDate: "2024-07-30", invoiceAmount: 2_000_000, invoiceStatus: "draft", district: "Nyamagabe" },
  { id: "C005", client: "EastAfrica Seeds Ltd", service: "Digital Transformation Services", consultant: "Dr. Kayitesi Ange", status: "pending", priority: "low", requestDate: "2024-06-14", dueDate: "2024-08-01", invoiceAmount: 4_500_000, invoiceStatus: "draft", district: "Kigali" },
];

// ─── Logistics ────────────────────────────────────────────────────
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

export const deliveries: Delivery[] = [
  { id: "DEL001", orderId: "ORD-2024-001", buyer: "Kigali Serena Hotel", farmer: "Uwimana Marie", driver: "Nzabonimpa Jean-Paul", vehicle: "RAB 483 A", pickupDistrict: "Burera", deliveryDistrict: "Kigali", status: "delivered", scheduledDate: "2024-06-12", actualDelivery: "2024-06-12", distance: "158 km" },
  { id: "DEL002", orderId: "ORD-2024-002", buyer: "Nakumatt Rwanda", farmer: "Nkurunziza Jean", driver: "Nzabonimpa Jean-Paul", vehicle: "RAB 483 A", pickupDistrict: "Musanze", deliveryDistrict: "Kigali", status: "in_transit", scheduledDate: "2024-06-18", distance: "112 km" },
  { id: "DEL003", orderId: "ORD-2024-005", buyer: "University of Rwanda", farmer: "Mukamana Solange", driver: "Ntirampeba Victor", vehicle: "RBC 721 B", pickupDistrict: "Nyagatare", deliveryDistrict: "Kigali", status: "scheduled", scheduledDate: "2024-06-19", distance: "185 km" },
  { id: "DEL004", orderId: "ORD-2024-006", buyer: "Rubavu Palace Hotel", farmer: "Uwase Claudine", driver: "Ntirampeba Victor", vehicle: "RBC 721 B", pickupDistrict: "Huye", deliveryDistrict: "Rubavu", status: "delivered", scheduledDate: "2024-06-10", actualDelivery: "2024-06-10", distance: "220 km" },
  { id: "DEL005", orderId: "ORD-2024-003", buyer: "Meze Fresh Restaurant", farmer: "Mukandayisenga Rose", driver: "Nzabonimpa Jean-Paul", vehicle: "RAB 483 A", pickupDistrict: "Rulindo", deliveryDistrict: "Kigali", status: "picked_up", scheduledDate: "2024-06-18", distance: "48 km" },
];

export const vehicles = [
  { id: "V001", plate: "RAB 483 A", type: "Pickup Truck", driver: "Nzabonimpa Jean-Paul", capacity: "1000 kg", status: "active", lastMaintenance: "2024-05-15" },
  { id: "V002", plate: "RBC 721 B", type: "Box Truck", driver: "Ntirampeba Victor", capacity: "3000 kg", status: "active", lastMaintenance: "2024-06-01" },
  { id: "V003", plate: "RAD 902 C", type: "Motorcycle", driver: "Unassigned", capacity: "100 kg", status: "maintenance", lastMaintenance: "2024-06-10" },
];

// ─── Partnerships ─────────────────────────────────────────────────
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

export const partners: Partner[] = [
  { id: "PT001", name: "Kigali Serena Hotel", type: "hotel", district: "Kigali", contactPerson: "Emmanuel Habimana", phone: "+250 252 597 100", status: "active", since: "2024-01-10", totalOrders: 142, totalValue: 18_500_000 },
  { id: "PT002", name: "Nakumatt Rwanda", type: "supermarket", district: "Kigali", contactPerson: "Grace Uwimana", phone: "+250 788 200 000", status: "active", since: "2024-01-05", totalOrders: 320, totalValue: 42_000_000 },
  { id: "PT003", name: "Imidugudu Cooperative Musanze", type: "cooperative", district: "Musanze", contactPerson: "Théoneste Nkurunziza", phone: "+250 788 330 100", status: "active", since: "2024-02-15", totalOrders: 78, totalValue: 8_200_000 },
  { id: "PT004", name: "USAID Rwanda Feed the Future", type: "ngo", district: "Kigali", contactPerson: "Sarah Mitchell", phone: "+250 788 440 500", status: "active", since: "2024-03-01", totalOrders: 0, totalValue: 0 },
  { id: "PT005", name: "Rwanda Agriculture Board (RAB)", type: "government", district: "Kigali", contactPerson: "Ir. Janvier Ndayambaje", phone: "+250 252 582 628", status: "active", since: "2024-01-20", totalOrders: 0, totalValue: 0 },
  { id: "PT006", name: "Rubavu Palace Hotel", type: "hotel", district: "Rubavu", contactPerson: "Celestin Ntwari", phone: "+250 788 620 100", status: "active", since: "2024-03-15", totalOrders: 67, totalValue: 5_200_000 },
  { id: "PT007", name: "Inyange Industries", type: "cooperative", district: "Kigali", contactPerson: "Christine Mukamana", phone: "+250 788 500 200", status: "pending", since: "2024-06-10", totalOrders: 0, totalValue: 0 },
];

// ─── Food & Beverage ──────────────────────────────────────────────
export const fnbCategories = [
  {
    name: "Juices",
    icon: "🥤",
    products: [
      { name: "Passion Fruit Juice (1L)", price: 2_500, stock: 480, sold: 1200, status: "active" },
      { name: "Mango Juice (500ml)", price: 1_800, stock: 320, sold: 890, status: "active" },
      { name: "Pineapple Juice (1L)", price: 2_200, stock: 200, sold: 650, status: "active" },
      { name: "Mixed Tropical Juice (1L)", price: 2_800, stock: 150, sold: 420, status: "low_stock" },
    ],
  },
  {
    name: "Tea Products",
    icon: "🍵",
    products: [
      { name: "Rwanda Black Tea (100g)", price: 3_500, stock: 600, sold: 2100, status: "active" },
      { name: "Green Tea Premium (50g)", price: 4_200, stock: 350, sold: 980, status: "active" },
      { name: "Hibiscus Tea (100g)", price: 3_800, stock: 280, sold: 760, status: "active" },
      { name: "Ginger Tea (100g)", price: 4_000, stock: 50, sold: 890, status: "low_stock" },
    ],
  },
  {
    name: "Honey & Natural",
    icon: "🍯",
    products: [
      { name: "Raw Forest Honey (500g)", price: 8_500, stock: 200, sold: 680, status: "active" },
      { name: "Organic Honey (1kg)", price: 15_000, stock: 120, sold: 340, status: "active" },
      { name: "Comb Honey (400g)", price: 12_000, stock: 80, sold: 210, status: "active" },
      { name: "Flavored Honey - Ginger (250g)", price: 9_500, stock: 0, sold: 450, status: "out_of_stock" },
    ],
  },
  {
    name: "Organic Products",
    icon: "🌿",
    products: [
      { name: "Organic Sesame Seeds (1kg)", price: 5_500, stock: 180, sold: 320, status: "active" },
      { name: "Avocado Oil (250ml)", price: 12_000, stock: 90, sold: 180, status: "active" },
      { name: "Organic Moringa Powder (200g)", price: 6_000, stock: 150, sold: 280, status: "active" },
    ],
  },
  {
    name: "Eggs",
    icon: "🥚",
    products: [
      { name: "Free-Range Eggs (Tray/30)", price: 4_500, stock: 300, sold: 1800, status: "active" },
      { name: "Organic Eggs (Tray/30)", price: 5_500, stock: 100, sold: 620, status: "active" },
      { name: "Duck Eggs (Tray/12)", price: 3_800, stock: 0, sold: 210, status: "out_of_stock" },
    ],
  },
  {
    name: "Grocery",
    icon: "🛒",
    products: [
      { name: "Salsa Sauce (400g)", price: 3_200, stock: 250, sold: 780, status: "active" },
      { name: "Dried Beans - Umuceri (2kg)", price: 2_800, stock: 500, sold: 1200, status: "active" },
      { name: "Organic Rice (5kg)", price: 8_000, stock: 180, sold: 450, status: "active" },
      { name: "Groundnut Butter (500g)", price: 5_000, stock: 120, sold: 380, status: "active" },
    ],
  },
];

// ─── WhatsApp Commerce ────────────────────────────────────────────
export const whatsappOrders = [
  { id: "WA001", customer: "Karenzi Apollinaire", phone: "+250 788 111 222", product: "Fresh Tomatoes 20kg", amount: 16_000, status: "confirmed", date: "2024-06-18 09:15" },
  { id: "WA002", customer: "Uwamahoro Joyce", phone: "+250 722 333 444", product: "Rwanda Black Tea x3", amount: 10_500, status: "pending", date: "2024-06-18 10:30" },
  { id: "WA003", customer: "Bizumuremyi David", phone: "+250 733 555 666", product: "Organic Honey 500g x2", amount: 17_000, status: "delivered", date: "2024-06-17 14:22" },
  { id: "WA004", customer: "Mukamuganga Alice", phone: "+250 780 777 888", product: "Free-Range Eggs 2 Trays", amount: 9_000, status: "confirmed", date: "2024-06-18 11:45" },
];

// ─── Rwanda Districts ─────────────────────────────────────────────
export const rwandaProvinces = [
  {
    name: "Kigali City",
    districts: ["Gasabo", "Kicukiro", "Nyarugenge"],
    farmers: 620,
    covered: true,
  },
  {
    name: "Northern Province",
    districts: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
    farmers: 1240,
    covered: true,
  },
  {
    name: "Southern Province",
    districts: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
    farmers: 1180,
    covered: true,
  },
  {
    name: "Eastern Province",
    districts: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
    farmers: 1050,
    covered: true,
  },
  {
    name: "Western Province",
    districts: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"],
    farmers: 782,
    covered: true,
  },
];

// ─── Content ──────────────────────────────────────────────────────
export const contentPages = [
  { id: "PG001", title: "Home", type: "page", status: "published", lastUpdated: "2024-06-15", author: "Mukeshimana Diane" },
  { id: "PG002", title: "About Deacomart", type: "page", status: "published", lastUpdated: "2024-06-10", author: "Mukeshimana Diane" },
  { id: "PG003", title: "Marketplace Overview", type: "page", status: "published", lastUpdated: "2024-06-12", author: "Mukeshimana Diane" },
  { id: "BL001", title: "5 Ways to Reduce Post-Harvest Losses", type: "blog", status: "published", lastUpdated: "2024-06-14", author: "Dr. Kayitesi Ange" },
  { id: "BL002", title: "Hinga Ugwize: What You Need to Know", type: "blog", status: "draft", lastUpdated: "2024-06-17", author: "Irakoze Benjamin" },
  { id: "NW001", title: "Deacomart Partners with RAB for National Rollout", type: "news", status: "published", lastUpdated: "2024-06-16", author: "Mukeshimana Diane" },
  { id: "EV001", title: "Farmer Training Day - Musanze", type: "event", status: "upcoming", lastUpdated: "2024-06-15", author: "Dr. Kayitesi Ange" },
  { id: "TM001", title: "This platform helped me triple my income — Uwimana Marie", type: "testimonial", status: "published", lastUpdated: "2024-06-13", author: "Mukeshimana Diane" },
];

// ─── Activity Feed ────────────────────────────────────────────────
export const activityFeed = [
  { id: 1, type: "farmer_registered", message: "New farmer registered: Bizimana Théoneste from Gicumbi", time: "2 minutes ago", icon: "user-plus" },
  { id: 2, type: "order_placed", message: "New order ORD-2024-009 placed by Meze Fresh Restaurant", time: "8 minutes ago", icon: "shopping-cart" },
  { id: 3, type: "product_approved", message: "Product 'Fresh Tomatoes' by Uwimana Marie approved", time: "15 minutes ago", icon: "check-circle" },
  { id: 4, type: "training_enrolled", message: "25 farmers enrolled in Hinga Ugwize Program", time: "32 minutes ago", icon: "graduation-cap" },
  { id: 5, type: "payment_received", message: "Payment of RWF 200,000 received from Nakumatt Rwanda", time: "1 hour ago", icon: "dollar-sign" },
  { id: 6, type: "delivery_completed", message: "Delivery DEL001 completed to Kigali Serena Hotel", time: "2 hours ago", icon: "truck" },
  { id: 7, type: "consultancy_request", message: "New consultancy request from Rwanda Farmers Coop Ltd", time: "3 hours ago", icon: "briefcase" },
  { id: 8, type: "partner_joined", message: "Inyange Industries submitted partnership request", time: "5 hours ago", icon: "handshake" },
];

// ─── Utility Formatters ───────────────────────────────────────────
export function formatRWF(amount: number): string {
  if (amount >= 1_000_000) return `RWF ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `RWF ${(amount / 1_000).toFixed(0)}K`;
  return `RWF ${amount.toLocaleString()}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    suspended: "text-red-700 bg-red-50 border-red-200",
    rejected: "text-red-700 bg-red-50 border-red-200",
    cancelled: "text-red-700 bg-red-50 border-red-200",
    delivered: "text-emerald-700 bg-emerald-50 border-emerald-200",
    in_transit: "text-blue-700 bg-blue-50 border-blue-200",
    processing: "text-purple-700 bg-purple-50 border-purple-200",
    confirmed: "text-teal-700 bg-teal-50 border-teal-200",
    featured: "text-indigo-700 bg-indigo-50 border-indigo-200",
    paid: "text-emerald-700 bg-emerald-50 border-emerald-200",
    overdue: "text-red-700 bg-red-50 border-red-200",
    draft: "text-gray-700 bg-gray-50 border-gray-200",
    sent: "text-blue-700 bg-blue-50 border-blue-200",
    verified: "text-emerald-700 bg-emerald-50 border-emerald-200",
    failed: "text-red-700 bg-red-50 border-red-200",
    completed: "text-emerald-700 bg-emerald-50 border-emerald-200",
    in_progress: "text-blue-700 bg-blue-50 border-blue-200",
    upcoming: "text-violet-700 bg-violet-50 border-violet-200",
    low_stock: "text-amber-700 bg-amber-50 border-amber-200",
    out_of_stock: "text-red-700 bg-red-50 border-red-200",
    inactive: "text-gray-700 bg-gray-50 border-gray-200",
  };
  return map[status] ?? "text-gray-700 bg-gray-50 border-gray-200";
}
