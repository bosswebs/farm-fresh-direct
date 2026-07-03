import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, Users, Leaf, TrendingUp, ShieldCheck, MapPin, Heart, Landmark, Award } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { formatRWF } from "@/lib/products-store";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "EcoWise Impact Dashboard — Deacomart Ltd" },
      { name: "description", content: "Explore the ecological and economic impact of Deacomart Ltd in Rwanda — empowering farmers and reducing post-harvest losses." },
    ],
  }),
  component: ImpactDashboardPage,
});

// Mock Recharts Data
const TRAINING_HISTORY = [
  { month: "Jan", trainees: 120, cooperatives: 8 },
  { month: "Feb", trainees: 180, cooperatives: 12 },
  { month: "Mar", trainees: 310, cooperatives: 18 },
  { month: "Apr", trainees: 450, cooperatives: 25 },
  { month: "May", trainees: 620, cooperatives: 34 },
  { month: "Jun", trainees: 840, cooperatives: 45 },
];

const LOSS_REDUCTION_BY_CROP = [
  { crop: "Tomatoes", beforeTraining: 35, afterTraining: 8 },
  { crop: "Avocado", beforeTraining: 28, afterTraining: 6 },
  { crop: "Hibiscus", beforeTraining: 18, afterTraining: 4 },
  { crop: "Potatoes", beforeTraining: 22, afterTraining: 5 },
  { crop: "Grains", beforeTraining: 15, afterTraining: 3 },
];

const REVENUE_GENERATION = [
  { month: "Jan", revenueRWF: 4500000 },
  { month: "Feb", revenueRWF: 7800000 },
  { month: "Mar", revenueRWF: 12000000 },
  { month: "Apr", revenueRWF: 19500000 },
  { month: "May", revenueRWF: 31000000 },
  { month: "Jun", revenueRWF: 48000000 },
];

const PROVINCE_IMPACT = [
  { province: "Kigali City", farmers: 680, districts: "Nyarugenge, Kicukiro, Gasabo" },
  { province: "Eastern Province", farmers: 950, districts: "Nyagatare, Bugesera, Kayonza" },
  { province: "Northern Province", farmers: 520, districts: "Musanze, Gakenke, Burera" },
  { province: "Southern Province", farmers: 410, districts: "Huye, Nyanza, Kamonyi" },
  { province: "Western Province", farmers: 380, districts: "Nyabihu, Rubavu, Karongi" },
];

function ImpactDashboardPage() {
  const [metricTab, setMetricTab] = useState<"training" | "loss" | "revenue">("training");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <BarChart3 className="w-4 h-4 text-leaf" /> "Be EcoWise" Dashboard
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            EcoWise & Economic Impact.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            Tracking Deacomart's national impact across Rwanda. Driving farmer incomes up, bringing post-harvest losses down, and securing clean supply chains.
          </p>
        </div>
      </section>

      {/* Key Metrics Counters */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactCard icon={Users} label="Total Farmers Trained" value="2,940+" desc="Across 5 Provinces" />
        <ImpactCard icon={Leaf} label="Post-Harvest Loss Saved" value="-25%" desc="Average before vs after" />
        <ImpactCard icon={TrendingUp} label="Farmer Revenue Flow" value="RWF 48M" desc="Direct market linkages" />
        <ImpactCard icon={Award} label="Safety Badges Verified" value="8,500+" desc="Certified crop listings" />
      </section>

      {/* Chart Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-[1fr_280px] gap-10">
        
        {/* Main Chart Viewer */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] flex flex-col justify-between min-h-[450px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">Statistical Performance Analysis</h3>
              <p className="text-xs text-muted-foreground">Select parameters in the panel to inspect growth charts.</p>
            </div>
            
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
              <button
                onClick={() => setMetricTab("training")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  metricTab === "training" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Farmers Trained
              </button>
              <button
                onClick={() => setMetricTab("loss")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  metricTab === "loss" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Loss Reduction
              </button>
              <button
                onClick={() => setMetricTab("revenue")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  metricTab === "revenue" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Revenue Flow
              </button>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px] text-xs font-medium text-foreground">
            {metricTab === "training" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAINING_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip cursor={{ fill: "var(--color-secondary)" }} />
                  <Legend />
                  <Bar name="Trainees Enrolled" dataKey="trainees" fill="oklch(0.72 0.18 145)" radius={[4, 4, 0, 0]} />
                  <Bar name="Cooperatives Engaged" dataKey="cooperatives" fill="oklch(0.32 0.07 155)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {metricTab === "loss" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LOSS_REDUCTION_BY_CROP} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="crop" stroke="#9CA3AF" />
                  <YAxis unit="%" stroke="#9CA3AF" />
                  <Tooltip cursor={{ fill: "var(--color-secondary)" }} />
                  <Legend />
                  <Bar name="Loss before Deacomart (%)" dataKey="beforeTraining" fill="oklch(0.6 0.22 27)" radius={[4, 4, 0, 0]} />
                  <Bar name="Loss after Deacomart (%)" dataKey="afterTraining" fill="oklch(0.72 0.18 145)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {metricTab === "revenue" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_GENERATION} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(v) => `RWF ${v / 1000000}M`} />
                  <Tooltip formatter={(v: number) => [formatRWF(v), "Revenue"]} />
                  <Legend />
                  <Area name="Farmer Cumulative Revenue (RWF)" type="monotone" dataKey="revenueRWF" stroke="oklch(0.72 0.18 145)" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Panel: Province Breakdown */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-5">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Regional Presence</h3>
            <p className="text-xs text-muted-foreground mt-1">Breakdown of active farmers by Rwandan Province.</p>
          </div>

          <div className="space-y-4">
            {PROVINCE_IMPACT.map((prov) => (
              <div key={prov.province} className="p-3 rounded-xl border border-border bg-background space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-leaf shrink-0" /> {prov.province}
                  </span>
                  <span className="font-bold text-primary shrink-0">{prov.farmers} Farmers</span>
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{prov.districts}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Landmark className="w-4 h-4 text-leaf shrink-0" />
              <span>National Target Covered</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-leaf h-2 rounded-full" style={{ width: "90%" }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>27 / 30 Districts Active</span>
              <span>90% Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals Alignments */}
      <section className="mx-auto max-w-7xl px-6 pb-24 text-center">
        <h3 className="font-display font-bold text-2xl mb-8">SDG Alignment & Goals</h3>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <GoalBox icon={Heart} title="SDG 2: Zero Hunger" desc="Empowering farmers boosts crop availability, securing food nutrition and quality across Rwanda." />
          <GoalBox icon={TrendingUp} title="SDG 8: Decent Work" desc="Upgrading smallholder cooperatives with value-addition packaging drives rural wages up." />
          <GoalBox icon={Leaf} title="SDG 12: Consumption" desc="Cutting post-harvest losses down to under 10% secures eco-wise consumption models." />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function ImpactCard({ icon: Icon, label, value, desc }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; desc: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-[var(--shadow-soft)] min-h-[140px] text-left">
      <div className="w-10 h-10 rounded-xl bg-secondary text-leaf flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-4 space-y-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{label}</span>
        <div className="font-display font-extrabold text-2xl text-primary leading-none">{value}</div>
        <span className="text-[10px] text-muted-foreground block">{desc}</span>
      </div>
    </div>
  );
}

function GoalBox({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-[image:var(--gradient-leaf)] text-primary-foreground flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-display font-bold text-lg text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}
