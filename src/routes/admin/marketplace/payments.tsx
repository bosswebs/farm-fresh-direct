import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, CreditCard, RefreshCw, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "../../../components/ui/button";
import { formatRWF } from "../../../lib/admin-data";
import { getPayments, getReportData } from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/marketplace/payments")({
  loader: async () => {
    const [payments, report] = await Promise.all([getPayments(), getReportData()]);
    return { payments, revenueData: report.revenueData };
  },
  component: PaymentsPage,
});

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
const PIE_COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

function PaymentsPage() {
  const { payments, revenueData } = Route.useLoaderData();

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalRefunds = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  // Aggregate by payment method
  const methodMap = new Map<string, { count: number; amount: number }>();
  for (const p of payments) {
    const cur = methodMap.get(p.method) ?? { count: 0, amount: 0 };
    methodMap.set(p.method, { count: cur.count + 1, amount: cur.amount + p.amount });
  }
  const paymentBreakdown = [
    { method: "MTN MoMo", key: "mtn_momo", color: PIE_COLORS[0] },
    { method: "Airtel Money", key: "airtel_money", color: PIE_COLORS[1] },
    { method: "Bank Transfer", key: "bank_transfer", color: PIE_COLORS[2] },
    { method: "Card", key: "card", color: PIE_COLORS[3] },
  ].map((m) => ({
    ...m,
    count: methodMap.get(m.key)?.count ?? 0,
    amount: methodMap.get(m.key)?.amount ?? 0,
  })).filter((m) => m.count > 0);

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
          { label: "Total Revenue", value: formatRWF(totalRevenue), icon: DollarSign, color: "from-emerald-500 to-emerald-700", sub: `${payments.filter((p) => p.status === "paid").length} paid transactions` },
          { label: "Monthly Revenue", value: formatRWF(revenueData.reduce((s, r) => s + r.revenue, 0)), icon: TrendingUp, color: "from-blue-500 to-blue-700", sub: "From orders this period" },
          { label: "Pending Payments", value: formatRWF(pendingAmount), icon: CreditCard, color: "from-amber-500 to-amber-600", sub: `${pendingCount} pending` },
          { label: "Total Refunds", value: formatRWF(totalRefunds), icon: RefreshCw, color: "from-red-500 to-red-600", sub: `${payments.filter((p) => p.status === "refunded").length} refunded` },
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
          {revenueData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [formatRWF(v), "Revenue"]} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Payment Method Breakdown</h2>
          {paymentBreakdown.length === 0 ? (
            <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">No payment data yet</div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display">Transaction History</h2>
          <span className="text-xs text-gray-400">{payments.length} transactions</span>
        </div>
        {payments.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No transactions recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left">Txn ID</th>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Buyer</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3 text-xs font-mono font-medium text-gray-700">{p.id}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 truncate max-w-[100px]">{p.order_id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 truncate max-w-[120px]">{p.buyer_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[110px]">{p.product_name}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-gray-800">{formatRWF(p.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${methodColor[p.method] ?? ""}`}>
                        {methodLabel[p.method] ?? p.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${paymentStatusColor[p.status] ?? ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{p.paid_at ?? p.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
