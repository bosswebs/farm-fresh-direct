import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Filter, UserCheck, UserX, Eye, CheckCircle, XCircle,
  Pause, Star, MapPin, Phone, Mail, Leaf, TrendingUp, Clock,
  Award, MoreHorizontal, Download, RefreshCw
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { formatRWF, getStatusColor, type Farmer } from "../../../lib/admin-data";
import { getFarmers } from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/users/farmers")({
  loader: () => getFarmers(),
  component: FarmersPage,
});

function KycBadge({ status }: { status: Farmer["kycStatus"] }) {
  const map = {
    verified: "text-emerald-700 bg-emerald-50 border-emerald-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    failed: "text-red-700 bg-red-50 border-red-200",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {status === "verified" ? "✓ KYC Verified" : status === "pending" ? "⏳ KYC Pending" : "✗ KYC Failed"}
    </span>
  );
}

function QualityBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-7">{score}</span>
    </div>
  );
}

function FarmersPage() {
  const farmers = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = farmers.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.farmName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const stats = {
    total: farmers.length,
    active: farmers.filter((f) => f.status === "active").length,
    pending: farmers.filter((f) => f.status === "pending").length,
    suspended: farmers.filter((f) => f.status === "suspended").length,
  };

  if (farmers.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 font-display mb-2">Farmer Management</h1>
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">No farmers registered yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Farmer Management</h1>
          <p className="text-sm text-gray-500">Manage farmer registrations, KYC verification, and profiles</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Leaf className="w-4 h-4" />
          Register Farmer
        </Button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: stats.total.toLocaleString(), color: "text-gray-800", bg: "bg-white" },
          { label: "Active", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Pending KYC", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Suspended", value: stats.suspended, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 shadow-sm`}>
            <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search farmers by name, district, or farm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "pending", "suspended"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border
                ${statusFilter === s
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-emerald-800">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 h-7 text-xs gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 h-7 text-xs gap-1.5">
              <UserX className="w-3.5 h-3.5" /> Suspend All
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="pl-6 pr-3 py-3 text-left w-8">
                  <input type="checkbox" className="rounded" onChange={() => {}} />
                </th>
                <th className="px-3 py-3 text-left">Farmer</th>
                <th className="px-3 py-3 text-left">Farm & Location</th>
                <th className="px-3 py-3 text-left">KYC</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-right">Sales</th>
                <th className="px-3 py-3 text-left">Performance</th>
                <th className="px-3 py-3 text-left">Training</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((farmer) => (
                <tr
                  key={farmer.id}
                  className={`hover:bg-gray-50/60 transition-colors ${selected.has(farmer.id) ? "bg-emerald-50/40" : ""}`}
                >
                  <td className="pl-6 pr-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(farmer.id)}
                      onChange={() => toggleSelect(farmer.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {farmer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm font-medium text-gray-800">{farmer.farmName}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {farmer.sector}, {farmer.district} · {farmer.farmSize}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {farmer.products.slice(0, 2).map((p) => (
                        <span key={p} className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <KycBadge status={farmer.kycStatus} />
                  </td>
                  <td className="px-3 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${getStatusColor(farmer.status)}`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-800">
                      {farmer.totalSales > 0 ? formatRWF(farmer.totalSales) : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-4 min-w-[120px]">
                    {farmer.performanceScore > 0 ? (
                      <QualityBar score={farmer.performanceScore} />
                    ) : (
                      <span className="text-xs text-gray-400">No data</span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Award className="w-3.5 h-3.5 text-violet-400" />
                      {farmer.trainingsAttended} sessions
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm">
                          <Eye className="w-3.5 h-3.5" /> View Profile
                        </DropdownMenuItem>
                        {farmer.status === "pending" && (
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </DropdownMenuItem>
                        )}
                        {farmer.status === "active" && (
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-amber-700">
                            <Pause className="w-3.5 h-3.5" /> Suspend
                          </DropdownMenuItem>
                        )}
                        {farmer.status === "suspended" && (
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-emerald-700">
                            <RefreshCw className="w-3.5 h-3.5" /> Reactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">
            Showing {filtered.length} of {farmers.length} farmer{farmers.length !== 1 ? "s" : ""}
          </span>
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
