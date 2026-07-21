import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Users, ShoppingBag, Package, TrendingUp, DollarSign, MapPin,
  GraduationCap, Briefcase, Handshake, Truck, Star, CheckCircle,
  Clock, AlertCircle, ArrowUpRight, Activity,
  Leaf, UserPlus, ShoppingCart, CreditCard, Award
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { getDashboardData, getRecentOrders } from "../../lib/admin-data.server";
import { formatRWF, getStatusColor } from "../../lib/admin-data";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const [dashboard, recentOrders] = await Promise.all([
      getDashboardData(),
      getRecentOrders(),
    ]);
    return { dashboard, recentOrders };
  },
  component: AdminDashboard,
});

// ─── KPI Card ─────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, trend, trendUp, color,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} shadow-sm group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900 font-display">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────
const quickActions = [
  { label: "Add Farmer", icon: UserPlus, path: "/admin/users/farmers", color: "bg-emerald-500 hover:bg-emerald-600" },
  { label: "Add Product", icon: Package, path: "/admin/marketplace/products", color: "bg-teal-500 hover:bg-teal-600" },
  { label: "New Order", icon: ShoppingCart, path: "/admin/marketplace/orders", color: "bg-blue-500 hover:bg-blue-600" },
  { label: "New Training", icon: GraduationCap, path: "/admin/training", color: "bg-violet-500 hover:bg-violet-600" },
  { label: "Careers & Hiring", icon: Briefcase, path: "/admin/careers", color: "bg-leaf hover:opacity-90" },
  { label: "View Reports", icon: TrendingUp, path: "/admin/reports", color: "bg-orange-500 hover:bg-orange-600" },
];

const pieColors = ["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6"];

const activityIcons: Record<string, React.ElementType> = {
  "user-plus": UserPlus, "shopping-cart": ShoppingCart, "check-circle": CheckCircle,
  "graduation-cap": GraduationCap, "dollar-sign": DollarSign, "truck": Truck,
  "briefcase": Briefcase, "handshake": Handshake,
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center text-sm text-gray-400">{message}</div>
  );
}

