// Admin portal — server-side data access layer (real database queries)
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getDatabasePool } from "./database.server";

// ─── Auth guard helper ─────────────────────────────────────────────
async function requireAdmin() {
  const { requireRole } = await import("./auth.server");
  return requireRole([
    "super_admin",
    "manager",
    "marketplace_manager",
    "finance_manager",
    "training_manager",
    "consultancy_manager",
    "logistics_manager",
    "content_manager",
    "support_officer",
  ]);
}

const staffRoleSchema = z.enum(["trainer", "consultant", "driver", "admin", "support"]);
const staffStatusSchema = z.enum(["active", "on_leave", "inactive"]);
const appUserRoleSchema = z.enum([
  "super_admin",
  "manager",
  "marketplace_manager",
  "finance_manager",
  "training_manager",
  "consultancy_manager",
  "logistics_manager",
  "content_manager",
  "support_officer",
]);

const staffPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: staffRoleSchema,
  department: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(254),
  district: z.string().trim().min(2).max(80),
  status: staffStatusSchema.default("active"),
  joinDate: z.string().trim().min(1).max(20),
  enableLogin: z.boolean().default(false),
  loginPassword: z.string().min(10).max(128).optional().nullable(),
  loginRole: appUserRoleSchema.optional().nullable(),
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
  auth_user_id?: string | null;
  login_role?: string | null;
};

function mapStaffRow(row: StaffRow) {
  return {
    id: row.id,
    name: row.name,
    role: row.role as "trainer" | "consultant" | "driver" | "admin" | "support",
    department: row.department,
    phone: row.phone,
    email: row.email,
    district: row.district,
    status: row.status as "active" | "on_leave" | "inactive",
    joinDate: row.join_date,
    assignedTasks: row.assigned_tasks,
    authUserId: row.auth_user_id ?? null,
    loginRole: row.login_role ?? null,
  };
}

