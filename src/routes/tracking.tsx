import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Truck, MapPin, Search, Check, CheckCircle, Package, Clock, ShieldAlert, ArrowRight, ShieldCheck, ThermometerSnowflake } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Delivery Logistics & Order Tracking — Deacomart Ltd" },
      { name: "description", content: "Track your fresh food and beverage delivery from Rwandan farms to your doorstep in real time." },
    ],
  }),
  component: LogisticsTrackingPage,
});

type MockOrder = {
  id: string;
  customerName: string;
  items: string[];
  status: "Pending" | "Confirmed" | "Processing" | "In Transit" | "Delivered";
  origin: string;
  destination: string;
  driverName: string;
  vehicleNumber: string;
  temperature: string;
  eta: string;
  distance: string;
  progressPercent: number; // For route animation
};

const MOCK_ORDERS: Record<string, MockOrder> = {
  "DM-9941": {
    id: "DM-9941",
    customerName: "Gorillas Golf Hotel",
    items: ["120 Bottles of Passion Fruit Juice", "10 Jars of Pure Honey"],
    status: "In Transit",
    origin: "Musanze Organic Apiary",
    destination: "Nyarutarama, Kigali",
    driverName: "Karasira Jean",
    vehicleNumber: "RAD 882 A (Fuso Cold-Truck)",
    temperature: "4°C (Optimal Cold-Chain)",
    eta: "45 Mins",
    distance: "84 Km (Optimized Route)",
    progressPercent: 65,
  },
  "DM-8812": {
    id: "DM-8812",
    customerName: "Dove Hotel Kigali",
    items: ["30 Trays of Free-Range Eggs"],
    status: "Delivered",
    origin: "Kigali Poultry Depot",
    destination: "Gisozi, Kigali",
    driverName: "Uwiragiye Eric",
    vehicleNumber: "RAB 441 D (Vespa Delivery)",
    temperature: "18°C (Ambient Checked)",
    eta: "Delivered at 09:15 AM",
    distance: "12 Km",
    progressPercent: 100,
  },
  "DM-4520": {
    id: "DM-4520",
    customerName: "Sawa City Supermarket",
    items: ["200 Packs of Green Tea Leaves"],
    status: "Processing",
    origin: "Nyabihu Tea Estate",
    destination: "Remera, Kigali",
    driverName: "Habimana Innocent",
    vehicleNumber: "RAC 110 B (Box Van)",
    temperature: "20°C (Dry Storage Checked)",
    eta: "Tomorrow, 10:00 AM",
    distance: "135 Km",
    progressPercent: 20,
  },
};

