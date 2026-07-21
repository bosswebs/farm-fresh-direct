import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, CheckCircle2, Award, Sparkles, Send, ShieldCheck, Users, Smartphone, Store, Layers } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/lib/i18n";
import { formatRWF } from "@/lib/products-store";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Agri-Advertising & Sponsorships — Deacomart Ltd" },
      { name: "description", content: "Promote agricultural machinery, seeds, fertilizers, and crop insurance directly to 2,900+ farmer cooperatives and commercial buyers across Rwanda." },
    ],
  }),
  component: AdvertisePage,
});

type AdPackage = {
  id: string;
  name: string;
  channel: string;
  priceRWF: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  audience: string;
};

const AD_PACKAGES: AdPackage[] = [
  {
    id: "pkg-1",
    name: "Marketplace Header Banner",
    channel: "Deacomart Marketplace Top Placement",
    priceRWF: 120000,
    icon: Store,
    audience: "15,000+ Monthly Buyers & Hotels",
    features: [
      "Prime hero banner placement on Deacomart Shop",
      "Direct link to vendor website or WhatsApp catalog",
      "Real-time click and impression tracking",
      "7 Days Duration",
    ],
  },
  {
    id: "pkg-2",
    name: "Direct Farmer SMS Broadcaster",
    channel: "Targeted SMS Push to Cooperative Leaders",
    priceRWF: 250000,
    icon: Smartphone,
    audience: "2,940+ Verified Farmer Leaders across 30 Districts",
    features: [
      "Broadcast text message directly to cooperative decision makers",
      "Promote seed varieties, organic fertilizers, or farm machinery",
      "Filter by District or Crop Type (e.g. Potatoes, Tea, Horticulture)",
      "Single Campaign Broadcast",
    ],
  },
  {
    id: "pkg-3",
    name: "Featured Producer & Quality Badge",
    channel: "Ranked Listing & Verified Badge",
    priceRWF: 80000,
    icon: Award,
    audience: "Supermarket Chains & Export Agents",
    features: [
      "Top spot ranking in Marketplace search & category filters",
      "Verified EcoWise Gold Badge highlight",
      "Dedicated featured product card on Deacomart homepage",
      "14 Days Duration",
    ],
  },
  {
    id: "pkg-4",
    name: "Farmer Academy Sponsor",
    channel: "Deacomart E-Learning & Training Modules",
    priceRWF: 350000,
    icon: Layers,
    audience: "Farmers & Agricultural Students Nationwide",
    features: [
      "Brand logo on Farmer Academy course certificates",
      "Dedicated sponsored video segment in e-learning portal",
      "Distribution of branded training manuals to cooperatives",
      "1 Month Sponsorship",
    ],
  },
];

function AdvertisePage() {
  const { t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<AdPackage>(AD_PACKAGES[0]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [adForm, setAdForm] = useState({ company: "", contactName: "", email: "", phone: "", budget: "120,000 RWF", Goal: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleAdSubmit(e: React.FormEvent) {
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
            <Megaphone className="w-4 h-4 text-leaf" /> {t("advertise.badge")}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            {t("advertise.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            {t("advertise.subtitle")}
          </p>
        </div>
      </section>

      {/* Advertising Packages Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-bold font-display mb-8">{t("advertise.packages")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {AD_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className="p-6 rounded-3xl bg-card border border-border hover:border-leaf/50 transition-all shadow-[var(--shadow-soft)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-leaf/10 text-leaf flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-extrabold font-display text-foreground">
                      {formatRWF(pkg.priceRWF)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-leaf font-semibold mt-0.5">{pkg.channel}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">Audience: {pkg.audience}</p>

                  <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border">
                  <button
                    onClick={() => { setSelectedPackage(pkg); setShowFormModal(true); setSubmitted(false); }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-[var(--shadow-soft)]"
                  >
                    <Send className="w-4 h-4" /> Book {pkg.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Request Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)]">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold font-display">Campaign Request Submitted!</h3>
                <p className="text-xs text-muted-foreground">
                  Our Commercial Marketing team will review your campaign details and send an official proposal within 12 hours.
                </p>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold font-display mb-1">Book Ad Campaign</h3>
                <p className="text-xs text-muted-foreground mb-4">Package: <strong className="text-foreground">{selectedPackage.name}</strong> ({formatRWF(selectedPackage.priceRWF)})</p>

                <form onSubmit={handleAdSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Company / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Agritech Supplies Ltd"
                      value={adForm.company}
                      onChange={(e) => setAdForm({ ...adForm, company: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={adForm.contactName}
                      onChange={(e) => setAdForm({ ...adForm, contactName: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      value={adForm.email}
                      onChange={(e) => setAdForm({ ...adForm, email: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+250 788 000 000"
                      value={adForm.phone}
                      onChange={(e) => setAdForm({ ...adForm, phone: e.target.value })}
                      className="flex h-9 w-full rounded-xl border border-input bg-background px-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Campaign Goal / Product to Promote</label>
                    <textarea
                      rows={2}
                      placeholder="Describe what product or service you wish to advertise..."
                      value={adForm.Goal}
                      onChange={(e) => setAdForm({ ...adForm, Goal: e.target.value })}
                      className="flex w-full rounded-xl border border-input bg-background p-2.5 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                  >
                    Submit Booking Request
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