function AdminDashboard() {
  const { dashboard, recentOrders } = Route.useLoaderData();
  const { stats, revenueData, categoryPerformance, activityFeed, pendingFarmers, pendingProducts, geoStats } = dashboard;

  const now = new Date();
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  // Build province summary from district data
  const provinces = [
    { province: "Kigali City", districts: ["Gasabo", "Kicukiro", "Nyarugenge"], color: "from-emerald-500 to-emerald-600" },
    { province: "Northern Province", districts: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"], color: "from-teal-500 to-teal-600" },
    { province: "Southern Province", districts: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"], color: "from-blue-500 to-blue-600" },
    { province: "Eastern Province", districts: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"], color: "from-violet-500 to-violet-600" },
    { province: "Western Province", districts: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"], color: "from-orange-500 to-orange-600" },
  ].map((p) => {
    const farmers = geoStats
      .filter((g) => p.districts.includes(g.district))
      .reduce((sum, g) => sum + parseInt(g.total || "0", 10), 0);
    return { ...p, farmers, numDistricts: p.districts.length };
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Deacomart Ltd — Be EcoWise · Rwanda Agribusiness Ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Live · {monthLabel}
          </span>
          <Link to="/admin/reports" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <TrendingUp className="w-4 h-4" />
            Full Report
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <StatCard icon={Leaf} label="Registered Farmers" value={stats.totalFarmers.toLocaleString()} color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
        <StatCard icon={Users} label="Total Buyers" value={stats.totalBuyers.toLocaleString()} color="bg-gradient-to-br from-teal-500 to-teal-700" />
        <StatCard icon={Package} label="Active Products" value={stats.activeProducts.toLocaleString()} color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={ShoppingCart} label="Orders Today" value={stats.ordersToday} color="bg-gradient-to-br from-violet-500 to-violet-700" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={formatRWF(stats.monthlyRevenue)} sub={stats.monthlyRevenue > 0 ? formatRWF(stats.monthlyRevenue) : "No data yet"} color="bg-gradient-to-br from-orange-500 to-orange-600" />
        <StatCard icon={MapPin} label="Districts Covered" value={`${new Set(geoStats.map((g) => g.district)).size}/30`} sub="All Rwanda" color="bg-gradient-to-br from-rose-500 to-rose-600" />
        <StatCard icon={GraduationCap} label="Total Farmers" value={stats.totalFarmers.toLocaleString()} color="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard icon={Briefcase} label="Consultancy Requests" value={stats.consultancyRequests} color="bg-gradient-to-br from-cyan-500 to-cyan-700" />
        <StatCard icon={Handshake} label="Active Partnerships" value={stats.activePartnerships} color="bg-gradient-to-br from-amber-500 to-amber-600" />
        <StatCard icon={Truck} label="Deliveries Completed" value={stats.deliveryPerformance} color="bg-gradient-to-br from-green-600 to-green-800" />
        <StatCard icon={Star} label="Total Orders" value={stats.totalOrders.toLocaleString()} color="bg-gradient-to-br from-yellow-500 to-orange-500" />
        <StatCard icon={AlertCircle} label="Pending Approvals" value={stats.pendingApprovals} sub="Products & farmers" color="bg-gradient-to-br from-red-500 to-red-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 font-display">Revenue Analytics</h2>
              <p className="text-sm text-gray-400">Monthly revenue trend from confirmed orders</p>
            </div>
          </div>
          {revenueData.length === 0 ? (
            <EmptyState message="No order revenue data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(v: number) => [`RWF ${(v / 1_000_000).toFixed(1)}M`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 font-display">Category Performance</h2>
            <p className="text-sm text-gray-400">Revenue by product category</p>
          </div>
          {categoryPerformance.length === 0 ? (
            <EmptyState message="No product data yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryPerformance} dataKey="sales" nameKey="category" cx="50%" cy="50%" outerRadius={65} innerRadius={40} paddingAngle={2}>
                    {categoryPerformance.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [formatRWF(v)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryPerformance.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pieColors[i] }} />
                      <span className="text-gray-600">{c.category}</span>
                    </div>
                    <span className="font-medium text-gray-800">{formatRWF(c.sales)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bar Chart + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900 font-display">Top Selling Categories</h2>
              <p className="text-sm text-gray-400">Revenue per product category</p>
            </div>
          </div>
          {categoryPerformance.length === 0 ? (
            <EmptyState message="No category data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v: number) => [formatRWF(v), "Revenue"]} />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {categoryPerformance.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 font-display">Activity Feed</h2>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          {activityFeed.length === 0 ? (
            <EmptyState message="No recent activity" />
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-64">
              {activityFeed.map((item) => {
                const Icon = activityIcons[item.icon] ?? Activity;
                return (
                  <div key={item.id} className="flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 leading-relaxed">{item.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.occurred_at}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + Pending */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display">Recent Orders</h2>
            <Link to="/admin/marketplace/orders" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState message="No orders yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Buyer</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 text-xs font-mono font-medium text-gray-700">{order.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[140px] truncate">{order.buyer_name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">{order.product_name}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-800 text-right">{formatRWF(parseFloat(order.total))}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Approvals + Quick Actions */}
        <div className="space-y-4">
          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 font-display">Pending Approvals</h2>
              <Badge className="bg-amber-100 text-amber-700 text-xs border-0">{stats.pendingApprovals}</Badge>
            </div>
            <div className="space-y-2.5">
              {pendingFarmers.slice(0, 2).map((f) => (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{f.name}</p>
                      <p className="text-[10px] text-gray-400">{f.district} · Farmer</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded font-medium transition-colors">Review</button>
                </div>
              ))}
              {pendingProducts.slice(0, 2).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-bold">P</div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.district} · Product</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-blue-600 border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded font-medium transition-colors">Approve</button>
                </div>
              ))}
              {pendingFarmers.length === 0 && pendingProducts.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No pending approvals</p>
              )}
            </div>
            <Link to="/admin/marketplace/products" className="block text-center text-xs text-emerald-600 mt-3 font-medium">View all pending →</Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 font-display mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.path} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-white text-center transition-all hover:scale-105 active:scale-95 ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                  <span className="text-[10px] font-medium leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Coverage */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 font-display">Geographic Coverage</h2>
            <p className="text-sm text-gray-400">Farmer distribution across Rwanda's provinces</p>
          </div>
          <Link to="/admin/geographic" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Full Map View →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {provinces.map((p) => (
            <div key={p.province} className="bg-gradient-to-br rounded-xl overflow-hidden">
              <div className={`bg-gradient-to-br ${p.color} p-4 text-white`}>
                <div className="text-xl font-bold font-display">{p.farmers.toLocaleString()}</div>
                <div className="text-xs opacity-90 mt-0.5">Farmers</div>
              </div>
              <div className="p-3 bg-gray-50">
                <div className="text-xs font-medium text-gray-700">{p.province}</div>
                <div className="text-[10px] text-gray-400">{p.numDistricts} districts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