// ─── Dashboard Stats ───────────────────────────────────────────────
export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();

  const [
    farmersRes,
    buyersRes,
    productsRes,
    ordersRes,
    revenueRes,
    pendingFarmersRes,
    pendingProductsRes,
    revenueChartRes,
    categoryRes,
    activityRes,
    geoRes,
    staffRes,
  ] = await Promise.all([
    pool.query<{ total: string; active: string; pending: string; suspended: string }>(
      `SELECT
         COUNT(*)::text AS total,
         COUNT(*) FILTER (WHERE status = 'active')::text AS active,
         COUNT(*) FILTER (WHERE status = 'pending')::text AS pending,
         COUNT(*) FILTER (WHERE status = 'suspended')::text AS suspended
       FROM farmers`,
    ),
    pool.query<{ total: string; active: string }>(
      `SELECT COUNT(*)::text AS total,
              COUNT(*) FILTER (WHERE status = 'active')::text AS active
       FROM buyers`,
    ),
    pool.query<{ active: string; pending: string }>(
      `SELECT COUNT(*) FILTER (WHERE status IN ('active','featured'))::text AS active,
              COUNT(*) FILTER (WHERE status = 'pending')::text AS pending
       FROM products`,
    ),
    pool.query<{ today: string; total: string }>(
      `SELECT COUNT(*) FILTER (WHERE order_date = CURRENT_DATE)::text AS today,
              COUNT(*)::text AS total
       FROM orders`,
    ),
    pool.query<{ monthly: string; paid_count: string; refunds: string }>(
      `SELECT COALESCE(SUM(total) FILTER (WHERE payment_status = 'paid'), 0)::text AS monthly,
              COUNT(*) FILTER (WHERE payment_status = 'paid')::text AS paid_count,
              COUNT(*) FILTER (WHERE payment_status = 'refunded')::text AS refunds
       FROM orders
       WHERE order_date >= date_trunc('month', CURRENT_DATE)`,
    ),
    // Pending farmers for approvals panel
    pool.query<{ id: string; name: string; district: string; registered_date: string }>(
      `SELECT id, name, district, registered_date::text
       FROM farmers WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`,
    ),
    // Pending products for approvals panel
    pool.query<{ id: string; name: string; district: string; listed_date: string }>(
      `SELECT id, name, district, listed_date::text
       FROM products WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5`,
    ),
    // Monthly revenue for chart (last 6 months)
    pool.query<{ month: string; revenue: string; orders: string }>(
      `SELECT to_char(date_trunc('month', order_date), 'Mon') AS month,
              COALESCE(SUM(total) FILTER (WHERE payment_status = 'paid'), 0)::text AS revenue,
              COUNT(*)::text AS orders
       FROM orders
       WHERE order_date >= date_trunc('month', CURRENT_DATE) - interval '5 months'
       GROUP BY date_trunc('month', order_date)
       ORDER BY date_trunc('month', order_date)`,
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
       LIMIT 7`,
    ),
    // Activity feed (latest 8)
    pool.query<{ id: string; type: string; message: string; icon: string; occurred_at: string }>(
      `SELECT id::text, type, message, icon,
              to_char(occurred_at, 'YYYY-MM-DD HH24:MI') AS occurred_at
       FROM activity_feed ORDER BY occurred_at DESC LIMIT 8`,
    ),
    // Geographic — farmers per district
    pool.query<{ district: string; total: string }>(
      `SELECT district, COUNT(*)::text AS total FROM farmers GROUP BY district ORDER BY COUNT(*) DESC`,
    ),
    // Staff / consultancy counts
    pool.query<{ staff: string; consultancy: string; partners: string; deliveries_done: string }>(
      `SELECT
         (SELECT COUNT(*)::text FROM staff WHERE status = 'active') AS staff,
         (SELECT COUNT(*)::text FROM consultancy_requests) AS consultancy,
         (SELECT COUNT(*)::text FROM partners WHERE status = 'active') AS partners,
         (SELECT COUNT(*) FILTER (WHERE status = 'delivered')::text FROM deliveries) AS deliveries_done`,
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
    id: string;
    buyer_name: string;
    product_name: string;
    farmer_name: string;
    total: string;
    status: string;
    payment_method: string;
    payment_status: string;
    order_date: string;
    district: string;
  }>(
    `SELECT id, buyer_name, product_name, farmer_name, total::text, status,
            payment_method, payment_status, order_date::text, district
     FROM orders ORDER BY created_at DESC LIMIT 10`,
  );
  return result.rows;
});

// ─── Farmers ──────────────────────────────────────────────────────
export const getFarmers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    name: string;
    phone: string;
    email: string;
    district: string;
    sector: string;
    farm_name: string;
    farm_size: string;
    products: string[];
    status: string;
    kyc_status: string;
    registered_date: string;
    total_sales: string;
    trainings_attended: number;
    performance_score: string;
    profile_image: string | null;
  }>(
    `SELECT id, name, phone, email, district, sector, farm_name, farm_size, products,
            status, kyc_status, registered_date::text, total_sales::text,
            trainings_attended, performance_score::text, profile_image
     FROM farmers ORDER BY created_at DESC`,
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
    id: string;
    name: string;
    type: string;
    phone: string;
    email: string;
    district: string;
    total_orders: number;
    total_spent: string;
    status: string;
    join_date: string;
  }>(
    `SELECT id, name, type, phone, email, district, total_orders,
            total_spent::text, status, join_date::text
     FROM buyers ORDER BY created_at DESC`,
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
    `SELECT s.id, s.name, s.role, s.department, s.phone, s.email, s.district, s.status,
            s.join_date::text, s.assigned_tasks, s.auth_user_id, u.role AS login_role
     FROM staff s
     LEFT JOIN application_users u ON s.auth_user_id = u.id
     ORDER BY s.created_at DESC`,
  );
  return result.rows.map(mapStaffRow);
});

export const createStaffMember = createServerFn({ method: "POST" })
  .validator(staffPayloadSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let authUserId: string | null = null;
      if (data.enableLogin && data.loginPassword && data.loginRole) {
        const userRes = await client.query<{ id: string }>(
          `INSERT INTO application_users(email, password_hash, display_name, role, status)
           VALUES ($1, crypt($2, gen_salt('bf', 12)), $3, $4, 'active')
           RETURNING id`,
          [data.email.toLowerCase(), data.loginPassword, data.name, data.loginRole],
        );
        authUserId = userRes.rows[0].id;
      }

      const result = await client.query<StaffRow>(
        `INSERT INTO staff(id, auth_user_id, name, role, department, phone, email, district, status, join_date)
         VALUES ('STF-' || upper(substr(gen_random_uuid()::text, 1, 8)), $1, $2, $3, $4, $5, $6, $7, $8, $9::date)
         RETURNING id, auth_user_id, name, role, department, phone, email, district, status, join_date::text, assigned_tasks`,
        [
          authUserId,
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

      const mappedResult = await client.query<StaffRow>(
        `SELECT s.id, s.name, s.role, s.department, s.phone, s.email, s.district, s.status,
                s.join_date::text, s.assigned_tasks, s.auth_user_id, u.role AS login_role
         FROM staff s
         LEFT JOIN application_users u ON s.auth_user_id = u.id
         WHERE s.id = $1`,
        [result.rows[0].id],
      );

      await client.query("INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)", [
        "staff",
        `Added ${data.name} to ${data.department}`,
        "user-plus",
      ]);

      await client.query("COMMIT");
      return mapStaffRow(mappedResult.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

export const updateStaffMember = createServerFn({ method: "POST" })
  .validator(staffPayloadSchema.extend({ id: z.string().trim().min(1).max(80) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const previous = await client.query<{
        name: string;
        role: string;
        auth_user_id: string | null;
      }>("SELECT name, role, auth_user_id FROM staff WHERE id = $1 FOR UPDATE", [data.id]);
      if (!previous.rows[0]) throw new Error("Staff member not found.");

      let authUserId = previous.rows[0].auth_user_id;

      if (data.enableLogin) {
        if (authUserId) {
          // Already has login, update it
          if (data.loginRole) {
            await client.query(
              `UPDATE application_users
                  SET email = $2,
                      display_name = $3,
                      role = $4,
                      password_hash = CASE WHEN $5::text IS NOT NULL THEN crypt($5, gen_salt('bf', 12)) ELSE password_hash END,
                      updated_at = now()
                WHERE id = $1`,
              [
                authUserId,
                data.email.toLowerCase(),
                data.name,
                data.loginRole,
                data.loginPassword || null,
              ],
            );
          }
        } else {
          // Creating login credentials for the first time for this staff member
          if (data.loginPassword && data.loginRole) {
            const userRes = await client.query<{ id: string }>(
              `INSERT INTO application_users(email, password_hash, display_name, role, status)
               VALUES ($1, crypt($2, gen_salt('bf', 12)), $3, $4, 'active')
               RETURNING id`,
              [data.email.toLowerCase(), data.loginPassword, data.name, data.loginRole],
            );
            authUserId = userRes.rows[0].id;
          }
        }
      } else {
        // Disabled/Not enabled login
        if (authUserId) {
          // Remove login access - delete user login record
          await client.query("DELETE FROM application_users WHERE id = $1", [authUserId]);
          authUserId = null;
        }
      }

      await client.query(
        `UPDATE staff
            SET name = $2,
                role = $3,
                department = $4,
                phone = $5,
                email = $6,
                district = $7,
                status = $8,
                join_date = $9::date,
                auth_user_id = $10
          WHERE id = $1`,
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
          authUserId,
        ],
      );

      if (previous.rows[0].name !== data.name) {
        await client.query("UPDATE training_courses SET trainer = $2 WHERE trainer_id = $1", [
          data.id,
          data.name,
        ]);
        await client.query(
          "UPDATE consultancy_requests SET consultant = $2 WHERE consultant_id = $1",
          [data.id, data.name],
        );
        await client.query("UPDATE vehicles SET driver_name = $2 WHERE driver_id = $1", [
          data.id,
          data.name,
        ]);
        await client.query("UPDATE deliveries SET driver_name = $2 WHERE driver_id = $1", [
          data.id,
          data.name,
        ]);
      }

      const mappedResult = await client.query<StaffRow>(
        `SELECT s.id, s.name, s.role, s.department, s.phone, s.email, s.district, s.status,
                s.join_date::text, s.assigned_tasks, s.auth_user_id, u.role AS login_role
         FROM staff s
         LEFT JOIN application_users u ON s.auth_user_id = u.id
         WHERE s.id = $1`,
        [data.id],
      );

      await client.query("INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)", [
        "staff",
        `Updated staff profile for ${data.name}`,
        "user-cog",
      ]);
      await client.query("COMMIT");
      return mapStaffRow(mappedResult.rows[0]);
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
    await pool.query("INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)", [
      "staff",
      `Set ${result.rows[0].name} status to ${data.status.replace("_", " ")}`,
      "user-check",
    ]);
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
    await pool.query("INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)", [
      "staff",
      `Assigned a new task to ${result.rows[0].name}`,
      "clipboard-list",
    ]);
    return mapStaffRow(result.rows[0]);
  });

// ─── Products ─────────────────────────────────────────────────────
export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    name: string;
    category: string;
    description: string;
    farmer_name: string;
    farmer_id: string | null;
    district: string;
    price: string;
    unit: string;
    quantity: string;
    status: string;
    quality_status: string;
    listed_date: string;
    sales: string;
    image: string;
  }>(
    `SELECT id, name, category, description, farmer_name, farmer_id, district, price::text,
            unit, quantity::text, status, quality_status, listed_date::text,
            sales::text, image
     FROM products ORDER BY created_at DESC`,
  );
  return result.rows.map((r) => ({
    ...r,
    farmer: r.farmer_name,
    farmerId: r.farmer_id ?? "",
    price: parseFloat(r.price),
    quantity: parseFloat(r.quantity),
    sales: parseFloat(r.sales),
    qualityStatus: r.quality_status as
      | "certified_organic"
      | "quality_verified"
      | "food_safety_approved"
      | "standard",
    listedDate: r.listed_date,
  }));
});

// Mutations for Products
export const createProduct = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      description: z.string().default(""),
      farmerId: z.string().min(1),
      price: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      unit: z.string().min(1),
      status: z.enum(["active", "pending", "rejected", "suspended", "featured"]).default("pending"),
      qualityStatus: z.enum(["certified_organic", "quality_verified", "food_safety_approved", "standard"]).default("standard"),
      image: z.string().default("📦"),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    // Fetch farmer info
    const farmerRes = await pool.query<{ name: string; farm_name: string; district: string; sector: string }>(
      "SELECT name, farm_name, district, sector FROM farmers WHERE id = $1",
      [data.farmerId]
    );
    if (farmerRes.rowCount === 0) {
      throw new Error("Farmer not found");
    }
    const farmer = farmerRes.rows[0];

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const productId = `PRD-${randomDigits}`;

    const organic_status = data.qualityStatus === "certified_organic";
    const quality_verified = data.qualityStatus === "quality_verified" || data.qualityStatus === "certified_organic";
    const food_safety_status = data.qualityStatus === "food_safety_approved" || data.qualityStatus === "quality_verified" || data.qualityStatus === "certified_organic";

    const result = await pool.query<{
      id: string;
      name: string;
      category: string;
      description: string;
      farmer_name: string;
      farmer_id: string | null;
      district: string;
      price: string;
      unit: string;
      quantity: string;
      status: string;
      quality_status: string;
      listed_date: string;
      sales: string;
      image: string;
    }>(
      `INSERT INTO products (
        id, name, category, description, farmer_id, farmer_name, farm_name,
        district, location, price, quantity, unit, status, quality_status,
        organic_status, quality_verified, food_safety_status, image, listed_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_DATE)
      RETURNING id, name, category, description, farmer_name, farmer_id, district, price::text,
                unit, quantity::text, status, quality_status, listed_date::text,
                sales::text, image`,
      [
        productId,
        data.name,
        data.category,
        data.description,
        data.farmerId,
        farmer.name,
        farmer.farm_name || "",
        farmer.district || "",
        farmer.sector || "",
        data.price,
        data.quantity,
        data.unit,
        data.status,
        data.qualityStatus,
        organic_status,
        quality_verified,
        food_safety_status,
        data.image || "📦",
      ]
    );

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "marketplace",
        `${admin.displayName} created product "${data.name}" for farmer ${farmer.name}`,
        "package-plus",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      farmer: r.farmer_name,
      farmerId: r.farmer_id ?? "",
      price: parseFloat(r.price),
      quantity: parseFloat(r.quantity),
      sales: parseFloat(r.sales),
      qualityStatus: r.quality_status as
        | "certified_organic"
        | "quality_verified"
        | "food_safety_approved"
        | "standard",
      listedDate: r.listed_date,
    };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      category: z.string().min(1),
      description: z.string().default(""),
      farmerId: z.string().min(1),
      price: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      unit: z.string().min(1),
      status: z.enum(["active", "pending", "rejected", "suspended", "featured"]),
      qualityStatus: z.enum(["certified_organic", "quality_verified", "food_safety_approved", "standard"]),
      image: z.string().default("📦"),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    // Fetch farmer info
    const farmerRes = await pool.query<{ name: string; farm_name: string; district: string; sector: string }>(
      "SELECT name, farm_name, district, sector FROM farmers WHERE id = $1",
      [data.farmerId]
    );
    if (farmerRes.rowCount === 0) {
      throw new Error("Farmer not found");
    }
    const farmer = farmerRes.rows[0];

    const organic_status = data.qualityStatus === "certified_organic";
    const quality_verified = data.qualityStatus === "quality_verified" || data.qualityStatus === "certified_organic";
    const food_safety_status = data.qualityStatus === "food_safety_approved" || data.qualityStatus === "quality_verified" || data.qualityStatus === "certified_organic";

    const result = await pool.query<{
      id: string;
      name: string;
      category: string;
      description: string;
      farmer_name: string;
      farmer_id: string | null;
      district: string;
      price: string;
      unit: string;
      quantity: string;
      status: string;
      quality_status: string;
      listed_date: string;
      sales: string;
      image: string;
    }>(
      `UPDATE products
       SET name = $1, category = $2, description = $3, farmer_id = $4, farmer_name = $5,
           farm_name = $6, district = $7, location = $8, price = $9, quantity = $10,
           unit = $11, status = $12, quality_status = $13, organic_status = $14,
           quality_verified = $15, food_safety_status = $16, image = $17, updated_at = now()
       WHERE id = $18
       RETURNING id, name, category, description, farmer_name, farmer_id, district, price::text,
                 unit, quantity::text, status, quality_status, listed_date::text,
                 sales::text, image`,
      [
        data.name,
        data.category,
        data.description,
        data.farmerId,
        farmer.name,
        farmer.farm_name || "",
        farmer.district || "",
        farmer.sector || "",
        data.price,
        data.quantity,
        data.unit,
        data.status,
        data.qualityStatus,
        organic_status,
        quality_verified,
        food_safety_status,
        data.image || "📦",
        data.id,
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("Product not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "marketplace",
        `${admin.displayName} updated product "${data.name}"`,
        "edit",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      farmer: r.farmer_name,
      farmerId: r.farmer_id ?? "",
      price: parseFloat(r.price),
      quantity: parseFloat(r.quantity),
      sales: parseFloat(r.sales),
      qualityStatus: r.quality_status as
        | "certified_organic"
        | "quality_verified"
        | "food_safety_approved"
        | "standard",
      listedDate: r.listed_date,
    };
  });

export const updateProductStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      status: z.enum(["active", "pending", "rejected", "suspended", "featured"]),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query(
      `UPDATE products
       SET status = $1, updated_at = now()
       WHERE id = $2
       RETURNING name`,
      [data.status, data.id]
    );

    if (result.rowCount === 0) {
      throw new Error("Product not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "marketplace",
        `${admin.displayName} updated status of product "${result.rows[0].name}" to ${data.status}`,
        data.status === "active" ? "check-circle" : data.status === "featured" ? "star" : "pause",
      ]
    );

    return { success: true };
  });

export const bulkUpdateProductStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ids: z.array(z.string()),
      status: z.enum(["active", "pending", "rejected", "suspended", "featured"]),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query(
      `UPDATE products
       SET status = $1, updated_at = now()
       WHERE id = ANY($2)
       RETURNING id`,
      [data.status, data.ids]
    );

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "marketplace",
        `${admin.displayName} updated status of ${result.rowCount} products to ${data.status}`,
        "package",
      ]
    );

    return { success: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING name`,
      [data.id]
    );

    if (result.rowCount === 0) {
      throw new Error("Product not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "marketplace",
        `${admin.displayName} deleted product "${result.rows[0].name}"`,
        "trash-2",
      ]
    );

    return { success: true };
  });

