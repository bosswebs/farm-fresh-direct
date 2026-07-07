import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Package, Plus, CheckCircle, XCircle, Pause, Star,
  Eye, Edit, Trash2, MoreHorizontal, Filter, Download, MapPin, Leaf
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { formatRWF, getStatusColor, type Product, type ProductStatus } from "../../../lib/admin-data";
import { getProducts } from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/marketplace/products")({
  loader: () => getProducts(),
  component: ProductsPage,
});

const qualityBadge: Record<Product["qualityStatus"], { label: string; color: string }> = {
  certified_organic: { label: "🌿 Certified Organic", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  quality_verified: { label: "✓ Quality Verified", color: "text-blue-700 bg-blue-50 border-blue-200" },
  food_safety_approved: { label: "🛡 Food Safe", color: "text-teal-700 bg-teal-50 border-teal-200" },
  standard: { label: "Standard", color: "text-gray-600 bg-gray-50 border-gray-200" },
};

const statusActions: Record<Product["status"], { approve?: boolean; reject?: boolean; suspend?: boolean; feature?: boolean; unfeature?: boolean }> = {
  pending: { approve: true, reject: true },
  active: { suspend: true, feature: true, reject: true },
  featured: { suspend: true, unfeature: true },
  suspended: { approve: true, reject: true },
  rejected: { approve: true },
};

function ProductsPage() {
  const products = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const statusCounts = {
    active: products.filter((p) => p.status === "active").length,
    pending: products.filter((p) => p.status === "pending").length,
    featured: products.filter((p) => p.status === "featured").length,
    suspended: products.filter((p) => p.status === "suspended").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Product Management</h1>
          <p className="text-sm text-gray-500">Approve, feature, and manage all marketplace products</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" />Add Product
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}
        >
          All ({products.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize
              ${statusFilter === status ? "shadow-sm " + getStatusColor(status) : "bg-white text-gray-600 border-gray-200"}`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, farmers, districts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Export</Button>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-emerald-800">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 h-7 text-xs gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 h-7 text-xs gap-1.5">
              <Pause className="w-3.5 h-3.5" /> Suspend All
            </Button>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 h-7 text-xs gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Reject All
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
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-3 py-3 text-left">Product</th>
                <th className="px-3 py-3 text-left">Category</th>
                <th className="px-3 py-3 text-left">Farmer</th>
                <th className="px-3 py-3 text-left">Location</th>
                <th className="px-3 py-3 text-right">Price</th>
                <th className="px-3 py-3 text-right">Qty</th>
                <th className="px-3 py-3 text-left">Quality</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-right">Sales</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => {
                const quality = qualityBadge[product.qualityStatus as keyof typeof qualityBadge];
                const actions = statusActions[product.status as ProductStatus];
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50/60 transition-colors ${selected.has(product.id) ? "bg-emerald-50/40" : ""}`}
                  >
                    <td className="pl-6 pr-3 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                          {product.image}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-600">{product.category}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        <Leaf className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-gray-700">{product.farmer}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />{product.district}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-right text-sm font-semibold text-gray-800">
                      {product.price.toLocaleString()} RWF<span className="text-xs font-normal text-gray-400">/{product.unit}</span>
                    </td>
                    <td className="px-3 py-4 text-right text-xs font-medium text-gray-700">
                      {product.quantity.toLocaleString()} {product.unit}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${quality.color}`}>
                        {quality.label}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border capitalize ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right text-xs font-medium text-gray-700">
                      {product.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><Eye className="w-3.5 h-3.5" />View Product</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm"><Edit className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {actions.approve && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-emerald-700"><CheckCircle className="w-3.5 h-3.5" />Approve</DropdownMenuItem>
                          )}
                          {actions.feature && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-indigo-700"><Star className="w-3.5 h-3.5" />Feature</DropdownMenuItem>
                          )}
                          {actions.unfeature && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-gray-700"><Star className="w-3.5 h-3.5" />Unfeature</DropdownMenuItem>
                          )}
                          {actions.suspend && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-amber-700"><Pause className="w-3.5 h-3.5" />Suspend</DropdownMenuItem>
                          )}
                          {actions.reject && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600"><XCircle className="w-3.5 h-3.5" />Reject</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600"><Trash2 className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400">Showing {filtered.length} of {products.length} products</span>
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
