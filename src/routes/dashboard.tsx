import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Upload, X, Package, DollarSign, TrendingUp,
  ImageIcon, MapPin, Tractor,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import {
  CATEGORIES, UNITS, formatRWF,
  createProduct, deleteProduct, fileToDataUrl, listProducts, subscribe, updateProduct,
  type Category, type Product, type ProductInput, type Unit,
} from "@/lib/products-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Inventory & Catalogue — Deacomart Ltd" },
      { name: "description", content: "Manage Deacomart's product catalogue, partner inventory, and pricing in real time." },
    ],
  }),
  component: Dashboard,
});

const FARMER_KEY = "deacomart.farmer.profile.v1";
type FarmerProfile = { name: string; farmName: string; location: string };
const DEFAULT_FARMER: FarmerProfile = {
  name: "Deacomart Ltd",
  farmName: "Deacomart Distribution",
  location: "Kigali, Rwanda",
};

function loadFarmer(): FarmerProfile {
  if (typeof window === "undefined") return DEFAULT_FARMER;
  try {
    const raw = window.localStorage.getItem(FARMER_KEY);
    if (!raw) return DEFAULT_FARMER;
    return { ...DEFAULT_FARMER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_FARMER;
  }
}
function saveFarmer(p: FarmerProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FARMER_KEY, JSON.stringify(p));
}

