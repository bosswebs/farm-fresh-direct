import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Search, Package, Plus, CheckCircle, XCircle, Pause, Star,
  Eye, Edit, Trash2, MoreHorizontal, Filter, Download, MapPin, Leaf, X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { formatRWF, getStatusColor, type Product, type ProductStatus } from "../../../lib/admin-data";
import {
  getProducts,
  getFarmers,
  createProduct,
  updateProduct,
  updateProductStatus,
  bulkUpdateProductStatus,
  deleteProduct
} from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/marketplace/products")({
  loader: async () => {
    const [products, farmers] = await Promise.all([getProducts(), getFarmers()]);
    return { products, farmers };
  },
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

const inputClass =
  "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

function ProductsPage() {
  const { products: loadedProducts, farmers } = Route.useLoaderData();
  const router = useRouter();
  const [products, setProducts] = useState(loadedProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Vegetables",
    description: "",
    farmerId: "",
    price: 0,
    quantity: 0,
    unit: "kg",
    qualityStatus: "standard" as Product["qualityStatus"],
    status: "pending" as ProductStatus,
    image: "🍎",
  });

  useEffect(() => {
    setProducts(loadedProducts);
  }, [loadedProducts]);

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

  function emptyForm() {
    return {
      name: "",
      category: "Vegetables",
      description: "",
      farmerId: farmers[0]?.id || "",
      price: 0,
      quantity: 0,
      unit: "kg",
      qualityStatus: "standard" as const,
      status: "pending" as const,
      image: "🍎",
    };
  }

  function formFromProduct(product: Product) {
    return {
      name: product.name,
      category: product.category,
      description: product.description || "",
      farmerId: product.farmerId,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      qualityStatus: product.qualityStatus,
      status: product.status,
      image: product.image,
    };
  }

  function openCreateForm() {
    setEditingProduct(null);
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setForm(formFromProduct(product));
    setFormError(null);
    setFormOpen(true);
  }

  async function refreshProducts() {
    await router.invalidate();
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingProduct) {
        const saved = await updateProduct({ data: { id: editingProduct.id, ...form } });
        setProducts((current) => current.map((p) => p.id === saved.id ? saved : p));
        toast.success(`Product "${saved.name}" was updated.`);
      } else {
        const saved = await createProduct({ data: form });
        setProducts((current) => [saved, ...current]);
        toast.success(`Product "${saved.name}" was added to marketplace.`);
      }
      setFormOpen(false);
      setEditingProduct(null);
      await refreshProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(product: Product, status: ProductStatus) {
    setBusyId(product.id);
    try {
      await updateProductStatus({ data: { id: product.id, status } });
      setProducts((current) => current.map((p) => p.id === product.id ? { ...p, status } : p));
      toast.success(`Product "${product.name}" status updated to ${status}.`);
      await refreshProducts();
      if (viewingProduct?.id === product.id) {
        setViewingProduct((current) => current ? { ...current, status } : null);
      }
    } catch {
      toast.error("Could not update product status.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleBulkAction(status: ProductStatus) {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    try {
      await bulkUpdateProductStatus({ data: { ids, status } });
      setProducts((current) => current.map((p) => ids.includes(p.id) ? { ...p, status } : p));
      toast.success(`Updated status of ${ids.length} products to ${status}.`);
      setSelected(new Set());
      await refreshProducts();
    } catch {
      toast.error("Could not update selected products.");
    }
  }

  async function deleteProductAction(product: Product) {
    if (!confirm(`Are you sure you want to delete product "${product.name}"?`)) return;
    setBusyId(product.id);
    try {
      await deleteProduct({ data: { id: product.id } });
      setProducts((current) => current.filter((p) => p.id !== product.id));
      toast.success(`Product "${product.name}" was deleted.`);
      if (viewingProduct?.id === product.id) {
        setViewingProduct(null);
      }
      await refreshProducts();
    } catch {
      toast.error("Could not delete product.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Product Management</h1>
          <p className="text-sm text-gray-500">Approve, feature, and manage all marketplace products</p>
        </div>
        <Button onClick={openCreateForm} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" />Add Product
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
        >
          All ({products.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize
              ${statusFilter === status ? "shadow-sm " + getStatusColor(status) : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
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
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-emerald-800">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("active")} className="border-emerald-300 text-emerald-700 h-7 text-xs gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspended")} className="border-amber-300 text-amber-700 h-7 text-xs gap-1.5">
              <Pause className="w-3.5 h-3.5" /> Suspend All
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("rejected")} className="border-red-300 text-red-700 h-7 text-xs gap-1.5">
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
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every((p) => selected.has(p.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(new Set([...selected, ...filtered.map((p) => p.id)]));
                      } else {
                        const next = new Set(selected);
                        filtered.forEach((p) => next.delete(p.id));
                        setSelected(next);
                      }
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
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
                const quality = qualityBadge[product.qualityStatus as keyof typeof qualityBadge] || qualityBadge.standard;
                const actions = statusActions[product.status as ProductStatus] || {};
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50/60 transition-colors ${selected.has(product.id) ? "bg-emerald-50/40" : ""} ${busyId === product.id ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <td className="pl-6 pr-3 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
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
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => setViewingProduct(product)}><Eye className="w-3.5 h-3.5" />View Product</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => openEditForm(product)}><Edit className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {actions.approve && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-emerald-700" onClick={() => changeStatus(product, "active")}><CheckCircle className="w-3.5 h-3.5" />Approve</DropdownMenuItem>
                          )}
                          {actions.feature && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-indigo-700" onClick={() => changeStatus(product, "featured")}><Star className="w-3.5 h-3.5" />Feature</DropdownMenuItem>
                          )}
                          {actions.unfeature && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-gray-700" onClick={() => changeStatus(product, "active")}><Star className="w-3.5 h-3.5" />Unfeature</DropdownMenuItem>
                          )}
                          {actions.suspend && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-amber-700" onClick={() => changeStatus(product, "suspended")}><Pause className="w-3.5 h-3.5" />Suspend</DropdownMenuItem>
                          )}
                          {actions.reject && (
                            <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600" onClick={() => changeStatus(product, "rejected")}><XCircle className="w-3.5 h-3.5" />Reject</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-600" onClick={() => deleteProductAction(product)}><Trash2 className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
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

      {formOpen && (
        <ProductFormModal
          form={form}
          mode={editingProduct ? "edit" : "create"}
          error={formError}
          saving={saving}
          farmers={farmers}
          onChange={setForm}
          onSubmit={submitForm}
          onClose={() => {
            if (!saving) setFormOpen(false);
          }}
        />
      )}

      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          busy={busyId === viewingProduct.id}
          onClose={() => setViewingProduct(null)}
          onEdit={() => {
            setViewingProduct(null);
            openEditForm(viewingProduct);
          }}
          onStatusChange={(status) => changeStatus(viewingProduct, status)}
        />
      )}
    </div>
  );
}