// ─── Orders ───────────────────────────────────────────────────────
export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    buyer_name: string;
    buyer_id: string | null;
    farmer_name: string;
    farmer_id: string | null;
    product_name: string;
    quantity: string;
    unit: string;
    total: string;
    status: string;
    payment_method: string;
    payment_status: string;
    order_date: string;
    delivery_date: string | null;
    district: string;
  }>(
    `SELECT id, buyer_name, buyer_id, farmer_name, farmer_id, product_name,
            quantity::text, unit, total::text, status, payment_method,
            payment_status, order_date::text, delivery_date::text, district
     FROM orders ORDER BY created_at DESC`,
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
    status: r.status as
      | "pending"
      | "confirmed"
      | "processing"
      | "in_transit"
      | "delivered"
      | "cancelled",
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
    id: string;
    order_id: string;
    buyer_name: string;
    farmer_name: string;
    product_name: string;
    amount: string;
    method: string;
    status: string;
    external_reference: string | null;
    paid_at: string | null;
    created_at: string;
  }>(
    `SELECT p.id::text, p.order_id, o.buyer_name, o.farmer_name, o.product_name,
            p.amount::text, p.method, p.status, p.external_reference,
            to_char(p.paid_at, 'YYYY-MM-DD') AS paid_at,
            to_char(p.created_at, 'YYYY-MM-DD') AS created_at
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     ORDER BY p.created_at DESC`,
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
    id: string;
    title: string;
    category: string;
    trainer: string;
    duration: string;
    sessions: number;
    participants: number;
    completion_rate: string;
    next_session: string;
    district: string;
    status: string;
  }>(
    `SELECT id, title, category, trainer, duration, sessions, participants,
            completion_rate::text, next_session, district, status
     FROM training_courses ORDER BY created_at DESC`,
  );
  return result.rows.map((r) => ({
    ...r,
    completionRate: parseFloat(r.completion_rate),
    nextSession: r.next_session,
  }));
});