function emptyDraft(farmer: FarmerProfile): ProductInput {
  return {
    name: "",
    category: "Fresh Produce",
    description: "",
    price: 0,
    quantity: 0,
    unit: "Kg",
    location: farmer.location,
    farmerName: farmer.name,
    farmName: farmer.farmName,
    harvestDate: new Date().toISOString().slice(0, 10),
    image: "",
  };
}

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [farmer, setFarmer] = useState<FarmerProfile>(DEFAULT_FARMER);

  useEffect(() => {
    setProducts(listProducts());
    setFarmer(loadFarmer());
    return subscribe(() => setProducts(listProducts()));
  }, []);

  const stats = useMemo(() => {
    const totalListings = products.length;
    const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 20).length;
    return { totalListings, totalValue, lowStock };
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Inventory & Catalogue</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Manage Deacomart's stock.</h1>
            <p className="mt-2 text-muted-foreground">Add, edit, or remove products. Updates publish live to the Deacomart shop and WhatsApp catalogue.</p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
          >
            <Plus className="w-5 h-5" /> Add product
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 grid sm:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Active listings" value={stats.totalListings.toString()} />
        <StatCard icon={DollarSign} label="Inventory value" value={formatRWF(stats.totalValue)} />
        <StatCard icon={TrendingUp} label="Low-stock items" value={stats.lowStock.toString()} accent />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Your listings</h2>
            <span className="text-sm text-muted-foreground">{products.length} total</span>
          </div>

          {products.length === 0 ? (
            <div className="p-16 text-center">
              <Tractor className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="mt-4 font-semibold">No products yet.</p>
              <button onClick={() => setCreating(true)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add your first product
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.map((p) => (
                <Row
                  key={p.id}
                  product={p}
                  onEdit={() => setEditing(p)}
                  onDelete={() => {
                    if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                  }}
                  onAdjust={(delta) => updateProduct(p.id, { quantity: Math.max(0, p.quantity + delta) })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {(creating || editing) && (
        <ProductForm
          initial={editing ?? emptyDraft(farmer)}
          mode={editing ? "edit" : "create"}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSubmit={(data) => {
            if (editing) {
              updateProduct(editing.id, data);
            } else {
              createProduct(data);
              const next = {
                name: data.farmerName,
                farmName: data.farmName,
                location: data.location,
              };
              setFarmer(next);
              saveFarmer(next);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-4">
      <div className={`grid place-items-center w-12 h-12 rounded-xl ${accent ? "bg-sun text-sun-foreground" : "bg-[image:var(--gradient-leaf)] text-primary-foreground"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display font-bold text-2xl text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Row({ product, onEdit, onDelete, onAdjust }: { product: Product; onEdit: () => void; onDelete: () => void; onAdjust: (delta: number) => void }) {
  return (
    <div className="px-6 py-4 flex items-center gap-4 flex-wrap">
      <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover border border-border" />
      </Link>
      <div className="flex-1 min-w-[180px]">
        <Link to="/product/$id" params={{ id: product.id }} className="font-semibold text-foreground hover:text-primary transition-colors">
          {product.name}
        </Link>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
          <span>{product.category}</span> · <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location || "—"}</span>
        </div>
      </div>
      <div className="text-sm">
        <div className="font-semibold text-foreground">{formatRWF(product.price)}</div>
        <div className="text-xs text-muted-foreground">per {product.unit}</div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onAdjust(-1)} className="w-8 h-8 rounded-lg border border-border bg-background hover:border-leaf">−</button>
        <div className="min-w-[3.5rem] text-center">
          <div className="font-semibold">{product.quantity}</div>
          <div className="text-[10px] uppercase text-muted-foreground">{product.unit}</div>
        </div>
        <button onClick={() => onAdjust(1)} className="w-8 h-8 rounded-lg border border-border bg-background hover:border-leaf">+</button>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 rounded-lg border border-border bg-background hover:border-leaf" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 rounded-lg border border-border bg-background hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function ProductForm({
  initial, mode, onSubmit, onCancel,
}: {
  initial: ProductInput;
  mode: "create" | "edit";
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image must be under 1.5 MB.");
      return;
    }
    setError(null);
    const url = await fileToDataUrl(file);
    set("image", url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Product name is required.");
    if (form.price <= 0) return setError("Price must be greater than 0.");
    if (form.quantity < 0) return setError("Quantity cannot be negative.");
    if (!form.image) return setError("Please upload a product image.");
    if (!form.location.trim()) return setError("Location is required.");
    if (!form.farmerName.trim()) return setError("Farmer name is required.");
    if (!form.farmName.trim()) return setError("Farm or cooperative name is required.");
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-3xl shadow-[var(--shadow-glow)] w-full max-w-2xl my-8"
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl">{mode === "create" ? "Add product" : "Edit product"}</h2>
            <p className="text-sm text-muted-foreground">Fill in the details — buyers see this on your listing.</p>
          </div>
          <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="text-sm font-medium text-foreground">Product image</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-28 h-28 rounded-xl border border-dashed border-border bg-secondary grid place-items-center overflow-hidden shrink-0">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:border-leaf text-sm font-medium"
                >
                  <Upload className="w-4 h-4" /> {form.image ? "Replace image" : "Upload image"}
                </button>
                <p className="mt-1.5 text-xs text-muted-foreground">JPG or PNG. Max 1.5 MB.</p>
              </div>
            </div>
          </div>

          {/* Name + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={80}
                placeholder="e.g. Vine-ripened tomatoes"
                className="input"
              />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="How it's grown, taste, best uses..."
              className="input resize-none"
            />
          </Field>

          {/* Price/Quantity/Unit */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (RWF)">
              <input
                type="number" min={0} step={50}
                value={form.price || ""}
                onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                className="input"
              />
            </Field>
            <Field label="Quantity">
              <input
                type="number" min={0}
                value={form.quantity || ""}
                onChange={(e) => set("quantity", parseInt(e.target.value, 10) || 0)}
                className="input"
              />
            </Field>
            <Field label="Unit">
              <select value={form.unit} onChange={(e) => set("unit", e.target.value as Unit)} className="input">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
          </div>

          {/* Location + Harvest */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Location">
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                maxLength={80}
                placeholder="District, Rwanda"
                className="input"
              />
            </Field>
            <Field label="Harvest date">
              <input type="date" value={form.harvestDate} onChange={(e) => set("harvestDate", e.target.value)} className="input" />
            </Field>
          </div>

          {/* Farmer + Farm */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Farmer name">
              <input
                value={form.farmerName}
                onChange={(e) => set("farmerName", e.target.value)}
                maxLength={80}
                placeholder="e.g. Habimana Joseph"
                className="input"
              />
            </Field>
            <Field label="Farm / cooperative">
              <input
                value={form.farmName}
                onChange={(e) => set("farmName", e.target.value)}
                maxLength={80}
                placeholder="e.g. Volcanoes Apiary"
                className="input"
              />
            </Field>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-secondary/40 rounded-b-3xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
            {mode === "create" ? "Publish product" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}