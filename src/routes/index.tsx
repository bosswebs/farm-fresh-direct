import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Leaf, MapPin, Search, ArrowRight, CircleCheck, MessageCircle,
  GraduationCap, Truck, Briefcase, ShieldCheck, Sprout, Phone, Mail, Building2, Coffee, Apple, Egg, Droplets, FlaskConical, HelpCircle,
} from "lucide-react";
import deacomartLogo from "@/assets/logo.jpg";

const FARMER_IMAGE = "/images/farmer.png";
const VILLAGE_MARKET_IMAGE = "/images/village-market.png";
const TEA_PLANTATION_IMAGE = "/images/tea-plantation.png";
const BEEKEEPER_IMAGE = "/images/beekeeper.png";
const FRESH_PRODUCE_IMAGE = "/images/fresh-produce.png";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { WHATSAPP_LINK, WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/products-store";
import { getSiteContent, subscribeContent } from "@/lib/content-store";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Truck,
  Briefcase,
  MessageCircle,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Sprout,
  HelpCircle,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deacomart Ltd — Be EcoWise | Agribusiness & Food Supply, Rwanda" },
      { name: "description", content: "Deacomart trains farmers, supplies quality food and beverages, and delivers agribusiness consultancy across all Districts of Rwanda. Based in Kigali." },
      { property: "og:title", content: "Deacomart Ltd — Be EcoWise" },
      { property: "og:description", content: "Rwandan agribusiness empowering farmers and supplying juices, teas, honey, sesame, eggs and more. Order on WhatsApp +250 780 165 257." },
      { property: "og:image", content: "/images/hero.png" },
      { name: "twitter:image", content: "/images/hero.png" },
    ],
  }),
  component: Index,
});

