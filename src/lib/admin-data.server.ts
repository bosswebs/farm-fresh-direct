// Admin portal — server-side data access layer (real database queries)
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getDatabasePool } from "./database.server";

// ─── Auth guard helper ─────────────────────────────────────────────
async function requireAdmin() {
  const { requireRole } = await import("./auth.server");
  return requireRole(["super_admin", "marketplace_manager", "finance_manager",
    "training_manager", "consultancy_manager", "logistics_manager",
    "content_manager", "support_officer"]);
}

const staffRoleSchema = z.enum(["trainer", "consultant", "driver", "admin", "support"]);
const staffStatusSchema = z.enum(["active", "on_leave", "inactive"]);
const staffPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: staffRoleSchema,
  department: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(254),
  district: z.string().trim().min(2).max(80),
  status: staffStatusSchema.default("active"),
  joinDate: z.string().trim().min(1).max(20),
});
const staffIdSchema = z.object({ id: z.string().trim().min(1).max(80) });

type StaffRow = {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  district: string;
  status: string;
  join_date: string;
  assigned_tasks: number;
};

function mapStaffRow(row: StaffRow) {
  return {
    ...row,
    role: row.role as "trainer" | "consultant" | "driver" | "admin" | "support",
    status: row.status as "active" | "on_leave" | "inactive",
    joinDate: row.join_date,
    assignedTasks: row.assigned_tasks,
  };
}