export const createTrainingCourse = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(1),
      category: z.string().min(1),
      trainer: z.string().min(1),
      duration: z.string().min(1),
      sessions: z.number().int().nonnegative().default(1),
      participants: z.number().int().nonnegative().default(0),
      completionRate: z.number().min(0).max(100).default(0),
      nextSession: z.string().min(1),
      district: z.string().min(1),
      status: z.enum(["active", "upcoming", "completed"]).default("upcoming"),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const courseId = `TRN-${randomDigits}`;

    const result = await pool.query<{
      id: string;
      title: string;
      category: string;
      trainer: string;
      duration: string;
      sessions: number;
      participants: number;
      completion_rate: string;
      next_session: string;
      district: string;
      status: string;
    }>(
      `INSERT INTO training_courses (
        id, title, category, trainer, duration, sessions, participants,
        completion_rate, next_session, district, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, title, category, trainer, duration, sessions, participants,
                completion_rate::text, next_session, district, status`,
      [
        courseId,
        data.title,
        data.category,
        data.trainer,
        data.duration,
        data.sessions,
        data.participants,
        data.completionRate,
        data.nextSession,
        data.district,
        data.status,
      ]
    );

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "training",
        `${admin.displayName} created training course "${data.title}"`,
        "graduation-cap",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      completionRate: parseFloat(r.completion_rate),
      nextSession: r.next_session,
    };
  });

