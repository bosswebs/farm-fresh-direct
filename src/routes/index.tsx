import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Leaf, MapPin, Search, ShoppingBasket, Sprout, Truck, ArrowRight,
  CircleCheck, Star, Tractor, Carrot, Wheat, Apple, Milk, Egg,
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import produceFlatlay from "@/assets/produce-flatlay.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriMarket Connect — Farm-fresh produce, direct from growers" },
      { name: "description", content: "Buy directly from local farmers. Fair prices, transparent sourcing, and fresh produce delivered from the field to your door." },
      { property: "og:title", content: "AgriMarket Connect — Farm-fresh, direct" },
      { property: "og:description", content: "A modern marketplace connecting farmers and buyers — no middlemen, fair prices, fresh produce." },
      { property: "og:image", content: heroFarm },
      { name: "twitter:image", content: heroFarm },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Stats />
      <Categories />
      <HowItWorks />
      <FeaturedFarmer />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-[image:var(--gradient-leaf)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Leaf className="w-5 h-5" />
          </span>
          AgriMarket
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#categories" className="hover:text-foreground transition-colors">Browse</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#farmers" className="hover:text-foreground transition-colors">For farmers</a>
          <a href="#features" className="hover:text-foreground transition-colors">Why us</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
            Sign in
          </button>
          <button className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]">
            Get started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroFarm}
          alt="Aerial view of farmland at golden hour"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 md:pt-32 md:pb-40 text-primary-foreground">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium backdrop-blur-sm">
          <Sprout className="w-3.5 h-3.5 text-sun" />
          Trusted by 2,400+ farms across the region
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl md:text-7xl font-extrabold leading-[0.95]">
          From the field<br/>
          <span className="text-sun">straight to your table.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
          AgriMarket Connect lets you buy fresh produce directly from local farmers — no middlemen, no markup. Fair prices for growers, fresher food for you.
        </p>

        {/* Search bar */}
        <div className="mt-10 bg-card text-card-foreground rounded-2xl p-2 shadow-[var(--shadow-glow)] flex flex-col md:flex-row gap-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-1 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              placeholder="Tomatoes, mangoes, fresh eggs..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="hidden md:block w-px bg-border" />
          <div className="flex items-center gap-2 px-4 py-3">
            <MapPin className="w-5 h-5 text-leaf" />
            <input
              placeholder="Within 20 km of Nairobi"
              className="bg-transparent outline-none w-full md:w-56 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <Link to="/browse" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Find produce
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> Verified farmers</span>
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> Same-day harvest</span>
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> Secure checkout</span>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { k: "2.4k+", v: "Active farmers" },
    { k: "120k", v: "Orders delivered" },
    { k: "38%", v: "Higher farmer earnings" },
    { k: "4.9★", v: "Average buyer rating" },
  ];
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <div key={i.v}>
            <div className="font-display text-3xl md:text-4xl font-bold text-primary">{i.k}</div>
            <div className="text-sm text-muted-foreground mt-1">{i.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    { icon: Carrot, name: "Vegetables", count: "1,240 listings" },
    { icon: Apple, name: "Fruits", count: "860 listings" },
    { icon: Wheat, name: "Grains & Cereals", count: "412 listings" },
    { icon: Milk, name: "Dairy", count: "198 listings" },
    { icon: Egg, name: "Poultry & Eggs", count: "276 listings" },
    { icon: Sprout, name: "Herbs & Spices", count: "330 listings" },
  ];
  return (
    <section id="categories" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Shop by category</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground max-w-xl">Fresh from every corner of the farm.</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            View all categories <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((c) => (
            <Link
              key={c.name}
              to="/browse"
              className="group flex flex-col items-start gap-3 p-5 rounded-2xl bg-card border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all text-left"
            >
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-secondary text-leaf group-hover:bg-[image:var(--gradient-leaf)] group-hover:text-primary-foreground transition-all">
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Discover", desc: "Search produce by category, location, or harvest date. Filter by distance to find the freshest options near you." },
    { icon: ShoppingBasket, title: "Order direct", desc: "Buy straight from the farmer with secure checkout. Chat to negotiate quantities or custom orders." },
    { icon: Truck, title: "Receive fresh", desc: "Pick up on-farm or get same-day delivery from harvest. Rate the produce and farmer once it arrives." },
  ];
  return (
    <section id="how" className="py-20 md:py-28 bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">How it works</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Three steps. Zero middlemen.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-soft)]">
              <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-sun text-sun-foreground text-xs font-bold">STEP {i + 1}</span>
              <div className="grid place-items-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-5">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedFarmer() {
  return (
    <section id="farmers" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src={farmerPortrait}
            alt="Farmer holding crate of fresh vegetables"
            width={1000}
            height={1200}
            loading="lazy"
            className="rounded-3xl shadow-[var(--shadow-glow)] w-full object-cover aspect-[4/5]"
          />
          <div className="absolute -bottom-6 -right-4 md:-right-8 bg-card rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-border max-w-[260px]">
            <div className="flex items-center gap-1 text-sun">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-sun" />)}
            </div>
            <p className="mt-2 text-sm text-foreground font-medium leading-snug">"Sold my full harvest in 3 days — and earned 40% more than at the market."</p>
            <p className="mt-2 text-xs text-muted-foreground">— Joseph K., tomato grower</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">For farmers</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Your harvest, your price.</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            List your produce in minutes, manage inventory in real time, and reach buyers directly. Keep more of what you earn — no broker fees, no surprises.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Free farmer profile with verified badge",
              "Photo-rich listings with harvest date & GPS location",
              "Built-in order tracking & buyer chat",
              "Instant payouts after each delivery",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground">
                <span className="mt-0.5 grid place-items-center w-6 h-6 rounded-full bg-leaf/15 text-leaf">
                  <CircleCheck className="w-4 h-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              <Tractor className="w-5 h-5" /> Become a seller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { title: "Location-aware search", desc: "Find produce within a radius you choose — down to the village." },
    { title: "Transparent pricing", desc: "See farm-gate prices with no hidden markups. Compare before you buy." },
    { title: "Verified growers", desc: "Every farmer is identity-verified before they can list produce." },
    { title: "Inventory in real time", desc: "Stock counts update instantly — no more out-of-season disappointments." },
  ];
  return (
    <section id="features" className="py-20 md:py-28 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Why AgriMarket</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Built for a fairer food system.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">A modern marketplace designed around the people who actually grow our food — and the buyers who want to know where it comes from.</p>
          <img
            src={produceFlatlay}
            alt="Fresh produce flatlay"
            width={1200}
            height={900}
            loading="lazy"
            className="mt-8 rounded-2xl w-full object-cover aspect-[4/3]"
          />
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-5">
          {items.map((f) => (
            <div key={f.title} className="p-7 rounded-2xl bg-background border border-border hover:border-leaf transition-colors">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-[image:var(--gradient-leaf)] text-primary-foreground mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 md:p-16 text-primary-foreground shadow-[var(--shadow-glow)]">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sun/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to taste the difference?</h2>
            <p className="mt-4 text-white/80 text-lg">Join thousands of buyers and farmers building a more transparent food chain.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sun text-sun-foreground font-semibold hover:opacity-90 transition-opacity">
                Start shopping <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground font-semibold hover:bg-white/15 transition-colors">
                Sell your harvest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-primary">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-[image:var(--gradient-leaf)] text-primary-foreground">
            <Leaf className="w-4 h-4" />
          </span>
          AgriMarket Connect
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AgriMarket Connect. Growing fairer markets.</p>
      </div>
    </footer>
  );
}
