import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Package, AlertTriangle, CheckCircle, XCircle, Plus, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getFnbData } from "../../lib/admin-data.server";

export const Route = createFileRoute("/admin/fnb")({
  loader: () => getFnbData(),
  component: FnBPage,
});

function FnBPage() {
  const fnbCategories = Route.useLoaderData();
  const [activeCategory, setActiveCategory] = useState(fnbCategories[0]?.name ?? "");
  const category = fnbCategories.find((c) => c.name === activeCategory);

  const statusIcon = (status: string) => {
    if (status === "active") return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === "low_stock") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "text-emerald-700 bg-emerald-50 border-emerald-200",
      low_stock: "text-amber-700 bg-amber-50 border-amber-200",
      out_of_stock: "text-red-700 bg-red-50 border-red-200",
    };
    return map[status] ?? "text-gray-600 bg-gray-50 border-gray-200";
  };

  const totalProducts = fnbCategories.reduce((sum, c) => sum + c.products.length, 0);
  const totalSold = fnbCategories.reduce((sum, c) => sum + c.products.reduce((s, p) => s + p.sold, 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Food & Beverage Store</h1>
          <p className="text-sm text-gray-500">Manage Deacomart branded food and beverage products</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><Plus className="w-4 h-4" />Add Product</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-gray-900 font-display">{totalProducts}</div>
          <div className="text-xs text-gray-400">Total Products</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-700 font-display">{totalSold.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Units Sold</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-amber-700 font-display">
            {fnbCategories.reduce((sum, c) => sum + c.products.filter((p) => p.status === "low_stock").length, 0)}
          </div>
          <div className="text-xs text-amber-600">Low Stock</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-700 font-display">
            {fnbCategories.reduce((sum, c) => sum + c.products.filter((p) => p.status === "out_of_stock").length, 0)}
          </div>
          <div className="text-xs text-red-500">Out of Stock</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {fnbCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${activeCategory === cat.name
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-white/20" : "bg-gray-100"}`}>
              {cat.products.length}
            </span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {category?.products.map((product, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl">
                  {category.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {statusIcon(product.status)}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge(product.status)}`}>
                      {product.status === "low_stock" ? "Low Stock" : product.status === "out_of_stock" ? "Out of Stock" : "In Stock"}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Edit className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-base font-bold text-gray-800 font-display">
                  {product.price.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">RWF / unit</div>
              </div>
              <div className="text-center">
                <div className={`text-base font-bold font-display ${product.stock === 0 ? "text-red-600" : product.stock < 100 ? "text-amber-600" : "text-emerald-700"}`}>
                  {product.stock}
                </div>
                <div className="text-[10px] text-gray-400">In Stock</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-blue-700 font-display">{product.sold.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400">Sold</div>
              </div>
            </div>

            {/* Stock Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Stock Level</span>
                <span>{product.stock > 0 ? `${Math.min(Math.round((product.stock / (product.stock + product.sold)) * 100), 100)}%` : "0%"}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${product.stock === 0 ? "bg-red-400" : product.stock < 100 ? "bg-amber-400" : "bg-emerald-500"}`}
                  style={{ width: `${product.stock > 0 ? Math.min(Math.round((product.stock / (product.stock + product.sold)) * 100), 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