export const updateTrainingCourse = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      title: z.string().min(1),
      category: z.string().min(1),
      trainer: z.string().min(1),
      duration: z.string().min(1),
      sessions: z.number().int().nonnegative(),
      participants: z.number().int().nonnegative(),
      completionRate: z.number().min(0).max(100),
      nextSession: z.string().min(1),
      district: z.string().min(1),
      status: z.enum(["active", "upcoming", "completed"]),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query<{
      id: string;
      title: string;
      category: string;
      trainer: string;
      duration: string;
      sessions: number;
      participants: number;
      completion_rate: string;
      next_session: string;
      district: string;
      status: string;
    }>(
      `UPDATE training_courses
       SET title = $1, category = $2, trainer = $3, duration = $4, sessions = $5,
           participants = $6, completion_rate = $7, next_session = $8, district = $9,
           status = $10, updated_at = now()
       WHERE id = $11
       RETURNING id, title, category, trainer, duration, sessions, participants,
                 completion_rate::text, next_session, district, status`,
      [
        data.title,
        data.category,
        data.trainer,
        data.duration,
        data.sessions,
        data.participants,
        data.completionRate,
        data.nextSession,
        data.district,
        data.status,
        data.id,
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("Training course not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "training",
        `${admin.displayName} updated training course "${data.title}"`,
        "edit",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      completionRate: parseFloat(r.completion_rate),
      nextSession: r.next_session,
    };
  });

export const deleteTrainingCourse = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query(`DELETE FROM training_courses WHERE id = $1 RETURNING title`, [data.id]);
    if (result.rowCount === 0) {
      throw new Error("Training course not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "training",
        `${admin.displayName} deleted training course "${result.rows[0].title}"`,
        "trash-2",
      ]
    );

    return { success: true };
  });

// ─── Consultancy Requests ─────────────────────────────────────────
export const getConsultancyRequests = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    client: string;
    service: string;
    consultant: string;
    status: string;
    priority: string;
    request_date: string;
    due_date: string;
    invoice_amount: string;
    invoice_status: string;
    district: string;
  }>(
    `SELECT id, client, service, consultant, status, priority, request_date::text,
            due_date::text, invoice_amount::text, invoice_status, district
     FROM consultancy_requests ORDER BY created_at DESC`,
  );
  return result.rows.map((r) => ({
    ...r,
    requestDate: r.request_date,
    dueDate: r.due_date,
    invoiceAmount: parseFloat(r.invoice_amount),
    invoiceStatus: r.invoice_status as "draft" | "sent" | "paid" | "overdue",
  }));
});

