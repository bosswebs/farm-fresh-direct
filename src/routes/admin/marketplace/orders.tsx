import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Clock, CheckCircle, Truck, XCircle, Package,
  Eye, MoreHorizontal, RefreshCw, MapPin, CreditCard, Download
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { orders, formatRWF, getStatusColor, type Order } from "../../../lib/admin-data";

export const Route = createFileRoute("/admin/marketplace/orders")({
  component: OrdersPage,
});

const paymentMethodLabels: Record<Order["paymentMethod"], string> = {
  mtn_momo: "MTN MoMo",
  airtel_money: "Airtel Money",
  bank_transfer: "Bank Transfer",
  card: "Card",
};

const paymentMethodColors: Record<Order["paymentMethod"], string> = {
  mtn_momo: "bg-yellow-50 text-yellow-700 border-yellow-200",
  airtel_money: "bg-red-50 text-red-700 border-red-200",
  bank_transfer: "bg-blue-50 text-blue-700 border-blue-200",
  card: "bg-purple-50 text-purple-700 border-purple-200",
};

const statusPipeline = [
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle, color: "text-teal-600" },
  { key: "processing", label: "Processing", icon: RefreshCw, color: "text-purple-600" },
  { key: "in_transit", label: "In Transit", icon: Truck, color: "text-blue-600" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "text-emerald-600" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600" },
];

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = statusPipeline.reduce(
    (acc, s) => ({ ...acc, [s.key]: orders.filter((o) => o.status === s.key).length }),
    {} as Record<string, number>
  );

  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Order Management</h1>
          <p className="text-sm text-gray-500">Track and manage all marketplace orders</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export Orders</Button>
      </div>

      {/* Order Pipeline */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statusPipeline.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-sm
                ${statusFilter === s.key ? "border-emerald-400 bg-emerald-50 shadow-sm" : "bg-white border-gray-100"}`}
            >
              <Icon className={`w-5 h-5 ${s.color}`} />
              <div className="text-xl font-bold text-gray-800 font-display">{statusCounts[s.key] ?? 0}</div>
              <div className="text-[10px] text-gray-500 text-center">{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Revenue Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Total Revenue (Paid)</div>
          <div className="text-xl font-bold text-emerald-700 font-display">{formatRWF(totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Total Orders</div>
          <div className="text-xl font-bold text-gray-800 font-display">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Avg Order Value</div>
          <div className="text-xl font-bold text-gray-800 font-display">{formatRWF(Math.round(totalRevenue / orders.length))}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Refund Requests</div>
          <div className="text-xl font-bold text-red-600 font-display">{orders.filter((o) => o.paymentStatus === "refunded").length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID, buyer, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Buyer</th>
                <th className="px-4 py-3 text-left">Farmer · Product</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Payment Status</th>
                <th className="px-4 py-3 text-left">Order Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-medium text-gray-700">{order.id}</td>
                  <td className="px-4 py-4 text-xs text-gray-700 max-w-[130px]">
                    <div className="truncate font-medium">{order.buyer}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-medium text-gray-800 truncate max-w-[130px]">{order.product}</div>
                    <div className="text-[10px] text-gray-400">{order.farmer}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />{order.district}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-gray-800">{formatRWF(order.total)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${paymentMethodColors[order.paymentMethod]}`}>
                      {paymentMethodLabels[order.paymentMethod]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{order.orderDate}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><Eye className="w-3.5 h-3.5" />View Order</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><Package className="w-3.5 h-3.5" />Update Status</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><CreditCard className="w-3.5 h-3.5" />Refund</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600"><XCircle className="w-3.5 h-3.5" />Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">Showing {filtered.length} of {orders.length} orders</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-emerald-600 text-white border-emerald-600">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
