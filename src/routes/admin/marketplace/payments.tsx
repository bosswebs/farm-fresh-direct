import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, CreditCard, RefreshCw, Download, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "../../../components/ui/button";
import { orders, formatRWF, revenueData } from "../../../lib/admin-data";

export const Route = createFileRoute("/admin/marketplace/payments")({
  component: PaymentsPage,
});

const paymentBreakdown = [
  { method: "MTN MoMo", count: 124, amount: 18_400_000, color: "#f59e0b" },
  { method: "Airtel Money", count: 87, amount: 12_300_000, color: "#ef4444" },
  { method: "Bank Transfer", count: 53, amount: 28_500_000, color: "#3b82f6" },
  { method: "Card", count: 32, amount: 9_250_000, color: "#8b5cf6" },
];

function PaymentsPage() {
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const totalRefunds = orders.filter((o) => o.paymentStatus === "refunded").reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Payments & Transactions</h1>
          <p className="text-sm text-gray-500">Financial overview, transaction history, and payment analytics</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export Report</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatRWF(totalRevenue), icon: DollarSign, color: "from-emerald-500 to-emerald-700", sub: "All time paid" },
          { label: "Monthly Revenue", value: "RWF 68.5M", icon: TrendingUp, color: "from-blue-500 to-blue-700", sub: "+22% vs last month" },
          { label: "Pending Payments", value: formatRWF(18_000), icon: CreditCard, color: "from-amber-500 to-amber-600", sub: "1 order" },
          { label: "Total Refunds", value: formatRWF(totalRefunds), icon: RefreshCw, color: "from-red-500 to-red-600", sub: "1 refunded order" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3 shadow-sm`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-900 font-display">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-gray-400 mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [formatRWF(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Payment Method Breakdown</h2>
          <div className="flex gap-6 items-center">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={paymentBreakdown} dataKey="amount" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={2}>
                  {paymentBreakdown.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [formatRWF(v)]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {paymentBreakdown.map((p) => (
                <div key={p.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-xs text-gray-600">{p.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-800">{formatRWF(p.amount)}</div>
                    <div className="text-[10px] text-gray-400">{p.count} txns</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display">Transaction History</h2>
          <span className="text-xs text-gray-400">{orders.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Buyer</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const methodColor: Record<string, string> = {
                  mtn_momo: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  airtel_money: "bg-red-50 text-red-700 border-red-200",
                  bank_transfer: "bg-blue-50 text-blue-700 border-blue-200",
                  card: "bg-purple-50 text-purple-700 border-purple-200",
                };
                const methodLabel: Record<string, string> = {
                  mtn_momo: "MTN MoMo", airtel_money: "Airtel", bank_transfer: "Bank", card: "Card",
                };
                const paymentStatusColor: Record<string, string> = {
                  paid: "text-emerald-700 bg-emerald-50 border-emerald-200",
                  pending: "text-amber-700 bg-amber-50 border-amber-200",
                  refunded: "text-red-700 bg-red-50 border-red-200",
                  failed: "text-red-700 bg-red-50 border-red-200",
                };
                return (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3 text-xs font-mono font-medium text-gray-700">{order.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 truncate max-w-[130px]">{order.buyer}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[110px]">{order.product}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-gray-800">{formatRWF(order.total)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${methodColor[order.paymentMethod]}`}>
                        {methodLabel[order.paymentMethod]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${paymentStatusColor[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{order.orderDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
