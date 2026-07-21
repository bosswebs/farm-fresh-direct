import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Star, Calendar, Package, Tractor, ShoppingBasket, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getProduct, subscribe, formatRWF, WHATSAPP_LINK, type Product } from "@/lib/products-store";
import { addToCart } from "@/lib/cart-store";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — Deacomart Ltd" },
      { name: "description", content: "Order quality food and beverage products from Deacomart Rwanda." },
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
  const { t } = useLanguage();
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

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, 1);
    window.dispatchEvent(new CustomEvent("agrimarket:open-cart"));
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t("product.back")}
        </Link>

        <div className="mt-6 grid md:grid-cols-2 gap-10">
          <div className="rounded-3xl overflow-hidden border border-border bg-card aspect-[4/5] md:aspect-[4/5]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-xs font-semibold text-leaf uppercase tracking-wider">{product.category}</p>
            
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>
              <div className="flex gap-1.5">
                {product.organicStatus && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                    Organic
                  </span>
                )}
                {product.foodSafetyStatus && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                    Safety Approved
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {product.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.rating}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-leaf" /> {product.location}
              </span>
            </div>

            <div className="mt-6 text-3xl font-extrabold text-foreground">
              {formatRWF(product.price)}{" "}
              <span className="text-sm font-normal text-muted-foreground">/ {product.unit}</span>
            </div>

            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat icon={Tractor} label={t("product.producer")} value={product.farmerName} />
              <Stat icon={MapPin} label={t("product.location")} value={product.location} />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Sold by</div>
                <div className="font-semibold text-foreground">{product.farmerName}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hello Deacomart, I'd like to order: ${product.name} (${formatRWF(product.price)} / ${product.unit}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity ${product.quantity === 0 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <MessageCircle className="w-5 h-5" /> {t("product.order_whatsapp")}
              </a>
              <button
                disabled={product.quantity === 0}
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sun text-sun-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBasket className="w-5 h-5" /> {t("product.add_cart")}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              LPO confirmation required at least 2 hours before delivery. Payment via Equity Bank — Deacomart Ltd, Account 4014201311299.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
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