export const createConsultancyRequest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      client: z.string().min(1),
      service: z.string().min(1),
      consultant: z.string().default("Unassigned"),
      status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
      priority: z.enum(["high", "medium", "low"]).default("medium"),
      dueDate: z.string().min(1),
      invoiceAmount: z.number().nonnegative().default(0),
      invoiceStatus: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
      district: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const requestId = `CNS-${randomDigits}`;

    const result = await pool.query<{
      id: string;
      client: string;
      service: string;
      consultant: string;
      status: string;
      priority: string;
      request_date: string;
      due_date: string;
      invoice_amount: string;
      invoice_status: string;
      district: string;
    }>(
      `INSERT INTO consultancy_requests (
        id, client, service, consultant, status, priority, request_date,
        due_date, invoice_amount, invoice_status, district
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, $8, $9, $10)
      RETURNING id, client, service, consultant, status, priority, request_date::text,
                due_date::text, invoice_amount::text, invoice_status, district`,
      [
        requestId,
        data.client,
        data.service,
        data.consultant === "none" ? "" : data.consultant,
        data.status,
        data.priority,
        data.dueDate,
        data.invoiceAmount,
        data.invoiceStatus,
        data.district,
      ]
    );

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "consultancy",
        `${admin.displayName} created consultancy project for ${data.client}`,
        "briefcase",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      requestDate: r.request_date,
      dueDate: r.due_date,
      invoiceAmount: parseFloat(r.invoice_amount),
      invoiceStatus: r.invoice_status as "draft" | "sent" | "paid" | "overdue",
    };
  });

export const updateConsultancyRequest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      client: z.string().min(1),
      service: z.string().min(1),
      consultant: z.string(),
      status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
      priority: z.enum(["high", "medium", "low"]),
      dueDate: z.string().min(1),
      invoiceAmount: z.number().nonnegative(),
      invoiceStatus: z.enum(["draft", "sent", "paid", "overdue"]),
      district: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const consultantVal = data.consultant === "none" ? "" : data.consultant;

    const result = await pool.query<{
      id: string;
      client: string;
      service: string;
      consultant: string;
      status: string;
      priority: string;
      request_date: string;
      due_date: string;
      invoice_amount: string;
      invoice_status: string;
      district: string;
    }>(
      `UPDATE consultancy_requests
       SET client = $1, service = $2, consultant = $3, status = $4, priority = $5,
           due_date = $6, invoice_amount = $7, invoice_status = $8, district = $9,
           updated_at = now()
       WHERE id = $10
       RETURNING id, client, service, consultant, status, priority, request_date::text,
                 due_date::text, invoice_amount::text, invoice_status, district`,
      [
        data.client,
        data.service,
        consultantVal,
        data.status,
        data.priority,
        data.dueDate,
        data.invoiceAmount,
        data.invoiceStatus,
        data.district,
        data.id,
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("Consultancy request not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "consultancy",
        `${admin.displayName} updated consultancy project ${data.id} (${data.client})`,
        "edit",
      ]
    );

    const r = result.rows[0];
    return {
      ...r,
      requestDate: r.request_date,
      dueDate: r.due_date,
      invoiceAmount: parseFloat(r.invoice_amount),
      invoiceStatus: r.invoice_status as "draft" | "sent" | "paid" | "overdue",
    };
  });

export const deleteConsultancyRequest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin();
    const pool = getDatabasePool();

    const result = await pool.query(`DELETE FROM consultancy_requests WHERE id = $1 RETURNING client`, [data.id]);
    if (result.rowCount === 0) {
      throw new Error("Consultancy request not found");
    }

    await pool.query(
      "INSERT INTO activity_feed (type, message, icon) VALUES ($1, $2, $3)",
      [
        "consultancy",
        `${admin.displayName} deleted consultancy project for ${result.rows[0].client}`,
        "trash-2",
      ]
    );

    return { success: true };
  });