// ─── Dashboard Stats ───────────────────────────────────────────────
export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();

  const [
    farmersRes, buyersRes, productsRes, ordersRes,
    revenueRes, pendingFarmersRes, pendingProductsRes,
    revenueChartRes, categoryRes, activityRes,
    geoRes, staffRes,
  ] = await Promise.all([
    pool.query<{ total: string; active: string; pending: string; suspended: string }>(
      `SELECT
         COUNT(*)::text AS total,
         COUNT(*) FILTER (WHERE status = 'active')::text AS active,
         COUNT(*) FILTER (WHERE status = 'pending')::text AS pending,
         COUNT(*) FILTER (WHERE status = 'suspended')::text AS suspended
       FROM farmers`
    ),
    pool.query<{ total: string; active: string }>(
      `SELECT COUNT(*)::text AS total,
              COUNT(*) FILTER (WHERE status = 'active')::text AS active
       FROM buyers`
    ),
    pool.query<{ active: string; pending: string }>(
      `SELECT COUNT(*) FILTER (WHERE status IN ('active','featured'))::text AS active,
              COUNT(*) FILTER (WHERE status = 'pending')::text AS pending
       FROM products`
    ),
    pool.query<{ today: string; total: string }>(
      `SELECT COUNT(*) FILTER (WHERE order_date = CURRENT_DATE)::text AS today,
              COUNT(*)::text AS total
       FROM orders`
    ),
    pool.query<{ monthly: string; paid_count: string; refunds: string }>(
      `SELECT COALESCE(SUM(total) FILTER (WHERE payment_status = 'paid'), 0)::text AS monthly,
              COUNT(*) FILTER (WHERE payment_status = 'paid')::text AS paid_count,
              COUNT(*) FILTER (WHERE payment_status = 'refunded')::text AS refunds
       FROM orders
       WHERE order_date >= date_trunc('month', CURRENT_DATE)`
    ),
    // Pending farmers for approvals panel
    pool.query<{ id: string; name: string; district: string; registered_date: string }>(
      `SELECT id, name, district, registered_date::text
       FROM farmers WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`
    ),
    // Pending products for approvals panel
    pool.query<{ id: string; name: string; district: string; listed_date: string }>(
      `SELECT id, name, district, listed_date::text
       FROM products WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`
    ),
    // Monthly revenue for chart (last 6 months)
    pool.query<{ month: string; revenue: string; orders: string }>(
      `SELECT to_char(date_trunc('month', order_date), 'Mon') AS month,
              COALESCE(SUM(total) FILTER (WHERE payment_status = 'paid'), 0)::text AS revenue,
              COUNT(*)::text AS orders
       FROM orders
       WHERE order_date >= date_trunc('month', CURRENT_DATE) - interval '5 months'
       GROUP BY date_trunc('month', order_date)
       ORDER BY date_trunc('month', order_date)`
    ),
    // Category performance from products
    pool.query<{ category: string; sales: string; products: string }>(
      `SELECT category,
              COALESCE(SUM(sales * price), 0)::text AS sales,
              COUNT(*)::text AS products
       FROM products
       WHERE status NOT IN ('rejected','suspended')
       GROUP BY category
       ORDER BY SUM(sales * price) DESC NULLS LAST
       LIMIT 7`
    ),
    // Activity feed (latest 8)
    pool.query<{ id: string; type: string; message: string; icon: string; occurred_at: string }>(
      `SELECT id::text, type, message, icon,
              to_char(occurred_at, 'YYYY-MM-DD HH24:MI') AS occurred_at
       FROM activity_feed ORDER BY occurred_at DESC LIMIT 8`
    ),
    // Geographic — farmers per district
    pool.query<{ district: string; total: string }>(
      `SELECT district, COUNT(*)::text AS total FROM farmers GROUP BY district ORDER BY COUNT(*) DESC`
    ),
    // Staff / consultancy counts
    pool.query<{ staff: string; consultancy: string; partners: string; deliveries_done: string }>(
      `SELECT
         (SELECT COUNT(*)::text FROM staff WHERE status = 'active') AS staff,
         (SELECT COUNT(*)::text FROM consultancy_requests) AS consultancy,
         (SELECT COUNT(*)::text FROM partners WHERE status = 'active') AS partners,
         (SELECT COUNT(*) FILTER (WHERE status = 'delivered')::text FROM deliveries) AS deliveries_done`
    ),
  ]);

  const f = farmersRes.rows[0];
  const b = buyersRes.rows[0];
  const p = productsRes.rows[0];
  const o = ordersRes.rows[0];
  const r = revenueRes.rows[0];
  const s = staffRes.rows[0];

  const pendingApprovals = parseInt(f.pending) + parseInt(p.pending);
  const totalDeliveries = parseInt(s.deliveries_done ?? "0");

  return {
    stats: {
      totalFarmers: parseInt(f.total),
      activeFarmers: parseInt(f.active),
      pendingFarmers: parseInt(f.pending),
      suspendedFarmers: parseInt(f.suspended),
      totalBuyers: parseInt(b.total),
      activeBuyers: parseInt(b.active),
      activeProducts: parseInt(p.active),
      pendingProducts: parseInt(p.pending),
      ordersToday: parseInt(o.today),
      totalOrders: parseInt(o.total),
      monthlyRevenue: parseFloat(r.monthly),
      pendingApprovals,
      activePartnerships: parseInt(s.partners ?? "0"),
      consultancyRequests: parseInt(s.consultancy ?? "0"),
      deliveryPerformance: totalDeliveries,
    },
    revenueData: revenueChartRes.rows.map((row) => ({
      month: row.month,
      revenue: parseFloat(row.revenue),
      orders: parseInt(row.orders),
    })),
    categoryPerformance: categoryRes.rows.map((row) => ({
      category: row.category,
      sales: parseFloat(row.sales),
      products: parseInt(row.products),
    })),
    activityFeed: activityRes.rows,
    pendingFarmers: pendingFarmersRes.rows,
    pendingProducts: pendingProductsRes.rows,
    geoStats: geoRes.rows,
  };
});

// ─── Recent Orders (for dashboard) ────────────────────────────────
export const getRecentOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; buyer_name: string; product_name: string; farmer_name: string;
    total: string; status: string; payment_method: string; payment_status: string;
    order_date: string; district: string;
  }>(
    `SELECT id, buyer_name, product_name, farmer_name, total::text, status,
            payment_method, payment_status, order_date::text, district
     FROM orders ORDER BY created_at DESC LIMIT 10`
  );
  return result.rows;
});

