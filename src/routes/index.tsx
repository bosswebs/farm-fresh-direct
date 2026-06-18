import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Leaf, MapPin, Search, ArrowRight, CircleCheck, MessageCircle,
  GraduationCap, Truck, Briefcase, ShieldCheck, Sprout, Phone, Mail, Building2, Coffee, Apple, Egg, Droplets, FlaskConical,
  Landmark, FileText, Wallet, Clock, Settings,
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import produceFlatlay from "@/assets/produce-flatlay.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import { SiteNav } from "@/components/site-nav";
import { WHATSAPP_LINK, WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/products-store";
import { getContent, subscribeContent, type SiteContent } from "@/lib/content-store";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Truck, Briefcase, MessageCircle, ShieldCheck, Sprout,
};

function useSiteContent(): SiteContent {
  const [c, setC] = useState<SiteContent>(() => getContent());
  useEffect(() => subscribeContent(() => setC(getContent())), []);
  return c;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deacomart Ltd — Be EcoWise | Agribusiness & Food Supply, Rwanda" },
      { name: "description", content: "Deacomart trains farmers, supplies quality food and beverages, and delivers agribusiness consultancy across all Districts of Rwanda. Based in Kigali." },
      { property: "og:title", content: "Deacomart Ltd — Be EcoWise" },
      { property: "og:description", content: "Rwandan agribusiness empowering farmers and supplying juices, teas, honey, sesame, eggs and more. Order on WhatsApp +250 780 165 257." },
      { property: "og:image", content: heroFarm },
      { name: "twitter:image", content: heroFarm },
    ],
  }),
  component: Index,
});

function Index() {
  const content = useSiteContent();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Partners partners={content.partners} />
      <Services heading={content.servicesHeading} intro={content.servicesIntro} services={content.services} />
      <Products />
      <About />
      <Team team={content.team} />
      <Outcomes />
      <Terms terms={content.terms} />
      <Contact contact={content.contact} />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroFarm}
          alt="Rwandan farmland at golden hour"
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
          Be EcoWise · Kigali, Rwanda · Incorporated 2026
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl md:text-7xl font-extrabold leading-[0.95]">
          Empowering farmers.<br/>
          <span className="text-sun">Delivering quality food.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
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

function Services({
  heading, intro, services,
}: { heading: string; intro: string; services: { icon: string; title: string; desc: string }[] }) {
  return (
    <section id="services" className="py-20 md:py-28 bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Core Activities</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-muted-foreground">{intro}</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = ICONS[s.icon] ?? Sprout;
            return (
              <div key={s.title} className="p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-soft)]">
                <div className="grid place-items-center w-14 h-14 rounded-2xl bg-[image:var(--gradient-leaf)] text-primary-foreground mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
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

function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src={farmerPortrait}
            alt="Rwandan farmer with fresh harvest"
            width={1000}
            height={1200}
            loading="lazy"
            className="rounded-3xl shadow-[var(--shadow-glow)] w-full object-cover aspect-[4/5]"
          />
          <div className="absolute -bottom-6 -right-4 md:-right-8 bg-background rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-border max-w-[280px]">
            <ShieldCheck className="w-6 h-6 text-leaf" />
            <p className="mt-2 text-sm text-foreground font-semibold leading-snug">Incorporated October 27, 2026 · TIN 150039210</p>
            <p className="mt-1 text-xs text-muted-foreground">Equity Bank — Acc. 4014201311299</p>
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
        </div>
      </div>
    </section>
  );
}

function Team({ team }: { team: { role: string; name: string; expertise: string }[] }) {
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
            <div key={m.role} className="p-6 rounded-2xl bg-card border border-border hover:border-leaf transition-colors">
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

function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Contact</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Get in touch with Deacomart.</h2>
            <p className="mt-4 text-muted-foreground">Place orders, request a training, or enquire about consultancy. We respond fastest on WhatsApp.</p>
            <div className="mt-8 space-y-4 text-sm">
              <ContactRow icon={Building2} label="Headquarters" value="Kigali, Rwanda" />
              <ContactRow icon={Phone} label="Phone" value="+250 780 165 257 · +250 798 975 082 · +250 784 467 541" />
              <ContactRow icon={MessageCircle} label="WhatsApp" value={`${WHATSAPP_NUMBER} (Orders & Inquiries)`} />
              <ContactRow icon={Mail} label="Email" value={CONTACT_EMAIL} />
              <ContactRow icon={ShieldCheck} label="Bank" value="Equity Bank — Deacomart Ltd · Acc. 4014201311299" />
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl font-bold text-foreground">Terms & Conditions</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Flexible booking arrangements for training and consultancy services.</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Local Purchase Order (LPO) confirmation required at least 2 hours before delivery.</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> Payment accepted via bank transfer to Deacomart Ltd (Equity Bank: 4014201311299).</li>
              <li className="flex gap-2"><CircleCheck className="w-4 h-4 text-leaf mt-0.5 shrink-0" /> All prices are quoted in Rwandan Francs (RWF).</li>
            </ul>
            <a
              href={WHATSAPP_LINK}
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

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-primary">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[image:var(--gradient-leaf)] text-primary-foreground">
              <Leaf className="w-4 h-4" />
            </span>
            Deacomart Ltd
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">Be EcoWise. Empowering Rwandan farmers and supplying quality food and beverages.</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-3">Explore</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/browse" className="hover:text-foreground">Shop products</Link></li>
            <li><a href="#services" className="hover:text-foreground">Services</a></li>
            <li><a href="#team" className="hover:text-foreground">Team</a></li>
            <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-3">Contact</div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Kigali, Rwanda</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +250 780 165 257</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {CONTACT_EMAIL}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Deacomart Ltd — Be EcoWise · Kigali, Rwanda · deaco2025@gmail.com · +250 780 165 257
        </p>
      </div>
    </footer>
  );
}