// ─── Deliveries ───────────────────────────────────────────────────
export const getDeliveries = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    order_id: string;
    buyer_name: string;
    farmer_name: string;
    driver_name: string;
    vehicle_plate: string;
    pickup_district: string;
    delivery_district: string;
    status: string;
    scheduled_date: string;
    actual_delivery: string | null;
    distance: string;
  }>(
    `SELECT id, order_id, buyer_name, farmer_name, driver_name, vehicle_plate,
            pickup_district, delivery_district, status, scheduled_date::text,
            actual_delivery::text, distance
     FROM deliveries ORDER BY created_at DESC`,
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
    id: string;
    plate: string;
    type: string;
    driver_name: string;
    capacity: string;
    status: string;
    last_maintenance: string | null;
  }>(
    `SELECT id, plate, type, driver_name, capacity, status, last_maintenance::text
     FROM vehicles ORDER BY created_at DESC`,
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
    id: string;
    name: string;
    type: string;
    district: string;
    contact_person: string;
    phone: string;
    status: string;
    since: string;
    total_orders: number;
    total_value: string;
  }>(
    `SELECT id, name, type, district, contact_person, phone, status,
            since::text, total_orders, total_value::text
     FROM partners ORDER BY created_at DESC`,
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

export const getFnbData = createServerFn({ method: "GET" }).handler(
  async (): Promise<FnbCategory[]> => {
    await requireAdmin();
    const pool = getDatabasePool();
    const result = await pool.query<{
      category_id: string;
      category_name: string;
      icon: string;
      product_id: string | null;
      product_name: string | null;
      price: string | null;
      stock: string | null;
      sold: string | null;
      status: string | null;
    }>(
      `SELECT c.id::text AS category_id, c.name AS category_name, c.icon,
            p.id::text AS product_id, p.name AS product_name, p.price::text,
            p.stock::text, p.sold::text, p.status
     FROM fnb_categories c
     LEFT JOIN fnb_products p ON p.category_id = c.id
     ORDER BY c.id, p.id`,
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
  },
);

// ─── WhatsApp Orders ──────────────────────────────────────────────
export const getWhatsappOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    customer: string;
    phone: string;
    product: string;
    amount: string;
    status: string;
    ordered_at: string;
  }>(
    `SELECT id, customer, phone, product, amount::text, status,
            to_char(ordered_at, 'YYYY-MM-DD HH24:MI') AS ordered_at
     FROM whatsapp_orders ORDER BY ordered_at DESC`,
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
    id: string;
    title: string;
    type: string;
    status: string;
    author: string;
    last_updated: string;
  }>(
    `SELECT id, title, type, status, author, last_updated::text
     FROM content_pages ORDER BY updated_at DESC`,
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
    `SELECT district, COUNT(*)::text AS total FROM farmers GROUP BY district ORDER BY COUNT(*) DESC`,
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
       ORDER BY date_trunc('month', order_date)`,
    ),
    pool.query<{ month: string; farmers_reached: string; trained: string }>(
      `SELECT to_char(date_trunc('month', registered_date), 'Mon') AS month,
              COUNT(*)::text AS farmers_reached,
              SUM(trainings_attended)::text AS trained
       FROM farmers
       WHERE registered_date >= date_trunc('month', CURRENT_DATE) - interval '11 months'
       GROUP BY date_trunc('month', registered_date)
       ORDER BY date_trunc('month', registered_date)`,
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

// ─── Team Members CRUD ──────────────────────────────────────────────
const teamMemberPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  expertise: z.string().trim().min(2).max(120),
  imageUrl: z.string().trim().nullable().optional(),
  displayOrder: z.number().int().default(0),
  biography: z.string().trim().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  email: z.string().trim().nullable().optional(),
  socialMedia: z.string().trim().nullable().optional(),
});

export const getTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    name: string;
    role: string;
    expertise: string;
    image_url: string | null;
    display_order: number;
    biography: string | null;
    phone: string | null;
    email: string | null;
    social_media: string | null;
  }>(
    `SELECT id, name, role, expertise, image_url, display_order, biography, phone, email, social_media
     FROM team_members
     ORDER BY display_order ASC, created_at DESC`
  );
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    expertise: row.expertise,
    imageUrl: row.image_url,
    displayOrder: row.display_order,
    biography: row.biography,
    phone: row.phone,
    email: row.email,
    socialMedia: row.social_media,
  }));
});

export const createTeamMember = createServerFn({ method: "POST" })
  .validator(teamMemberPayloadSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const id = "t-" + Math.random().toString(36).slice(2, 10);
    const result = await pool.query(
      `INSERT INTO team_members (id, name, role, expertise, image_url, display_order, biography, phone, email, social_media)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, role, expertise, image_url AS "imageUrl", display_order AS "displayOrder", biography, phone, email, social_media AS "socialMedia"`,
      [
        id,
        data.name,
        data.role,
        data.expertise,
        data.imageUrl || null,
        data.displayOrder,
        data.biography || null,
        data.phone || null,
        data.email || null,
        data.socialMedia || null,
      ]
    );

    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["content", `Added team member ${data.name}`, "user-plus"]
    );

    return result.rows[0];
  });

export const updateTeamMember = createServerFn({ method: "POST" })
  .validator(
    teamMemberPayloadSchema.extend({
      id: z.string().trim().min(1),
    })
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();
    const result = await pool.query(
      `UPDATE team_members
       SET name = $2, role = $3, expertise = $4, image_url = $5, display_order = $6,
           biography = $7, phone = $8, email = $9, social_media = $10, updated_at = now()
       WHERE id = $1
       RETURNING id, name, role, expertise, image_url AS "imageUrl", display_order AS "displayOrder", biography, phone, email, social_media AS "socialMedia"`,
      [
        data.id,
        data.name,
        data.role,
        data.expertise,
        data.imageUrl || null,
        data.displayOrder,
        data.biography || null,
        data.phone || null,
        data.email || null,
        data.socialMedia || null,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error("Team member not found");
    }

    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["content", `Updated team member ${data.name}`, "edit"]
    );

    return result.rows[0];
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const pool = getDatabasePool();

    const nameRes = await pool.query<{ name: string }>(
      "SELECT name FROM team_members WHERE id = $1",
      [data.id]
    );
    const name = nameRes.rows[0]?.name || data.id;

    const result = await pool.query(
      "DELETE FROM team_members WHERE id = $1 RETURNING id",
      [data.id]
    );
    if (result.rowCount === 0) {
      throw new Error("Team member not found");
    }

    await pool.query(
      "INSERT INTO activity_feed(type, message, icon) VALUES ($1, $2, $3)",
      ["content", `Deleted team member ${name}`, "user-minus"]
    );

    return { id: data.id };
  });

export const getLoggedInFarmer = createServerFn({ method: "GET" }).handler(async () => {
  const { getCurrentUser } = await import("./auth.server");
  const user = await getCurrentUser();
  if (!user) return null;

  const pool = getDatabasePool();
  const result = await pool.query<{
    id: string;
    name: string;
    phone: string;
    email: string;
    district: string;
    sector: string | null;
    farm_name: string;
    farm_size: string | null;
  }>(
    `SELECT id, name, phone, email, district, sector, farm_name, farm_size 
     FROM farmers 
     WHERE email = $1 LIMIT 1`,
    [user.email.toLowerCase()]
  );
  if (result.rows.length === 0) {
    return {
      id: user.id,
      name: user.displayName,
      phone: "",
      email: user.email,
      district: "Kigali",
      sector: null,
      farmName: user.displayName + " Farm",
      farmSize: null,
    };
  }
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    phone: result.rows[0].phone,
    email: result.rows[0].email,
    district: result.rows[0].district,
    sector: result.rows[0].sector,
    farmName: result.rows[0].farm_name,
    farmSize: result.rows[0].farm_size,
  };
});

export const registerFarmer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2).max(100),
      email: z.string().trim().email().max(254),
      phone: z.string().min(8).max(20),
      district: z.string().min(2).max(50),
      sector: z.string().min(2).max(50),
      farmName: z.string().min(2).max(100),
      farmSize: z.string().min(1).max(50),
      password: z.string().min(10).max(128),
      products: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    const pool = getDatabasePool();
    const checkUser = await pool.query(
      "SELECT id FROM application_users WHERE email = $1",
      [data.email.toLowerCase()]
    );
    if (checkUser.rowCount && checkUser.rowCount > 0) {
      throw new Error("Email address is already registered.");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const passRes = await client.query<{ hash: string }>(
        "SELECT crypt($1, gen_salt('bf', 12)) AS hash",
        [data.password]
      );
      const passHash = passRes.rows[0].hash;

      const userInsert = await client.query<{ id: string }>(
        `INSERT INTO application_users (email, password_hash, display_name, role, status)
         VALUES ($1, $2, $3, 'farmer', 'suspended') RETURNING id`,
        [data.email.toLowerCase(), passHash, data.name]
      );
      const userId = userInsert.rows[0].id;

      await client.query(
        `INSERT INTO farmers (id, name, phone, email, district, sector, farm_name, farm_size, products, status, kyc_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', 'pending')`,
        [
          userId,
          data.name,
          data.phone,
          data.email.toLowerCase(),
          data.district,
          data.sector,
          data.farmName,
          data.farmSize,
          data.products,
        ]
      );

      await client.query(
        `INSERT INTO activity_feed (type, message, icon)
         VALUES ($1, $2, $3)`,
        [
          "users",
          `New farmer registration request from ${data.name} (${data.farmName})`,
          "user-plus",
        ]
      );

      await client.query("COMMIT");
      return { success: true };
    } catch (err: any) {
      await client.query("ROLLBACK");
      throw new Error(err.message || "Failed to register farmer account.");
    } finally {
      client.release();
    }
  });