// ─── Farmers ──────────────────────────────────────────────────────
export const getFarmers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; name: string; phone: string; email: string; district: string;
    sector: string; farm_name: string; farm_size: string; products: string[];
    status: string; kyc_status: string; registered_date: string;
    total_sales: string; trainings_attended: number; performance_score: string;
    profile_image: string | null;
  }>(
    `SELECT id, name, phone, email, district, sector, farm_name, farm_size, products,
            status, kyc_status, registered_date::text, total_sales::text,
            trainings_attended, performance_score::text, profile_image
     FROM farmers ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    totalSales: parseFloat(r.total_sales),
    performanceScore: parseFloat(r.performance_score),
    farmName: r.farm_name,
    farmSize: r.farm_size,
    kycStatus: r.kyc_status as "verified" | "pending" | "failed",
    registeredDate: r.registered_date,
    trainingsAttended: r.trainings_attended,
    profileImage: r.profile_image ?? undefined,
  }));
});

// ─── Buyers ───────────────────────────────────────────────────────
export const getBuyers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; name: string; type: string; phone: string; email: string;
    district: string; total_orders: number; total_spent: string;
    status: string; join_date: string;
  }>(
    `SELECT id, name, type, phone, email, district, total_orders,
            total_spent::text, status, join_date::text
     FROM buyers ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    totalOrders: r.total_orders,
    totalSpent: parseFloat(r.total_spent),
    joinDate: r.join_date,
  }));
});

// ─── Staff ────────────────────────────────────────────────────────
export const getStaff = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<StaffRow>(
    `SELECT id, name, role, department, phone, email, district, status,
            join_date::text, assigned_tasks
     FROM staff ORDER BY created_at DESC`
  );
  return result.rows.map(mapStaffRow);
});

export const createStaffMember = createServerFn({ method: "POST" })
  .validator(staffPayloadSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const result = await pool.query<StaffRow>(
      `INSERT INTO staff(id, name, role, department, phone, email, district, status, join_date)
       VALUES ('STF-' || upper(substr(gen_random_uuid()::text, 1, 8)), $1, $2, $3, $4, $5, $6, $7, $8::date)
       RETURNING id, name, role, department, phone, email, district, status, join_date::text, assigned_tasks`,
      [
        data.name,
        data.role,
        data.department,
        data.phone,
        data.email.toLowerCase(),
        data.district,
        data.status,
        data.joinDate,
      ],
    );
    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["staff", `Added ${data.name} to ${data.department}`, "user-plus"],
    );
    return mapStaffRow(result.rows[0]);
  });