function LogisticsTrackingPage() {
  const [orderQuery, setOrderQuery] = useState("DM-9941");
  const [activeOrder, setActiveOrder] = useState<MockOrder | null>(MOCK_ORDERS["DM-9941"]);
  const [animateTruck, setAnimateTruck] = useState(0);

  useEffect(() => {
    if (activeOrder && activeOrder.status === "In Transit") {
      const interval = setInterval(() => {
        setAnimateTruck((prev) => (prev + 1) % 100);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = orderQuery.trim().toUpperCase();
    if (MOCK_ORDERS[id]) {
      setActiveOrder(MOCK_ORDERS[id]);
      setAnimateTruck(0);
    } else {
      setActiveOrder(null);
    }
  }

  const timelineSteps = [
    { label: "Pending LPO Verification", desc: "Order details received & awaiting review", status: "Pending" },
    { label: "Order Confirmed", desc: "Farmer inventory allocated & packing started", status: "Confirmed" },
    { label: "Cold Aggregation", desc: "Checked for quality & certified packaging", status: "Processing" },
    { label: "In Transit", desc: "Dispatched from depot with temperature log", status: "In Transit" },
    { label: "Delivered & Verified", desc: "LPO receipt confirmed by recipient", status: "Delivered" },
  ];

  function getStepState(orderStatus: string, stepStatus: string) {
    const states = ["Pending", "Confirmed", "Processing", "In Transit", "Delivered"];
    const orderIndex = states.indexOf(orderStatus);
    const stepIndex = states.indexOf(stepStatus);

    if (orderIndex >= stepIndex) {
      return "completed";
    } else if (orderIndex + 1 === stepIndex) {
      return "active";
    } else {
      return "upcoming";
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <Truck className="w-4 h-4 text-leaf" /> Logistics & Supply Chain
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            Real-Time Delivery Tracker.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            Track fresh agricultural logistics from Kigali depots or district farms to hotels and supermarket retail counters.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. DM-9941, DM-8812)"
                className="input pl-10 tracking-widest font-mono font-bold"
              />
            </div>
            <button type="submit" className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity cursor-pointer">
              Track Order
            </button>
          </form>

          {/* Sample IDs */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Demo IDs:</span>
            {Object.keys(MOCK_ORDERS).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setOrderQuery(id);
                  setActiveOrder(MOCK_ORDERS[id]);
                  setAnimateTruck(0);
                }}
                className="font-mono font-bold underline hover:text-primary cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Supply visualizer grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-[1.5fr_1fr] gap-12">
        {/* Left: Interactive route mapping animation & stats */}
        {activeOrder ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Delivery Stats Header */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Logistics Partner</span>
                <p className="text-sm font-bold text-foreground">{activeOrder.driverName}</p>
                <p className="text-xs text-muted-foreground">{activeOrder.vehicleNumber}</p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-border sm:px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500" /> Temperature Log
                </span>
                <p className="text-sm font-bold text-foreground">{activeOrder.temperature}</p>
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Safe Storage Standard
                </p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:pl-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Arrival</span>
                <p className="text-sm font-bold text-leaf">{activeOrder.eta}</p>
                <p className="text-xs text-muted-foreground">Route Distance: {activeOrder.distance}</p>
              </div>
            </div>

            {/* Simulated Animated Supply Route Map */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">Transit Visualization</h3>
                <p className="text-xs text-muted-foreground">Depicts dispatch path from farm origin node to customer retail counter.</p>
              </div>

              <div className="relative h-48 mt-8 border border-border/60 bg-secondary/20 rounded-2xl flex items-center justify-center">
                {/* SVG Route Line */}
                <svg viewBox="0 0 100 40" className="w-full h-full text-muted-foreground/25 fill-none stroke-current stroke-2">
                  {/* Curved transit route */}
                  <path id="route-path" d="M 15,20 C 35,5 65,35 85,20" className="stroke-border stroke-dasharray-[2,2]" />
                  <path d="M 15,20 C 35,5 65,35 85,20" className="stroke-leaf/30" />
                </svg>

                {/* Mapped pins for Origin and Destination */}
                <div className="absolute left-[15%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-md">F</div>
                  <span className="absolute top-full mt-1.5 text-[9px] font-bold whitespace-nowrap bg-background p-1 border border-border rounded shadow-xs">{activeOrder.origin.split(" ")[0]}</span>
                </div>

                <div className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shadow-md">H</div>
                  <span className="absolute top-full mt-1.5 text-[9px] font-bold whitespace-nowrap bg-background p-1 border border-border rounded shadow-xs">{activeOrder.destination.split(" ")[0]}</span>
                </div>

                {/* Animated Moving Truck icon along path */}
                {activeOrder.status === "In Transit" && (
                  <div
                    style={{
                      left: `${15 + (animateTruck * 0.7)}%`,
                      top: `${20 + Math.sin((animateTruck / 100) * Math.PI * 2) * 15}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-leaf text-primary-foreground flex items-center justify-center shadow-lg border border-card transition-all duration-75"
                  >
                    <Truck className="w-4.5 h-4.5 animate-bounce" />
                  </div>
                )}

                {activeOrder.status === "Delivered" && (
                  <div className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Origin: {activeOrder.origin}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> Destination: {activeOrder.destination}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-16 text-center text-muted-foreground">
            <ShieldAlert className="w-12 h-12 mx-auto text-destructive opacity-80 mb-4" />
            <h3 className="text-xl font-bold">No Active Order Found</h3>
            <p className="text-sm mt-1 max-w-xs mx-auto">Please double-check the spelling of the ID. Ensure it starts with `DM-` followed by 4 digits.</p>
          </div>
        )}

        {/* Right: Chronological status history checklist */}
        <div>
          {activeOrder && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Logistics Milestones</h3>
                <p className="text-xs text-muted-foreground mt-1">Status timeline for Order reference: <strong>{activeOrder.id}</strong></p>
              </div>

              {/* Items Summary list */}
              <div className="p-3 bg-secondary/40 border border-border rounded-xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Items Packaged</span>
                <ul className="mt-1 space-y-0.5">
                  {activeOrder.items.map((item) => (
                    <li key={item} className="text-xs text-foreground font-semibold flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-leaf shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative pl-6 space-y-6 border-l border-border mt-4 ml-3">
                {timelineSteps.map((step) => {
                  const state = getStepState(activeOrder.status, step.status);
                  return (
                    <div key={step.status} className="relative group">
                      {/* Step bullet dot */}
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-card flex items-center justify-center transition-all ${
                        state === "completed" ? "border-emerald-500 bg-emerald-500 text-white" :
                        state === "active" ? "border-leaf ring-4 ring-leaf/25" : "border-border"
                      }`}>
                        {state === "completed" && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                      </span>

                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold transition-colors ${
                          state === "completed" ? "text-emerald-500" :
                          state === "active" ? "text-primary font-extrabold" : "text-muted-foreground"
                        }`}>
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-snug">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