export const updateFarmerStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      status: z.enum(["active", "pending", "suspended", "rejected"]),
    }),
  )
  .handler(async ({ data }) => {
    const { requireRole } = await import("./auth.server");
    const admin = await requireRole(["super_admin"]);

    const pool = getDatabasePool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const farmerRes = await client.query<{ name: string; email: string }>(
        "SELECT name, email FROM farmers WHERE id = $1 LIMIT 1",
        [data.id]
      );
      if (farmerRes.rowCount === 0) {
        throw new Error("Farmer not found");
      }
      const farmer = farmerRes.rows[0];

      let kycStatus = "pending";
      if (data.status === "active") kycStatus = "verified";
      else if (data.status === "rejected") kycStatus = "failed";

      await client.query(
        `UPDATE farmers 
         SET status = $1, kyc_status = $2, updated_at = now() 
         WHERE id = $3`,
        [data.status, kycStatus, data.id]
      );

      let userStatus = "suspended";
      if (data.status === "active") userStatus = "active";
      else if (data.status === "suspended") userStatus = "suspended";
      else if (data.status === "rejected") userStatus = "disabled";

      await client.query(
        `UPDATE application_users 
         SET status = $1, updated_at = now() 
         WHERE email = $2`,
        [userStatus, farmer.email.toLowerCase()]
      );

      await client.query(
        `INSERT INTO activity_feed (type, message, icon)
         VALUES ($1, $2, $3)`,
        [
          "users",
          `${admin.displayName} updated status of farmer ${farmer.name} to ${data.status}`,
          "user-check",
        ]
      );

      await client.query("COMMIT");
      return { success: true };
    } catch (err: any) {
      await client.query("ROLLBACK");
      throw new Error(err.message || "Failed to update farmer status.");
    } finally {
      client.release();
    }
  });