export const updateStaffMember = createServerFn({ method: "POST" })
  .validator(staffPayloadSchema.extend({ id: z.string().trim().min(1).max(80) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const previous = await client.query<{ name: string; role: string }>(
        "SELECT name, role FROM staff WHERE id = $1 FOR UPDATE",
        [data.id],
      );
      if (!previous.rows[0]) throw new Error("Staff member not found.");

      const result = await client.query<StaffRow>(
        `UPDATE staff
            SET name = $2,
                role = $3,
                department = $4,
                phone = $5,
                email = $6,
                district = $7,
                status = $8,
                join_date = $9::date
          WHERE id = $1
          RETURNING id, name, role, department, phone, email, district, status, join_date::text, assigned_tasks`,
        [
          data.id,
          data.name,
          data.role,
          data.department,
          data.phone,
          data.email.toLowerCase(),
          data.district,
          data.status,
          data.joinDate,
        ],
      );

      if (previous.rows[0].name !== data.name) {
        await client.query("UPDATE training_courses SET trainer = $2 WHERE trainer_id = $1", [
          data.id,
          data.name,
        ]);
        await client.query("UPDATE consultancy_requests SET consultant = $2 WHERE consultant_id = $1", [
          data.id,
          data.name,
        ]);
        await client.query("UPDATE vehicles SET driver_name = $2 WHERE driver_id = $1", [
          data.id,
          data.name,
        ]);
        await client.query("UPDATE deliveries SET driver_name = $2 WHERE driver_id = $1", [
          data.id,
          data.name,
        ]);
      }

      await client.query(
        "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
        ["staff", `Updated staff profile for ${data.name}`, "user-cog"],
      );
      await client.query("COMMIT");
      return mapStaffRow(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

export const updateStaffStatus = createServerFn({ method: "POST" })
  .validator(staffIdSchema.extend({ status: staffStatusSchema }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const result = await pool.query<StaffRow>(
      `UPDATE staff SET status = $2
        WHERE id = $1
        RETURNING id, name, role, department, phone, email, district, status, join_date::text, assigned_tasks`,
      [data.id, data.status],
    );
    if (!result.rows[0]) throw new Error("Staff member not found.");
    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["staff", `Set ${result.rows[0].name} status to ${data.status.replace("_", " ")}`, "user-check"],
    );
    return mapStaffRow(result.rows[0]);
  });

export const assignStaffTask = createServerFn({ method: "POST" })
  .validator(staffIdSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const result = await pool.query<StaffRow>(
      `UPDATE staff SET assigned_tasks = assigned_tasks + 1
        WHERE id = $1
        RETURNING id, name, role, department, phone, email, district, status, join_date::text, assigned_tasks`,
      [data.id],
    );
    if (!result.rows[0]) throw new Error("Staff member not found.");
    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["staff", `Assigned a new task to ${result.rows[0].name}`, "clipboard-list"],
    );
    return mapStaffRow(result.rows[0]);
});

// ─── Products ─────────────────────────────────────────────────────
export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; name: string; category: string; farmer_name: string;
    farmer_id: string | null; district: string; price: string; unit: string;
    quantity: string; status: string; quality_status: string;
    listed_date: string; sales: string; image: string;
  }>(
    `SELECT id, name, category, farmer_name, farmer_id, district, price::text,
            unit, quantity::text, status, quality_status, listed_date::text,
            sales::text, image
     FROM products ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    farmer: r.farmer_name,
    farmerId: r.farmer_id ?? "",
    price: parseFloat(r.price),
    quantity: parseFloat(r.quantity),
    sales: parseFloat(r.sales),
    qualityStatus: r.quality_status as
      "certified_organic" | "quality_verified" | "food_safety_approved" | "standard",
    listedDate: r.listed_date,
  }));
});

// ─── Orders ───────────────────────────────────────────────────────
export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; buyer_name: string; buyer_id: string | null;
    farmer_name: string; farmer_id: string | null; product_name: string;
    quantity: string; unit: string; total: string; status: string;
    payment_method: string; payment_status: string;
    order_date: string; delivery_date: string | null; district: string;
  }>(
    `SELECT id, buyer_name, buyer_id, farmer_name, farmer_id, product_name,
            quantity::text, unit, total::text, status, payment_method,
            payment_status, order_date::text, delivery_date::text, district
     FROM orders ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    id: r.id,
    buyer: r.buyer_name,
    buyerId: r.buyer_id ?? "",
    farmer: r.farmer_name,
    farmerId: r.farmer_id ?? "",
    product: r.product_name,
    quantity: parseFloat(r.quantity),
    unit: r.unit,
    total: parseFloat(r.total),
    status: r.status as "pending" | "confirmed" | "processing" | "in_transit" | "delivered" | "cancelled",
    paymentMethod: r.payment_method as "mtn_momo" | "airtel_money" | "bank_transfer" | "card",
    paymentStatus: r.payment_status as "paid" | "pending" | "failed" | "refunded",
    orderDate: r.order_date,
    deliveryDate: r.delivery_date ?? undefined,
    district: r.district,
  }));
});

