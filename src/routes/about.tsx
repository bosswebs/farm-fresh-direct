import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getTeamMembers } from "@/lib/admin-data.server";
import type { TeamMember } from "@/lib/admin-data";
import {
  BookOpen,
  Users,
  TrendingUp,
  ShieldCheck,
  Award,
  Sprout,
  Compass,
  ArrowRight,
  Database,
  Briefcase,
  Sparkles,
  Linkedin,
  Mail,
  User,
  GraduationCap,
  Quote,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  loader: async () => {
    try {
      const members = await getTeamMembers();
      return members;
    } catch (e) {
      return [];
    }
  },
  head: () => ({
    meta: [
      { title: "About Us — DEACOMART Ltd | Be EcoWise" },
      {
        name: "description",
        content:
          "DEACOMART Limited (Development & Empowerment of Agri-food Communities for Market Resilience, Training and Transformation) in Kigali, Rwanda.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLanguage();
  const teamMembers = Route.useLoaderData();
  const acronymItems = [
    { letter: "D", word: "Development", desc: "Strengthening the agricultural value chain" },
    { letter: "E", word: "Empowerment", desc: "Helping farmers and entrepreneurs scale up" },
    { letter: "A", word: "Agri-food", desc: "Processing and value addition of products" },
    { letter: "CO", word: "Communities", desc: "Collaborating with local farming groups" },
    { letter: "MA", word: "Market", desc: "Creating regional and export market access" },
    { letter: "R", word: "Resilience", desc: "Equipping communities to absorb climate shocks" },
    { letter: "T", word: "Training", desc: "Building capacity in agribusiness & postharvest" },
    { letter: "T", word: "Transformation", desc: "Driving data-powered agricultural transformation" },
  ];

  const whatWeDo = [
    {
      icon: Briefcase,
      title: "Wholesale & Agri-Trade",
      desc: "Distributing quality food, beverages, and agricultural raw materials to local, regional, and export markets.",
      gradient: "var(--gradient-hero)",
    },
    {
      icon: BookOpen,
      title: "Training & Capacity Building",
      desc: "Structured training programs in agricultural production, marketing, food safety, postharvest management, and tax literacy.",
      gradient: "var(--gradient-leaf)",
    },
    {
      icon: ShieldCheck,
      title: "Resilience Building",
      desc: "Equipping farming communities to absorb climate shocks, reduce crop losses, and sustain long-term livelihoods.",
      gradient: "var(--gradient-soft)",
    },
    {
      icon: Database,
      title: "Data & Transformation",
      desc: "Training in statistical tools, including Stata, for evidence-based farm decisions, M&E, and data-driven agribusiness transformation.",
      gradient: "var(--gradient-hero)",
    },
  ];

  const whyDeacomart = [
    {
      title: "Right Sector, Right Time",
      desc: "Agriculture is Rwanda's top priority under NST2. DEACOMART sits at the heart of it — processing, distributing, and training at exactly the moment the nation needs it most.",
    },
    {
      title: "Integrated Model",
      desc: "Unlike single-service operators, we combine food processing, wholesale trade, capacity building, climate resilience, and data analytical skills into one interconnected platform.",
    },
    {
      title: "Community at the Centre",
      desc: "Farmers, cooperatives, women, youth, and entrepreneurs are not simply beneficiaries; they are active partners in our business model, driving shared prosperity.",
    },
    {
      title: "Data-Powered Decisions",
      desc: "We bring modern statistical analytics to agricultural cooperatives, training professionals in Stata to replace guesswork with evidence-based farm management.",
    },
  ];

  const partners = [
    "Agri-food Investors & Impact Funds",
    "Development Organisations (FAO, WFP, IFAD, GIZ, AEE, KILIMO TRUST)",
    "Farmer Cooperatives & Producer Groups",
    "Training Institutions & Universities",
    "Food Retailers, Hospitality & Institutional Buyers",
    "District Agriculture Offices & Local Government",
    "East African Regional Agri-food Businesses",
    "Data, M&E, & Technology Partners",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero Header */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-[image:var(--gradient-soft)] border-b border-border">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leaf/10 border border-leaf/25 text-xs font-semibold text-leaf mb-6">
            <Sparkles className="w-3.5 h-3.5" /> {t("about.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            {t("about.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Acronym Acrostic Section */}
      <section className="py-20 md:py-28 mx-auto max-w-7xl px-6 border-b border-border">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">The Meaning Behind Our Name</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold text-foreground">What does DEACOMART stand for?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {acronymItems.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all flex flex-col justify-between group"
            >
              <div className="text-4xl md:text-5xl font-black text-primary group-hover:text-leaf transition-colors font-display">
                {item.letter}
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-foreground text-lg leading-tight">{item.word}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Narrative & Registration info */}
      <section className="py-20 md:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider font-display">Corporate Identity</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              A registered bridge for Rwanda's agricultural future.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DEACOMART Limited is a Rwandan private limited company established and registered in accordance with <span className="text-foreground font-semibold">Article 23 of Law Nº 007/2021 of 05/02/2021</span> governing companies in Rwanda.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Incorporated on <span className="text-foreground font-semibold">27 October 2025</span>, the company was created with a clear purpose: to strengthen Rwanda's agri-food value chain by delivering high-quality food processing, wholesale distribution, and retail services to local and regional markets.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We operate with a deep understanding of Rwanda's food and agricultural landscape — and its integration into the wider regional and global agri-food systems of East Africa and beyond.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-leaf to-sun opacity-30 blur-lg" />
            <div className="relative p-8 rounded-3xl bg-background border border-border shadow-[var(--shadow-glow)] space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 text-leaf" /> Anchored in Vision 2050
              </div>
              <h3 className="text-xl font-bold text-foreground font-display">National Strategy Alignment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rooted in a strong commitment to quality, reliability, and integrity, DEACOMART is actively contributing to Rwanda's food security ambitions and the broader socioeconomic transformation goals.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our operations align directly with the Second National Strategy for Transformation (<span className="text-foreground font-semibold">NST2, 2024–2029</span>), helping build a dynamically modern and resilient food economy.
              </p>
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>NST2 Priority Sector</span>
                <span className="text-leaf">Active Contributor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message Callout */}
      <section className="py-20 md:py-28 bg-[image:var(--gradient-soft)] border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative p-8 md:p-12 rounded-3xl bg-card border border-border shadow-[var(--shadow-glow)] text-center overflow-hidden">
            <Quote className="absolute -top-6 -left-6 w-24 h-24 text-leaf/5 rotate-12" />
            <p className="text-lg md:text-2xl font-medium text-foreground leading-relaxed italic relative z-10">
              "Born from a deep conviction that Rwanda's farming communities deserve better — better markets, better training, better tools, and better futures — DEACOMART was founded to be the bridge between where Rwanda's agri-food sector is today and where it needs to be by 2050."
            </p>
            <div className="mt-8">
              <h4 className="text-lg font-bold text-foreground">Dukuzumuremyi Eric, MSc</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Founder & Chief Executive Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Core Operations</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold text-foreground">What We Do</h2>
            <p className="mt-4 text-muted-foreground">Four major pillars designed to empower communities and secure agricultural value chains.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whatWeDo.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-card border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all flex gap-6"
                >
                  <div className="grid place-items-center w-14 h-14 rounded-2xl bg-secondary text-leaf shrink-0">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why DEACOMART */}
      <section className="py-20 md:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Value Proposition</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold text-foreground">Why Engage with Us?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyDeacomart.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-background border border-border hover:border-leaf hover:shadow-[var(--shadow-soft)] transition-all">
                <div className="w-8 h-8 rounded-full bg-leaf/10 text-leaf flex items-center justify-center font-bold text-sm mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-foreground text-lg leading-snug">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <Team team={teamMembers} />

      {/* Who Should Partner */}
      <section className="py-20 md:py-28 bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Collaboration & Investment</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold text-foreground">Who Should Partner with Us?</h2>
            <p className="mt-4 text-muted-foreground">We are actively seeking partners, investors, and collaborators across these core sectors.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-leaf transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-leaf/15 text-leaf flex items-center justify-center font-bold text-sm shrink-0">
                  ✓
                </div>
                <span className="text-sm font-medium text-foreground">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const TEAM_IMAGE_BY_ID: Record<string, string> = {
  "t-1": "/images/staff/DUKUZUMUREMYI Eric.jpeg",
  "t-3": "/images/staff/Accountant - TURIMASO Innocent.jpeg",
  "t-4": "/images/staff/HABIMANA Jpseph.jpeg",
};

function Team({ team }: { team: TeamMember[] }) {
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl text-left">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Our Team</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">
            Multidisciplinary expertise.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            Agribusiness, food science, IT, finance, and business development — under one roof.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((m) => {
            const imageSrc = m.imageUrl || TEAM_IMAGE_BY_ID[m.id];
            return (
              <div
                key={m.id || m.role}
                className="overflow-hidden rounded-2xl bg-card border border-border hover:border-leaf transition-colors text-left"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`${m.name}, ${m.role}`}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-leaf)] text-5xl font-bold text-primary-foreground">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col h-[calc(100%-100%)] justify-between">
                  <div>
                    <div className="text-xs font-semibold text-leaf uppercase tracking-wider">
                      {m.role}
                    </div>
                    <div className="mt-1 font-bold text-foreground">{m.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{m.expertise}</div>
                    {m.biography && (
                      <p className="mt-3 text-xs text-muted-foreground/80 leading-relaxed border-t border-border/50 pt-2.5 italic">
                        "{m.biography}"
                      </p>
                    )}
                  </div>
                  {(m.phone || m.email || m.socialMedia) && (
                    <div className="mt-4 flex items-center gap-2 text-muted-foreground border-t border-border/50 pt-3">
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="p-1.5 rounded-lg hover:bg-leaf/10 hover:text-leaf transition-colors"
                          title={`Email ${m.name}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          className="p-1.5 rounded-lg hover:bg-leaf/10 hover:text-leaf transition-colors"
                          title={`Call ${m.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {m.socialMedia && (
                        <a
                          href={m.socialMedia.startsWith('http') ? m.socialMedia : `https://${m.socialMedia}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-leaf/10 hover:text-leaf transition-colors"
                          title="LinkedIn / Professional profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
