import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Star, Calendar, Package, Tractor, ShoppingBasket, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { getProduct, subscribe, type Product } from "@/lib/products-store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — AgriMarket Connect" },
      { name: "description", content: "Buy fresh produce directly from the farmer." },
    ],
  }),
  component: ProductPage,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Try again</button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or sold out.</p>
        <Link to="/browse" className="inline-flex mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Back to browse</Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | undefined>(() => getProduct(id));

  useEffect(() => {
    setProduct(getProduct(id));
    return subscribe(() => setProduct(getProduct(id)));
  }, [id]);

  if (!product) throw notFound();

  const stockBadge =
    product.quantity === 0
      ? { label: "Out of stock", className: "bg-destructive/10 text-destructive" }
      : product.quantity < 20
        ? { label: "Low stock", className: "bg-sun/30 text-sun-foreground" }
        : { label: "In stock", className: "bg-leaf/15 text-primary" };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>

        <div className="mt-6 grid md:grid-cols-2 gap-10">
          <div className="rounded-3xl overflow-hidden border border-border bg-card aspect-[4/5] md:aspect-[4/5]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-xs font-semibold text-leaf uppercase tracking-wider">{product.category}</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {product.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                  <Star className="w-4 h-4 fill-sun text-sun" /> {product.rating.toFixed(1)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {product.location}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-muted-foreground">/ {product.unit}</span>
              <span className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full ${stockBadge.className}`}>
                {stockBadge.label}
              </span>
            </div>

            <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              <Stat icon={Package} label="Available" value={`${product.quantity} ${product.unit}`} />
              <Stat icon={Calendar} label="Harvested" value={new Date(product.harvestDate).toLocaleDateString()} />
              <Stat icon={Tractor} label="Farm" value={product.farmName} />
              <Stat icon={MapPin} label="Location" value={product.location} />
            </dl>

            <div className="mt-8 p-5 rounded-2xl bg-secondary border border-border flex items-center gap-4">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-[image:var(--gradient-leaf)] text-primary-foreground font-bold">
                {product.farmerName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Sold by</div>
                <div className="font-semibold text-foreground">{product.farmerName}</div>
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-border bg-card hover:border-leaf transition-colors">
                <MessageCircle className="w-4 h-4" /> Message
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                disabled={product.quantity === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBasket className="w-5 h-5" /> Add to cart
              </button>
              <button className="px-6 py-3.5 rounded-xl bg-sun text-sun-foreground font-semibold hover:opacity-90 transition-opacity">
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}