function Index() {
  const [content, setContent] = useState(() => getSiteContent());

  useEffect(() => {
    return subscribeContent(() => {
      setContent(getSiteContent());
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Partners partners={content.partners} />
      <Services services={content.services} />
      <Products />
      <RwandaGallery />
      <About contact={content.contact} />
      <Team team={content.team} />
      <Outcomes />
      <DeliveryPaymentTerms contact={content.contact} />
      <Contact contact={content.contact} />
      <CTA />
      <SiteFooter />
    </div>
  );
}

const HERO_IMAGES = [
  "/images/hero.png",
  "/images/hero1.png",
  "/images/hero2.png",
  "/images/hero3.png",
];

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[450px] md:min-h-[550px] flex items-center" style={{ isolation: "isolate" }}>
      {/* Slider Images Stack — z-0 keeps them inside this section's stacking context */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {HERO_IMAGES.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Rwandan Farm Slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Overlay gradients for text contrast */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 text-primary-foreground w-full" style={{ position: "relative", zIndex: 10 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium backdrop-blur-sm">
          <Sprout className="w-3.5 h-3.5 text-sun" />
          Be EcoWise · Kigali, Rwanda · Incorporated 2026
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight">
          Empowering farmers.<br/>
          <span className="text-sun">Delivering quality food.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/85 leading-relaxed">
          Deacomart Ltd is an eco-conscious agribusiness in Rwanda — training smallholder farmers, supplying juices, teas, honey, sesame and eggs, and providing consultancy across all Districts.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sun text-sun-foreground font-semibold hover:opacity-90 transition-opacity">
            <Search className="w-5 h-5" /> Shop products
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/25 text-primary-foreground font-semibold hover:bg-white/15 transition-colors backdrop-blur-sm"
          >
            <MessageCircle className="w-5 h-5" /> Order on WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> All Districts of Rwanda</span>
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> Food safety compliant</span>
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-sun" /> WhatsApp ordering</span>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              idx === activeIndex ? "bg-sun w-6" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function Partners({ partners }: { partners: string[] }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">Trusted partners across Rwanda</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span key={p} className="text-sm md:text-base font-display font-semibold text-foreground/70">{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ services }: { services: any[] }) {
  return (
    <section id="services" className="py-20 md:py-28 bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Core Activities</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Four pillars. One eco-conscious mission.</h2>
          <p className="mt-4 text-muted-foreground">From the farm gate to the supermarket shelf, Deacomart strengthens every link in Rwanda's agricultural value chain.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {services.map((s) => {
            const IconComponent = ICON_MAP[s.iconName] || HelpCircle;
            return (
              <div key={s.id || s.title} className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-soft)]">
                <div className="grid place-items-center w-14 h-14 rounded-2xl bg-[image:var(--gradient-leaf)] text-primary-foreground mb-5">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Products() {
  const cats = [
    { icon: Droplets, name: "Juices & Beverages", items: "Passion juice, fresh blends" },
    { icon: Coffee, name: "Teas & Herbal", items: "Black, Green, Hibiscus, Ginger" },
    { icon: FlaskConical, name: "Natural Health", items: "Honey, Sesame, Avocado" },
    { icon: Apple, name: "Condiments & Staples", items: "Salsa & essentials" },
    { icon: Egg, name: "Poultry & Eggs", items: "Free-range eggs" },
    { icon: Sprout, name: "Organic & Specialty", items: "Health-conscious lines" },
  ];
  return (
    <section id="products" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Product Range</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground max-w-xl">Quality food & beverage, sourced responsibly.</h2>
          </div>
          <Link to="/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            Browse full shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cats.map((c) => (
            <Link
              key={c.name}
              to="/browse"
              className="group flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all text-left"
            >
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-secondary text-leaf group-hover:bg-[image:var(--gradient-leaf)] group-hover:text-primary-foreground transition-all shrink-0">
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.items}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RwandaGallery() {
  const images = [
    { src: VILLAGE_MARKET_IMAGE, alt: "Rwandan village women farmers sorting produce at a local market", caption: "Village Markets" },
    { src: TEA_PLANTATION_IMAGE, alt: "Lush tea plantation terraces on Rwanda's rolling hills", caption: "Tea Plantations" },
    { src: BEEKEEPER_IMAGE, alt: "Rwandan beekeeper harvesting honey from traditional hives", caption: "Honey Farming" },
    { src: FRESH_PRODUCE_IMAGE, alt: "Fresh organic Rwandan produce — avocados, passion fruit, honey and more", caption: "Fresh Produce" },
  ];
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Rwanda's Green Heart</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">From the hills of Rwanda, to your table.</h2>
          <p className="mt-4 text-muted-foreground">Every product we supply starts with a Rwandan farmer. We work directly with smallholder farmers across all Districts to ensure quality, traceability, and fair income.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? "h-[380px] md:h-full" : "h-[180px]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">{img.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ contact }: { contact: any }) {
  return (
    <section id="about" className="py-20 md:py-28 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src={FARMER_IMAGE}
            alt="Rwandan farmer harvesting fresh avocados in a lush village farm"
            width={1000}
            height={1200}
            loading="lazy"
            className="rounded-3xl shadow-[var(--shadow-glow)] w-full object-cover aspect-[4/5]"
          />
          <div className="absolute -bottom-6 -right-4 md:-right-8 bg-background rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-border max-w-[280px]">
            <ShieldCheck className="w-6 h-6 text-leaf" />
            <p className="mt-2 text-sm text-foreground font-semibold leading-snug">Incorporated October 27, 2026 · TIN {contact.tin}</p>
            <p className="mt-1 text-xs text-muted-foreground">{contact.bankName} — Acc. {contact.bankAccount}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">About Deacomart</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Be EcoWise — for farmers and households alike.</h2>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-display font-bold text-foreground">Vision</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">To become Rwanda's leading eco-conscious agribusiness enterprise, empowering farmers and ensuring safe, nutritious food reaches every household.</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">Mission</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">Train farmers in modern agricultural practices, facilitate value addition, ensure food safety and quality, supply quality food and beverages, and provide expert consultancy.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden aspect-video">
              <img src={TEA_PLANTATION_IMAGE} alt="Rwanda tea plantation" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video">
              <img src={VILLAGE_MARKET_IMAGE} alt="Rwanda village market" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Team({ team }: { team: any[] }) {
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Our Team</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Multidisciplinary expertise.</h2>
          <p className="mt-4 text-muted-foreground">Agribusiness, food science, IT, finance, and business development — under one roof.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((m) => (
            <div key={m.id || m.role} className="p-6 rounded-2xl bg-card border border-border hover:border-leaf transition-colors">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-[image:var(--gradient-leaf)] text-primary-foreground font-bold">
                {m.name.charAt(0)}
              </div>
              <div className="mt-4 text-xs font-semibold text-leaf uppercase tracking-wider">{m.role}</div>
              <div className="mt-1 font-bold text-foreground">{m.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.expertise}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  const items = [
    "Increased agricultural productivity and farmer income",
    "Reduced post-harvest losses through better management",
    "Enhanced food safety and hygiene across the value chain",
    "Wider availability of quality food and beverages in Rwanda",
    "Stronger linkages between farmers, processors, and consumers",
    "Growth of a sustainable, eco-conscious agribusiness model",
  ];
  return (
    <section className="py-20 md:py-28 bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Expected Outcomes</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Impact across the value chain.</h2>
        </div>
        <ul className="mt-12 grid md:grid-cols-2 gap-4">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3 p-5 rounded-2xl bg-card border border-border">
              <span className="mt-0.5 grid place-items-center w-7 h-7 rounded-full bg-leaf/15 text-leaf shrink-0">
                <CircleCheck className="w-4 h-4" />
              </span>
              <span className="text-foreground">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ contact }: { contact: any }) {
  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`;
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Contact</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Get in touch with Deacomart.</h2>
            <p className="mt-4 text-muted-foreground">Place orders, request a training, or enquire about consultancy. We respond fastest on WhatsApp.</p>
            <div className="mt-8 space-y-4 text-sm">
              <ContactRow icon={Building2} label="Headquarters" value={contact.headquarters} />
              <ContactRow icon={Phone} label="Phone" value={contact.phones} />
              <ContactRow icon={MessageCircle} label="WhatsApp" value={`${contact.whatsapp} (Orders & Inquiries)`} />
              <ContactRow icon={Mail} label="Email" value={contact.email} />
              <ContactRow icon={ShieldCheck} label="Bank" value={`${contact.bankName} — ${contact.bankHolder} · Acc. ${contact.bankAccount}`} />
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl font-bold text-foreground">Terms & Conditions</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Flexible booking arrangements for training and consultancy services.</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Local Purchase Order (LPO) confirmation required at least 2 hours before delivery.</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Payment accepted via bank transfer to {contact.bankHolder} ({contact.bankName}: {contact.bankAccount}).</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> All prices are quoted in Rwandan Francs (RWF).</li>
            </ul>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5" /> Chat with Deacomart
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-secondary text-leaf shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-foreground font-medium">{value}</div>
      </div>
    </div>
  );
}

function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 md:p-16 text-primary-foreground shadow-[var(--shadow-glow)]">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sun/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Partner with Deacomart.</h2>
            <p className="mt-4 text-white/80 text-lg">Whether you're a farmer, a buyer, or an institution — we'd love to work with you. Be EcoWise.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sun text-sun-foreground font-semibold hover:opacity-90 transition-opacity">
                Browse products <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground font-semibold hover:bg-white/15 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Message us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryPaymentTerms({ contact }: { contact: any }) {
  return (
    <section id="delivery-terms" className="py-20 md:py-28 bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Operational Framework</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Delivery & Payment Terms</h2>
          <p className="mt-4 text-muted-foreground">
            Our official operational parameters, bank details, and payment instructions compiled as a formal concept note.
          </p>
        </div>

        {/* The Concept Note Container */}
        <div className="relative bg-card border-2 border-dashed border-primary/40 rounded-3xl p-8 md:p-12 shadow-[var(--shadow-glow)] overflow-hidden transition-all duration-300 hover:border-primary/70">
          
          {/* Concept Note Stamp / Badge */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 text-xs font-mono font-bold text-primary border-2 border-primary px-3 py-1 rounded-lg uppercase tracking-widest rotate-6 select-none bg-background/80 backdrop-blur-sm shadow-sm animate-pulse">
            Concept Note
          </div>

          <div className="space-y-6 font-mono text-sm text-foreground/90">
            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-border">
              <h3 className="font-extrabold text-lg md:text-xl tracking-wider text-primary">DEACOMART LTD OPERATIONAL GUIDELINES</h3>
              <p className="text-xs text-muted-foreground mt-1">Kigali, Rwanda · TIN {contact.tin} · Be EcoWise</p>
            </div>

            {/* Grid for Document Metadata */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-xs border-b border-border/60 pb-4">
              <div><strong>Document Reference:</strong> DM-OPS-2026-N01</div>
              <div><strong>Effective Date:</strong> October 27, 2026</div>
              <div><strong>Applicable Scope:</strong> All 30 Districts of Rwanda</div>
              <div><strong>Target Partners:</strong> Retailers, Hotels, Cooperatives, Consumers</div>
            </div>

            {/* Section 1 */}
            <div className="space-y-2">
              <span className="font-extrabold text-primary text-base block">1. Delivery Logistics & Districts</span>
              <p className="leading-relaxed text-muted-foreground text-xs">
                Deacomart Ltd coordinates distributions daily from Kigali. We service all 30 districts of Rwanda (including Nyarugenge, Gasabo, Kicukiro, Musanze, Rubavu, Huye, and Nyagatare).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                <li><strong>Kigali Deliveries:</strong> Dispatched within 2-4 hours of payment confirmation/LPO receipt.</li>
                <li><strong>Upcountry Districts:</strong> Dispatched via partner transport routes within 24 hours.</li>
                <li><strong>LPO Requirement:</strong> Institutions/Hotels must submit a valid Local Purchase Order at least 2 hours before the scheduled dispatch.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="font-extrabold text-primary text-base block">2. Payment Channels & Terms</span>
              <p className="leading-relaxed text-muted-foreground text-xs">
                To guarantee organic freshness, maintain supply chain traceabilities, and eliminate unnecessary middlemen costs, all transactions must adhere to the following payment channels:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                <li><strong>Bank Transfers:</strong> Accepted directly into the company account (see Banking Coordinates below).</li>
                <li><strong>Mobile Payments:</strong> Integrated MTN Mobile Money and Airtel Money channels are supported for retail transactions via WhatsApp Commerce.</li>
                <li><strong>Currency:</strong> All invoices and payments are strictly denominated and cleared in Rwandan Francs (RWF).</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="font-extrabold text-primary text-base block">3. Banking Coordinates</span>
              <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-1 text-xs font-mono text-foreground">
                <div><strong>Beneficiary:</strong> {contact.bankHolder}</div>
                <div><strong>Bank Name:</strong> {contact.bankName}</div>
                <div><strong>Account Number:</strong> <span className="text-primary font-bold">{contact.bankAccount}</span></div>
                <div><strong>Corporate TIN:</strong> {contact.tin}</div>
                <div className="text-[10px] text-muted-foreground mt-2 italic">
                  *Please forward your transfer confirmation slip to our WhatsApp or email for prompt clearing.
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="font-extrabold text-primary text-base block">4. Step-by-Step Purchasing Process</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mt-3">
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs mx-auto mb-2">1</div>
                  <div className="font-bold text-[11px]">Select Products</div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Browse catalog or request service estimate</p>
                </div>
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs mx-auto mb-2">2</div>
                  <div className="font-bold text-[11px]">Submit Details</div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Submit order via Cart or WhatsApp</p>
                </div>
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs mx-auto mb-2">3</div>
                  <div className="font-bold text-[11px]">Send Payment</div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Pay via Bank or MoMo, or send official LPO</p>
                </div>
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs mx-auto mb-2">4</div>
                  <div className="font-bold text-[11px]">Dispatch</div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Order verified and shipped to your location</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-6 border-t-2 border-border text-[10px] text-muted-foreground italic">
              "Be EcoWise" — Supporting Rwandan Smallholders and Securing Healthy Supply Chains.
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


