import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Upload, X, Package, DollarSign, TrendingUp,
  ImageIcon, MapPin, Tractor, GraduationCap, Briefcase, Handshake, CheckCircle2, Clock, FileText, Trash
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import {
  CATEGORIES, UNITS, formatRWF,
  createProduct, deleteProduct, uploadProductImage, listProducts, subscribe, updateProduct,
  listRegistrations, listBookings, listPartnerships, updateBookingStatus,
  type Category, type Product, type ProductInput, type Unit, type TrainingRegistration, type ConsultancyBooking, type PartnershipApplication
} from "@/lib/products-store";
import { getSiteContent, updateSiteContent, type SiteContent } from "@/lib/content-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Deacomart Ltd — Admin & Agribusiness Dashboard" },
      { name: "description", content: "Manage Deacomart's inventory, farmer training registrations, agribusiness consultancy bookings, and partnerships." },
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
    organicStatus: false,
    qualityStatus: false,
    foodSafetyStatus: false,
  };
}

type TabType = "products" | "academy" | "consultancy" | "partnerships" | "content";

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [bookings, setBookings] = useState<ConsultancyBooking[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipApplication[]>([]);
  
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [farmer, setFarmer] = useState<FarmerProfile>(DEFAULT_FARMER);

  useEffect(() => {
    // Initial load
    setProducts(listProducts());
    setFarmer(loadFarmer());
    setRegistrations(listRegistrations());
    setBookings(listBookings());
    setPartnerships(listPartnerships());

    // Subscriptions
    const subProducts = subscribe(() => setProducts(listProducts()));
    
    const handleRegsChanged = () => setRegistrations(listRegistrations());
    const handleBookingsChanged = () => setBookings(listBookings());
    const handlePartnershipsChanged = () => setPartnerships(listPartnerships());

    window.addEventListener("agrimarket:registrations-changed", handleRegsChanged);
    window.addEventListener("agrimarket:bookings-changed", handleBookingsChanged);
    window.addEventListener("agrimarket:partnerships-changed", handlePartnershipsChanged);

    return () => {
      subProducts();
      window.removeEventListener("agrimarket:registrations-changed", handleRegsChanged);
      window.removeEventListener("agrimarket:bookings-changed", handleBookingsChanged);
      window.removeEventListener("agrimarket:partnerships-changed", handlePartnershipsChanged);
    };
  }, []);

  const stats = useMemo(() => {
    const totalListings = products.length;
    const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 20).length;
    return { totalListings, totalValue, lowStock };
  }, [products]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero Section */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Deacomart Agribusiness Management</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Management Portal.</h1>
            <p className="mt-2 text-muted-foreground">Admin panel for reviewing product inventories, academy trainees, consultancies, and partnership applications.</p>
          </div>
          {activeTab === "products" && (
            <button
              onClick={() => setCreating(true)}
              className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)] cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Add product
            </button>
          )}
        </div>
      </section>

      {/* Stats Counter (Only for products view or global) */}
      <section className="mx-auto max-w-7xl px-6 py-10 grid sm:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Active listings" value={stats.totalListings.toString()} />
        <StatCard icon={DollarSign} label="Inventory value" value={formatRWF(stats.totalValue)} />
        <StatCard icon={GraduationCap} label="Trainees Registered" value={registrations.length.toString()} />
        <StatCard icon={Briefcase} label="Consultancies Booked" value={bookings.length.toString()} />
      </section>

      {/* Main Tab Controller & List Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex border-b border-border mb-6 overflow-x-auto gap-2">
          <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} label="Products Inventory" icon={Package} />
          <TabButton active={activeTab === "academy"} onClick={() => setActiveTab("academy")} label="Academy Trainees" icon={GraduationCap} />
          <TabButton active={activeTab === "consultancy"} onClick={() => setActiveTab("consultancy")} label="Consultancies" icon={Briefcase} />
          <TabButton active={activeTab === "partnerships"} onClick={() => setActiveTab("partnerships")} label="Partnerships" icon={Handshake} />
          <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")} label="Concept Note Config" icon={FileText} />
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-soft)]">
          {activeTab === "products" && (
            <div>
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
          )}

          {activeTab === "academy" && (
            <div>
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">Training Academy Registrations</h2>
                <span className="text-sm text-muted-foreground">{registrations.length} registrations</span>
              </div>
              {registrations.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">
                  <GraduationCap className="w-10 h-10 mx-auto opacity-50 mb-2" />
                  <p className="font-semibold">No trainee registrations found.</p>
                  <p className="text-xs mt-1">Trainee signups will populate here once submitted.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border">
                        <th className="p-4">Participant</th>
                        <th className="p-4">Course Topic</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-secondary/20">
                          <td className="p-4 font-semibold text-foreground">{reg.name}</td>
                          <td className="p-4 text-leaf font-medium">{reg.courseTitle}</td>
                          <td className="p-4">{reg.district}</td>
                          <td className="p-4">
                            <div className="text-xs">{reg.email}</div>
                            <div className="text-xs text-muted-foreground">{reg.phone}</div>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "consultancy" && (
            <div>
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">Consultancy Booking Enquiries</h2>
                <span className="text-sm text-muted-foreground">{bookings.length} bookings</span>
              </div>
              {bookings.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto opacity-50 mb-2" />
                  <p className="font-semibold">No consultancy enquiries found.</p>
                  <p className="text-xs mt-1">Bookings submitted on the consultancy page will display here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border">
                        <th className="p-4">Client</th>
                        <th className="p-4">Consultation Service</th>
                        <th className="p-4">Project Scope</th>
                        <th className="p-4">Preferred Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bookings.map((book) => (
                        <tr key={book.id} className="hover:bg-secondary/20">
                          <td className="p-4">
                            <div className="font-semibold text-foreground">{book.name}</div>
                            <div className="text-xs text-muted-foreground">{book.phone} · {book.email}</div>
                          </td>
                          <td className="p-4 text-leaf font-medium">{book.serviceTitle}</td>
                          <td className="p-4">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">{book.scale}</span>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]" title={book.notes}>{book.notes}</div>
                          </td>
                          <td className="p-4 text-xs font-medium">{new Date(book.date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                              book.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-500" :
                              book.status === "Completed" ? "bg-blue-600/10 text-blue-500" :
                              book.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                              "bg-sun/20 text-sun-foreground"
                            }`}>
                              {book.status === "Confirmed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {book.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                              {book.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={book.status}
                              onChange={(e) => updateBookingStatus(book.id, e.target.value as ConsultancyBooking["status"])}
                              className="text-xs bg-background border border-border rounded p-1 outline-none font-semibold hover:border-leaf"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirm</option>
                              <option value="Completed">Complete</option>
                              <option value="Cancelled">Cancel</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "partnerships" && (
            <div>
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">Partnership Applications</h2>
                <span className="text-sm text-muted-foreground">{partnerships.length} applications</span>
              </div>
              {partnerships.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">
                  <Handshake className="w-10 h-10 mx-auto opacity-50 mb-2" />
                  <p className="font-semibold">No partnership applications found.</p>
                  <p className="text-xs mt-1">Partnership requests will list here once submitted.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {partnerships.map((app) => (
                    <div key={app.id} className="p-6 hover:bg-secondary/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-foreground">{app.organizationName}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{app.partnerType}</span>
                        </div>
                        <p className="text-sm font-medium text-leaf">Contact Person: {app.contactName}</p>
                        <p className="text-xs text-muted-foreground">Email: {app.email} · Phone: {app.phone}</p>
                        <p className="text-sm text-foreground/80 mt-2 bg-background p-3 rounded-lg border border-border max-w-2xl">{app.details}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold shrink-0">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "content" && (
            <ContentConfigTab />
          )}
        </div>
      </section>

      {/* Product Form Modals */}
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

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
        active ? "border-leaf text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-4 shadow-[var(--shadow-soft)]">
      <div className={`grid place-items-center w-12 h-12 rounded-xl shrink-0 ${accent ? "bg-sun text-sun-foreground" : "bg-[image:var(--gradient-leaf)] text-primary-foreground"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display font-bold text-xl text-foreground mt-0.5">{value}</div>
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
        <div className="flex items-center gap-2">
          <Link to="/product/$id" params={{ id: product.id }} className="font-semibold text-foreground hover:text-primary transition-colors">
            {product.name}
          </Link>
          <div className="flex gap-1 shrink-0">
            {product.organicStatus && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-white">Organic</span>}
            {product.foodSafetyStatus && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">Safety Approved</span>}
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
          <span>{product.category}</span> · <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location || "—"}</span>
        </div>
      </div>
      <div className="text-sm">
        <div className="font-semibold text-foreground">{formatRWF(product.price)}</div>
        <div className="text-xs text-muted-foreground text-center">per {product.unit}</div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onAdjust(-1)} className="w-8 h-8 rounded-lg border border-border bg-background hover:border-leaf cursor-pointer">−</button>
        <div className="min-w-[3.5rem] text-center">
          <div className="font-semibold">{product.quantity}</div>
          <div className="text-[10px] uppercase text-muted-foreground">{product.unit}</div>
        </div>
        <button onClick={() => onAdjust(1)} className="w-8 h-8 rounded-lg border border-border bg-background hover:border-leaf cursor-pointer">+</button>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 rounded-lg border border-border bg-background hover:border-leaf cursor-pointer" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 rounded-lg border border-border bg-background hover:border-destructive hover:text-destructive cursor-pointer" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
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
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError(null);
    try {
      const url = await uploadProductImage(file);
      set("image", url);
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    }
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:border-leaf text-sm font-medium cursor-pointer"
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

          {/* Certifications (New) */}
          <div className="pt-4 border-t border-border">
            <span className="text-sm font-semibold text-foreground">Certifications & Food Safety Badges</span>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.organicStatus || false}
                  onChange={(e) => set("organicStatus", e.target.checked)}
                  className="rounded border-border text-leaf focus:ring-leaf w-4 h-4 cursor-pointer"
                />
                Certified Organic
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.foodSafetyStatus || false}
                  onChange={(e) => set("foodSafetyStatus", e.target.checked)}
                  className="rounded border-border text-leaf focus:ring-leaf w-4 h-4 cursor-pointer"
                />
                Safety Approved
              </label>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.qualityStatus || false}
                  onChange={(e) => set("qualityStatus", e.target.checked)}
                  className="rounded border-border text-leaf focus:ring-leaf w-4 h-4 cursor-pointer"
                />
                Quality Verified
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-secondary/40 rounded-b-3xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 cursor-pointer">
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

function ContentConfigTab() {
  const [content, setContent] = useState<SiteContent>(() => getSiteContent());
  const [isSaved, setIsSaved] = useState(false);

  function handleSave() {
    updateSiteContent(content);
    toast.success("Concept note config saved successfully!");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  function updateContact(key: keyof typeof content.contact, value: string) {
    setContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: value,
      },
    }));
  }

  function updateService(id: string, field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  }

  function addService() {
    setContent((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: "s-" + Math.random().toString(36).slice(2, 10),
          iconName: "HelpCircle",
          title: "New Service Pillar",
          description: "Service description text goes here.",
        },
      ],
    }));
  }

  function removeService(id: string) {
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  }

  function updateTeamMember(id: string, field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  }

  function addTeamMember() {
    setContent((prev) => ({
      ...prev,
      team: [
        ...prev.team,
        {
          id: "t-" + Math.random().toString(36).slice(2, 10),
          role: "Role / Position",
          name: "Full Name",
          expertise: "Expertise details",
        },
      ],
    }));
  }

  function removeTeamMember(id: string) {
    setContent((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }));
  }

  function updatePartner(index: number, value: string) {
    setContent((prev) => {
      const copy = [...prev.partners];
      copy[index] = value;
      return { ...prev, partners: copy };
    });
  }

  function addPartner() {
    setContent((prev) => ({
      ...prev,
      partners: [...prev.partners, "New Partner Name"],
    }));
  }

  function removePartner(index: number) {
    setContent((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, idx) => idx !== index),
    }));
  }

  return (
    <div className="p-6 space-y-8 divide-y divide-border">
      {/* Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <h2 className="font-display font-bold text-lg">Site Content & Concept Note Configurations</h2>
          <p className="text-sm text-muted-foreground">Manage the text values for services, team profiles, partner lists, and contact coordinates.</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all cursor-pointer shadow-[var(--shadow-soft)] self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" /> Save Content Changes
        </button>
      </div>

      {/* Services Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Services (Pillars)</h3>
            <p className="text-xs text-muted-foreground">Configure the core agribusiness pillars displayed on the home page.</p>
          </div>
          <button
            onClick={addService}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {content.services.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-border bg-background space-y-3 relative group">
              <button
                onClick={() => removeService(s.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                title="Remove Service"
              >
                <Trash className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Service Title</label>
                  <input
                    value={s.title}
                    onChange={(e) => updateService(s.id, "title", e.target.value)}
                    className="input py-1 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Icon</label>
                  <select
                    value={s.iconName}
                    onChange={(e) => updateService(s.id, "iconName", e.target.value)}
                    className="input py-1 text-xs mt-1"
                  >
                    <option value="GraduationCap">Academy (GraduationCap)</option>
                    <option value="Truck">Logistics (Truck)</option>
                    <option value="Briefcase">Advisory (Briefcase)</option>
                    <option value="MessageCircle">WhatsApp (MessageCircle)</option>
                    <option value="Sprout">Sprout</option>
                    <option value="ShieldCheck">Shield</option>
                    <option value="HelpCircle">Help Circle</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Description</label>
                <textarea
                  value={s.description}
                  onChange={(e) => updateService(s.id, "description", e.target.value)}
                  rows={2}
                  className="input py-1 text-xs mt-1 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Agribusiness Team Profiles</h3>
            <p className="text-xs text-muted-foreground">Manage Deacomart team members, roles, and expertise descriptions.</p>
          </div>
          <button
            onClick={addTeamMember}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Team Member
          </button>
        </div>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border">
                <th className="p-3">Full Name</th>
                <th className="p-3">Role / Designation</th>
                <th className="p-3">Expertise / Background</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {content.team.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/10">
                  <td className="p-2">
                    <input
                      value={m.name}
                      onChange={(e) => updateTeamMember(m.id, "name", e.target.value)}
                      className="input py-1 text-xs max-w-[150px]"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={m.role}
                      onChange={(e) => updateTeamMember(m.id, "role", e.target.value)}
                      className="input py-1 text-xs max-w-[150px]"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={m.expertise}
                      onChange={(e) => updateTeamMember(m.id, "expertise", e.target.value)}
                      className="input py-1 text-xs w-full"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => removeTeamMember(m.id)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partners Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Strategic Partners</h3>
            <p className="text-xs text-muted-foreground">List of hotels, supermarkets, and cooperatives showing in the partner slider.</p>
          </div>
          <button
            onClick={addPartner}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Partner
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {content.partners.map((p, index) => (
            <div key={index} className="inline-flex items-center gap-2 bg-secondary/35 border border-border rounded-xl pl-3 pr-1.5 py-1 text-xs">
              <input
                value={p}
                onChange={(e) => updatePartner(index, e.target.value)}
                className="bg-transparent border-none outline-none font-medium text-foreground py-0.5 focus:ring-0 w-36"
              />
              <button
                onClick={() => removePartner(index)}
                className="text-muted-foreground hover:text-destructive p-0.5 rounded hover:bg-destructive/10 cursor-pointer"
                title="Remove Partner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Banking coordinates */}
      <div className="pt-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground">Contact details & Bank Coordinates</h3>
          <p className="text-xs text-muted-foreground">Update the main office addresses, banking accounts, and company registry numbers.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Headquarters Location</label>
            <input
              value={content.contact.headquarters}
              onChange={(e) => updateContact("headquarters", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Phone Lines</label>
            <input
              value={content.contact.phones}
              onChange={(e) => updateContact("phones", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">WhatsApp Number (e.g. +250...)</label>
            <input
              value={content.contact.whatsapp}
              onChange={(e) => updateContact("whatsapp", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
            <input
              value={content.contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Bank Name</label>
            <input
              value={content.contact.bankName}
              onChange={(e) => updateContact("bankName", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Account Number</label>
            <input
              value={content.contact.bankAccount}
              onChange={(e) => updateContact("bankAccount", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Account Holder Name</label>
            <input
              value={content.contact.bankHolder}
              onChange={(e) => updateContact("bankHolder", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Registry TIN Number</label>
            <input
              value={content.contact.tin}
              onChange={(e) => updateContact("tin", e.target.value)}
              className="input text-xs mt-1"
            />
          </div>
        </div>
      </div>

      {/* Save Toast feedback info */}
      {isSaved && (
        <div className="pt-4 text-emerald-500 font-bold text-center text-xs animate-pulse">
          ✓ Configuration changes successfully saved to local system storage!
        </div>
      )}
    </div>
  );
}