// ─── Payments ─────────────────────────────────────────────────────
export const getPayments = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; order_id: string; buyer_name: string; farmer_name: string;
    product_name: string; amount: string; method: string; status: string;
    external_reference: string | null; paid_at: string | null; created_at: string;
  }>(
    `SELECT p.id::text, p.order_id, o.buyer_name, o.farmer_name, o.product_name,
            p.amount::text, p.method, p.status, p.external_reference,
            to_char(p.paid_at, 'YYYY-MM-DD') AS paid_at,
            to_char(p.created_at, 'YYYY-MM-DD') AS created_at
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     ORDER BY p.created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    amount: parseFloat(r.amount),
  }));
});

// ─── Training Courses ─────────────────────────────────────────────
export const getTrainingCourses = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; title: string; category: string; trainer: string;
    duration: string; sessions: number; participants: number;
    completion_rate: string; next_session: string; district: string; status: string;
  }>(
    `SELECT id, title, category, trainer, duration, sessions, participants,
            completion_rate::text, next_session, district, status
     FROM training_courses ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    completionRate: parseFloat(r.completion_rate),
    nextSession: r.next_session,
  }));
});

// ─── Consultancy Requests ─────────────────────────────────────────
export const getConsultancyRequests = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; client: string; service: string; consultant: string;
    status: string; priority: string; request_date: string; due_date: string;
    invoice_amount: string; invoice_status: string; district: string;
  }>(
    `SELECT id, client, service, consultant, status, priority, request_date::text,
            due_date::text, invoice_amount::text, invoice_status, district
     FROM consultancy_requests ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    requestDate: r.request_date,
    dueDate: r.due_date,
    invoiceAmount: parseFloat(r.invoice_amount),
    invoiceStatus: r.invoice_status as "draft" | "sent" | "paid" | "overdue",
  }));
});

// ─── Deliveries ───────────────────────────────────────────────────
export const getDeliveries = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; order_id: string; buyer_name: string; farmer_name: string;
    driver_name: string; vehicle_plate: string; pickup_district: string;
    delivery_district: string; status: string; scheduled_date: string;
    actual_delivery: string | null; distance: string;
  }>(
    `SELECT id, order_id, buyer_name, farmer_name, driver_name, vehicle_plate,
            pickup_district, delivery_district, status, scheduled_date::text,
            actual_delivery::text, distance
     FROM deliveries ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    id: r.id,
    orderId: r.order_id,
    buyer: r.buyer_name,
    farmer: r.farmer_name,
    driver: r.driver_name,
    vehicle: r.vehicle_plate,
    pickupDistrict: r.pickup_district,
    deliveryDistrict: r.delivery_district,
    status: r.status as "scheduled" | "picked_up" | "in_transit" | "delivered" | "failed",
    scheduledDate: r.scheduled_date,
    actualDelivery: r.actual_delivery ?? undefined,
    distance: r.distance,
  }));
});

// ─── Vehicles ─────────────────────────────────────────────────────
export const getVehicles = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; plate: string; type: string; driver_name: string;
    capacity: string; status: string; last_maintenance: string | null;
  }>(
    `SELECT id, plate, type, driver_name, capacity, status, last_maintenance::text
     FROM vehicles ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    id: r.id,
    plate: r.plate,
    type: r.type,
    driver: r.driver_name,
    capacity: r.capacity,
    status: r.status,
    lastMaintenance: r.last_maintenance ?? "—",
  }));
});

// ─── Partners ─────────────────────────────────────────────────────
export const getPartners = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; name: string; type: string; district: string;
    contact_person: string; phone: string; status: string;
    since: string; total_orders: number; total_value: string;
  }>(
    `SELECT id, name, type, district, contact_person, phone, status,
            since::text, total_orders, total_value::text
     FROM partners ORDER BY created_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    contactPerson: r.contact_person,
    totalOrders: r.total_orders,
    totalValue: parseFloat(r.total_value),
  }));
});

// ─── FnB Categories + Products ────────────────────────────────────
interface FnbProduct {
  name: string;
  price: number;
  stock: number;
  sold: number;
  status: string;
}

interface FnbCategory {
  name: string;
  icon: string;
  products: FnbProduct[];
}

