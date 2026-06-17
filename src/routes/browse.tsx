import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Star, Package } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import {
  CATEGORIES, formatRWF,
  listProducts,
  subscribe,
  type Category,
  type Product,
} from "@/lib/products-store";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Shop Food & Beverages — Deacomart Ltd" },
      { name: "description", content: "Order juices, teas, honey, sesame, eggs and fresh produce from Deacomart across all Districts of Rwanda." },
      { property: "og:title", content: "Deacomart Shop — Be EcoWise" },
      { property: "og:description", content: "Quality Rwandan food and beverage products, delivered from Kigali nationwide." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | "All">("All");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  useEffect(() => {
    setProducts(listProducts());
    return subscribe(() => setProducts(listProducts()));
  }, []);

  const locations = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => s.add(p.location));
    return Array.from(s).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (loc && p.location !== loc) return false;
      if (term && !`${p.name} ${p.description} ${p.farmerName}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [products, category, loc, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Header */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Deacomart Shop</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Quality food & beverages, from Rwandan farms.</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">Filter by category and District. Place orders via WhatsApp or directly from any product page.</p>

          <div className="mt-8 bg-card rounded-2xl p-2 shadow-[var(--shadow-soft)] border border-border flex flex-col md:flex-row gap-2">
            <label className="flex items-center gap-2 flex-1 px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, e.g. honey, hibiscus tea..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </label>
            <div className="hidden md:block w-px bg-border" />
            <label className="flex items-center gap-2 px-4 py-3">
              <MapPin className="w-5 h-5 text-leaf" />
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="bg-transparent outline-none text-sm pr-2"
              >
                <option value="">All Districts</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar categories */}
        <aside>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
          <div className="flex lg:flex-col gap-2 flex-wrap">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-leaf"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "result" : "results"}
              {category !== "All" && <> in <span className="text-foreground">{category}</span></>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center bg-card">
              <Package className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="mt-4 font-semibold">No products match those filters.</p>
              <p className="text-sm text-muted-foreground mt-1">Try clearing the search or picking a different category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const stockBadge =
    product.quantity === 0
      ? { label: "Out of stock", className: "bg-destructive/10 text-destructive" }
      : product.quantity < 20
        ? { label: "Low stock", className: "bg-sun/30 text-sun-foreground" }
        : { label: "In stock", className: "bg-leaf/15 text-primary" };
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-leaf uppercase tracking-wider">{product.category}</p>
            <h3 className="mt-1 font-bold text-foreground leading-tight">{product.name}</h3>
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground shrink-0">
              <Star className="w-4 h-4 fill-sun text-sun" />
              {product.rating.toFixed(1)}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {product.location} · {product.farmerName}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-xl text-primary">{formatRWF(product.price)}</div>
            <div className="text-xs text-muted-foreground">per {product.unit}</div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockBadge.className}`}>
            {stockBadge.label} · {product.quantity} {product.unit}
          </span>
        </div>
      </div>
    </Link>
  );
}