interface ProductFormModalProps {
  form: {
    name: string;
    category: string;
    description: string;
    farmerId: string;
    price: number;
    quantity: number;
    unit: string;
    qualityStatus: Product["qualityStatus"];
    status: ProductStatus;
    image: string;
  };
  mode: "create" | "edit";
  error: string | null;
  saving: boolean;
  farmers: Array<{ id: string; name: string; farmName: string }>;
  onChange: (val: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

function ProductFormModal({
  form,
  mode,
  error,
  saving,
  farmers,
  onChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const emojis = ["🍎", "🥬", "🌽", "🥔", "🫘", "🥛", "🍯", "🍌", "🥕", "🍓", "🧅", "🍍", "🥑", "📦"];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name">
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => onChange({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Fresh Red Apples"
              />
            </Field>

            <Field label="Farmer / Producer">
              <select
                required
                value={form.farmerId}
                onChange={(e) => onChange({ ...form, farmerId: e.target.value })}
                className={inputClass}
              >
                <option value="" disabled>Select a Farmer</option>
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.farmName || "No Farm Name"})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => onChange({ ...form, category: e.target.value })}
                className={inputClass}
              >
                <option value="Vegetables">Vegetables 🥬</option>
                <option value="Fruits">Fruits 🍎</option>
                <option value="Grains & Cereals">Grains & Cereals 🌾</option>
                <option value="Tubers & Roots">Tubers & Roots 🥔</option>
                <option value="Beans & Legumes">Beans & Legumes 🫘</option>
                <option value="Dairy">Dairy 🥛</option>
                <option value="Honey">Honey 🍯</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Price (RWF)">
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price || ""}
                  onChange={(e) => onChange({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                  placeholder="Price"
                />
              </Field>
              <Field label="Unit">
                <select
                  value={form.unit}
                  onChange={(e) => onChange({ ...form, unit: e.target.value })}
                  className={inputClass}
                >
                  <option value="kg">kg</option>
                  <option value="crate">crate</option>
                  <option value="sac">sac</option>
                  <option value="ton">ton</option>
                  <option value="piece">piece</option>
                  <option value="liter">liter</option>
                  <option value="box">box</option>
                </select>
              </Field>
            </div>

            <Field label="Quantity In Stock">
              <input
                required
                type="number"
                min="0"
                step="0.001"
                value={form.quantity || ""}
                onChange={(e) => onChange({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                placeholder="Quantity"
              />
            </Field>

            <Field label="Quality Status">
              <select
                value={form.qualityStatus}
                onChange={(e) => onChange({ ...form, qualityStatus: e.target.value as any })}
                className={inputClass}
              >
                <option value="standard">Standard</option>
                <option value="certified_organic">Certified Organic 🌿</option>
                <option value="quality_verified">Quality Verified ✓</option>
                <option value="food_safety_approved">Food Safe 🛡</option>
              </select>
            </Field>

            <Field label="Product Status">
              <select
                value={form.status}
                onChange={(e) => onChange({ ...form, status: e.target.value as any })}
                className={inputClass}
              >
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="featured">Featured</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </Field>

            <Field label="Select Icon / Emoji">
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50/50">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onChange({ ...form, image: emoji })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-emerald-50 transition-all border ${
                      form.image === emoji ? "border-emerald-500 bg-emerald-50 scale-110 shadow-sm" : "border-transparent bg-white"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Product Description">
            <textarea
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              className={`${inputClass} h-20 resize-none`}
              placeholder="Provide a detailed description of the product (origin, harvest conditions, etc.)."
            />
          </Field>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Saving..." : mode === "create" ? "Add Product" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-gray-700 flex flex-col">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ProductDetailModal({
  product,
  onClose,
  onEdit,
  onStatusChange,
  busy,
}: {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: ProductStatus) => void;
  busy: boolean;
}) {
  const quality = qualityBadge[product.qualityStatus] || qualityBadge.standard;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shadow-sm">
              {product.image}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 font-display truncate">
                {product.name}
              </h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${quality.color}`}>
                  {quality.label}
                </span>
                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border capitalize ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailField label="Product ID" value={product.id} />
          <DetailField label="Category" value={product.category} />
          <DetailField label="Farmer" value={product.farmer} />
          <DetailField label="Location" value={product.district} />
          <DetailField label="Price" value={`${product.price.toLocaleString()} RWF / ${product.unit}`} />
          <DetailField label="Quantity" value={`${product.quantity.toLocaleString()} ${product.unit}`} />
          <DetailField label="Total Sales" value={`${product.sales.toLocaleString()} units`} />
          <DetailField label="Listed Date" value={product.listedDate} />
        </div>

        {product.description && (
          <div className="mt-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="text-[10px] font-semibold uppercase text-gray-400">Description</div>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
          <Button variant="outline" className="gap-2" onClick={onEdit}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>

          {product.status !== "active" && (
            <Button
              variant="outline"
              className="gap-2 text-emerald-600 hover:text-emerald-700 border-emerald-200 bg-emerald-50/30"
              onClick={() => onStatusChange("active")}
              disabled={busy}
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
          )}

          {product.status !== "featured" && product.status === "active" && (
            <Button
              variant="outline"
              className="gap-2 text-indigo-600 hover:text-indigo-700 border-indigo-200 bg-indigo-50/30"
              onClick={() => onStatusChange("featured")}
              disabled={busy}
            >
              <Star className="w-4 h-4" />
              Feature
            </Button>
          )}

          {product.status === "featured" && (
            <Button
              variant="outline"
              className="gap-2 text-gray-600 hover:text-gray-700 border-gray-200 bg-gray-50/30"
              onClick={() => onStatusChange("active")}
              disabled={busy}
            >
              <Star className="w-4 h-4" />
              Unfeature
            </Button>
          )}

          {product.status !== "suspended" && (
            <Button
              variant="outline"
              className="gap-2 text-amber-600 hover:text-amber-700 border-amber-200 bg-amber-50/30"
              onClick={() => onStatusChange("suspended")}
              disabled={busy}
            >
              <Pause className="w-4 h-4" />
              Suspend
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
      <div className="text-[10px] font-semibold uppercase text-gray-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
}