export const getFnbData = createServerFn({ method: "GET" }).handler(async (): Promise<FnbCategory[]> => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    category_id: string; category_name: string; icon: string;
    product_id: string | null; product_name: string | null; price: string | null;
    stock: string | null; sold: string | null; status: string | null;
  }>(
    `SELECT c.id::text AS category_id, c.name AS category_name, c.icon,
            p.id::text AS product_id, p.name AS product_name, p.price::text,
            p.stock::text, p.sold::text, p.status
     FROM fnb_categories c
     LEFT JOIN fnb_products p ON p.category_id = c.id
     ORDER BY c.id, p.id`
  );

  const map = new Map<string, FnbCategory>();
  for (const row of result.rows) {
    if (!map.has(row.category_id)) {
      map.set(row.category_id, { name: row.category_name, icon: row.icon, products: [] });
    }
    if (row.product_id && row.product_name) {
      map.get(row.category_id)!.products.push({
        name: row.product_name,
        price: parseFloat(row.price ?? "0"),
        stock: parseFloat(row.stock ?? "0"),
        sold: parseFloat(row.sold ?? "0"),
        status: row.status ?? "active",
      });
    }
  }
  return Array.from(map.values());
});

// ─── WhatsApp Orders ──────────────────────────────────────────────
export const getWhatsappOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; customer: string; phone: string; product: string;
    amount: string; status: string; ordered_at: string;
  }>(
    `SELECT id, customer, phone, product, amount::text, status,
            to_char(ordered_at, 'YYYY-MM-DD HH24:MI') AS ordered_at
     FROM whatsapp_orders ORDER BY ordered_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    amount: parseFloat(r.amount),
    date: r.ordered_at,
  }));
});

// ─── Content Pages ────────────────────────────────────────────────
export const getContentPages = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string; title: string; type: string; status: string;
    author: string; last_updated: string;
  }>(
    `SELECT id, title, type, status, author, last_updated::text
     FROM content_pages ORDER BY updated_at DESC`
  );
  return result.rows.map((r) => ({
    ...r,
    lastUpdated: r.last_updated,
  }));
});

// ─── Geographic Stats ─────────────────────────────────────────────
export const getGeographicStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{ district: string; total: string }>(
    `SELECT district, COUNT(*)::text AS total FROM farmers GROUP BY district ORDER BY COUNT(*) DESC`
  );
  return result.rows.map((r) => ({ district: r.district, farmers: parseInt(r.total) }));
});

// ─── Reports: Revenue + Impact Metrics ────────────────────────────
export const getReportData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();

  const [revenueRes, farmersRes] = await Promise.all([
    pool.query<{ month: string; revenue: string; orders: string }>(
      `SELECT to_char(date_trunc('month', order_date), 'Mon') AS month,
              COALESCE(SUM(total) FILTER (WHERE payment_status = 'paid'), 0)::text AS revenue,
              COUNT(*)::text AS orders
       FROM orders
       WHERE order_date >= date_trunc('month', CURRENT_DATE) - interval '11 months'
       GROUP BY date_trunc('month', order_date)
       ORDER BY date_trunc('month', order_date)`
    ),
    pool.query<{ month: string; farmers_reached: string; trained: string }>(
      `SELECT to_char(date_trunc('month', registered_date), 'Mon') AS month,
              COUNT(*)::text AS farmers_reached,
              SUM(trainings_attended)::text AS trained
       FROM farmers
       WHERE registered_date >= date_trunc('month', CURRENT_DATE) - interval '11 months'
       GROUP BY date_trunc('month', registered_date)
       ORDER BY date_trunc('month', registered_date)`
    ),
  ]);

  const revenueByMonth = new Map(revenueRes.rows.map((r) => [r.month, r]));

  const impactMetrics = farmersRes.rows.map((r) => {
    const rev = revenueByMonth.get(r.month);
    return {
      month: r.month,
      farmersReached: parseInt(r.farmers_reached),
      trained: parseInt(r.trained ?? "0"),
      revenue: rev ? parseFloat(rev.revenue) : 0,
      loss_reduction: 0, // no field in DB — show 0
    };
  });

  return {
    revenueData: revenueRes.rows.map((r) => ({
      month: r.month,
      revenue: parseFloat(r.revenue),
      orders: parseInt(r.orders),
      farmers: 0,
    })),
    impactMetrics,
  };
});
