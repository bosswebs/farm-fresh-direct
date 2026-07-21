import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Award, CheckCircle2, Building2, Landmark, Users, Search, ChevronRight, ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Compliance Center — Deacomart Ltd" },
      { name: "description", content: "Explore Deacomart regulatory compliance, FDA & RSB food safety accreditations, RDB registration, and verified cooperative partnerships in Rwanda." },
    ],
  }),
  component: TrustCenterPage,
});

type Certification = {
  id: string;
  name: string;
  issuer: string;
  code: string;
  description: string;
  badgeColor: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    id: "c-1",
    name: "RDB Business Registration & Tax Compliance",
    issuer: "Rwanda Development Board (RDB) & RRA",
    code: "TIN 122176313",
    description: "Registered private limited company under Article 23 of Law Nº 007/2021 of 05/02/2021 governing companies in Rwanda.",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    id: "c-2",
    name: "Rwanda FDA Food Processing License",
    issuer: "Rwanda Food and Drugs Authority",
    code: "FDA/FOOD/2025/089",
    description: "Certified food aggregation, processing, and cold storage safety protocols for fresh juices, sesame, honey, and eggs.",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    id: "c-3",
    name: "RSB Standards Quality Mark",
    issuer: "Rwanda Standards Board (RSB)",
    code: "RSB/QM-84920",
    description: "Compliance with national standards for post-harvest packaging, grading, and chemical residue controls.",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    id: "c-4",
    name: "MINAGRI Value Chain Partner",
    issuer: "Ministry of Agriculture & Animal Resources",
    code: "NST2 Agri Partner",
    description: "Recognized participant in Rwanda's NST2 agricultural priority framework for farmer capacity building.",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
];

const VERIFIED_PARTNERS = [
  { name: "Kinigi Honey Farmers Cooperative", location: "Musanze District", type: "Farmer Cooperative", members: "340 Farmers" },
  { name: "Nyabihu Tea & Spices Producers", location: "Nyabihu District", type: "Farmer Cooperative", members: "520 Farmers" },
  { name: "Kigali Marriott Hotel", location: "Kigali City", type: "Hotel Partner", channel: "Wholesale Cold Chain" },
  { name: "Sawa City Supermarket Chain", location: "Kigali City", type: "Retail Partner", channel: "Consumer Retail" },
  { name: "Inyange Retail Outlets", location: "Kigali & Eastern Province", type: "Retail Distribution", channel: "Fresh Juices & Dairy" },
];

function TrustCenterPage() {
  const { t } = useLanguage();
  const [partnerQuery, setPartnerQuery] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: "", email: "", phone: "", orgType: "Cooperative", location: "" });
  const [submitted, setSubmitted] = useState(false);

  const filteredPartners = VERIFIED_PARTNERS.filter((p) =>
    `${p.name} ${p.location} ${p.type}`.toLowerCase().includes(partnerQuery.toLowerCase().trim())
  );

  function handlePartnerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <ShieldCheck className="w-4 h-4 text-leaf" /> {t("trust.badge")}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            {t("trust.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            {t("trust.subtitle")}
          </p>
        </div>
      </section>

      {/* Accreditations Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-b border-border">
        <h2 className="text-2xl font-bold font-display mb-8">{t("trust.certifications")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-card border border-border hover:border-leaf/50 transition-all shadow-[var(--shadow-soft)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${cert.badgeColor}`}>
                    {cert.code}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{cert.issuer}</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">{cert.name}</h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{cert.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Verified License
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Ecosystem Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display">{t("trust.partners")}</h2>
            <p className="text-xs text-muted-foreground">Verified cooperative leaders, hotel buyers, and retail chains.</p>
          </div>
          <button
            onClick={() => { setShowApplyModal(true); setSubmitted(false); }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-[var(--shadow-soft)]"
          >
            <Sparkles className="w-4 h-4" /> {t("trust.become_partner")}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <input
            type="text"
            placeholder="Search partner by name, district, or category..."
            value={partnerQuery}
            onChange={(e) => setPartnerQuery(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-card px-3 pl-9 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPartners.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-card border border-border hover:border-leaf/40 transition-all flex flex-col justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-leaf">{p.type}</span>
                <h4 className="font-bold text-foreground text-sm mt-1">{p.name}</h4>
                <p className="text-muted-foreground mt-1">{p.location}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-muted-foreground font-medium">
                <span>{p.members || p.channel}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Partner Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)]">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold font-display">Partner Request Received!</h3>
                <p className="text-xs text-muted-foreground">
                  Our Partnership Operations team will inspect your credentials and reach out within 24 hours.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold font-display mb-1">Partner Verification Request</h3>
                <p className="text-xs text-muted-foreground mb-4">Apply for cooperative verification or commercial buyer partnership.</p>

                <form onSubmit={handlePartnerSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Cooperative, Hotel or Supermarket Name"
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.rw"
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+250 788 000 000"
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">District / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Musanze or Kigali"
                      value={partnerForm.location}
                      onChange={(e) => setPartnerForm({ ...partnerForm, location: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                  >
                    Submit Partner Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
