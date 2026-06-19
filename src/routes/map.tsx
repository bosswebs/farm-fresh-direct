import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Navigation, Building2, Store, Users, Coffee, Truck, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Location Map & Partner Network — Deacomart Ltd" },
      { name: "description", content: "Locate farmers, buyers, partner hotels, supermarkets, and distribution centers across Rwanda." },
    ],
  }),
  component: MarketMapPage,
});

type MapEntity = {
  id: string;
  name: string;
  type: "farmer" | "hotel" | "supermarket" | "distribution" | "processing";
  district: string;
  locationDetails: string;
  description: string;
  coordinates: { x: number; y: number }; // relative % on SVG
  contact: string;
  products?: string[];
};

const ENTITIES: MapEntity[] = [
  {
    id: "e-1",
    name: "Deacomart Kigali Depot",
    type: "distribution",
    district: "Kigali (Nyarugenge)",
    locationDetails: "Kigali City, Rwanda",
    description: "Central aggregation and cold storage facility, handling distribution to supermarkets, hotels, and restaurants.",
    coordinates: { x: 50, y: 50 },
    contact: "+250 780 165 257",
    products: ["All juices, beverages, honey, sesame, and fresh eggs"],
  },
  {
    id: "e-2",
    name: "Nyagatare Farmers Cooperative",
    type: "farmer",
    district: "Nyagatare",
    locationDetails: "Eastern Province, Cyabayaga",
    description: "Our primary source for hibiscus, black tea, and dry cereals. Formed by 150+ smallholder farmers.",
    coordinates: { x: 82, y: 22 },
    contact: "+250 788 000 111",
    products: ["Hibiscus tea leaves", "Premium black tea"],
  },
  {
    id: "e-3",
    name: "Volcanoes Organic Apiary",
    type: "farmer",
    district: "Musanze",
    locationDetails: "Northern Province, Musanze",
    description: "Highland beekeeping collective producing single-origin organic honey near the Volcanoes National Park.",
    coordinates: { x: 35, y: 24 },
    contact: "+250 788 222 333",
    products: ["Pure Rwandan Honey"],
  },
  {
    id: "e-4",
    name: "Huye Avocado Orchards",
    type: "farmer",
    district: "Huye",
    locationDetails: "Southern Province, Huye",
    description: "Multi-family avocado farming collective specializing in Hass and Fuerte organic avocado production.",
    coordinates: { x: 38, y: 76 },
    contact: "+250 788 444 555",
    products: ["Hass Avocados"],
  },
  {
    id: "e-5",
    name: "Bugesera Sesame Fields",
    type: "farmer",
    district: "Bugesera",
    locationDetails: "Eastern Province, Nyamata",
    description: "Semi-arid growers association specializing in climate-resilient organic sesame seeds and sunflower oil.",
    coordinates: { x: 62, y: 64 },
    contact: "+250 788 666 777",
    products: ["Roasted Sesame Seeds"],
  },
  {
    id: "e-6",
    name: "Gorillas Golf Hotel",
    type: "hotel",
    district: "Kigali (Gasabo)",
    locationDetails: "Nyarutarama, Kigali",
    description: "Premium hospitality partner supplying fresh juices and quality organic products daily.",
    coordinates: { x: 54, y: 46 },
    contact: "+250 788 888 999",
  },
  {
    id: "e-7",
    name: "Dove Hotel Kigali",
    type: "hotel",
    district: "Kigali (Nyarugenge)",
    locationDetails: "Gisozi, Kigali",
    description: "Leading hotel partner sourcing free-range eggs, organic honey, and breakfast beverage assortments.",
    coordinates: { x: 48, y: 44 },
    contact: "+250 789 101 112",
  },
  {
    id: "e-8",
    name: "Nyabihu Highland Tea Growers",
    type: "farmer",
    district: "Nyabihu",
    locationDetails: "Western Province, Nyabihu",
    description: "High-altitude tea plantation supplying organic green tea leaves directly to Deacomart packaging plant.",
    coordinates: { x: 22, y: 34 },
    contact: "+250 783 999 888",
    products: ["Green Tea Leaves"],
  },
  {
    id: "e-9",
    name: "Kigali Eco-Processing Plant",
    type: "processing",
    district: "Kigali (Kicukiro)",
    locationDetails: "Special Economic Zone",
    description: "Value-addition facility where raw passion fruit, honey, and teas are inspected, packaged, and bottled.",
    coordinates: { x: 55, y: 55 },
    contact: "+250 780 165 257",
    products: ["Salsa", "Bottled Juices"],
  },
  {
    id: "e-10",
    name: "Sawa City Supermarket",
    type: "supermarket",
    district: "Kigali (Gasabo)",
    locationDetails: "Kigali Center & Remera",
    description: "Retail chain distributing Deacomart natural health products and beverages directly to consumers.",
    coordinates: { x: 52, y: 48 },
    contact: "+250 788 333 444",
  },
];

function MarketMapPage() {
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(ENTITIES[0]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  const districts = useMemo(() => {
    const set = new Set<string>();
    ENTITIES.forEach((e) => set.add(e.district.split(" ")[0]));
    return Array.from(set).sort();
  }, []);

  const filteredEntities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ENTITIES.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      if (selectedDistrict !== "all" && !e.district.startsWith(selectedDistrict)) return false;
      if (q && !`${e.name} ${e.district} ${e.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filterType, searchQuery, selectedDistrict]);

  const typeMeta = {
    farmer: { label: "Farmer Cooperative", icon: Users, color: "bg-emerald-500", text: "text-emerald-500" },
    hotel: { label: "Hotel Partner", icon: Coffee, color: "bg-amber-500", text: "text-amber-500" },
    supermarket: { label: "Supermarket / Retailer", icon: Store, color: "bg-indigo-500", text: "text-indigo-500" },
    distribution: { label: "Distribution Center", icon: Truck, color: "bg-blue-600", text: "text-blue-500" },
    processing: { label: "Processing Plant", icon: Building2, color: "bg-purple-500", text: "text-purple-500" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Header */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold text-leaf uppercase tracking-wider">Module 2: Location-Based Access</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground">Rwanda Agribusiness Map.</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Locate smallholder farmer cooperatives, partner hotels, supermarkets, and Deacomart hubs across the districts of Rwanda.
          </p>

          {/* Map Controls */}
          <div className="mt-8 bg-card rounded-2xl p-4 shadow-[var(--shadow-soft)] border border-border grid md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-xl">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entities, e.g. apiary..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </label>

            <label className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-xl">
              <span className="text-xs text-muted-foreground uppercase font-bold shrink-0">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent outline-none text-sm w-full text-foreground font-semibold"
              >
                <option value="all">All Entities</option>
                <option value="farmer">Farmers / Cooperatives</option>
                <option value="hotel">Hotels & Restaurants</option>
                <option value="supermarket">Supermarkets</option>
                <option value="distribution">Distribution Depot</option>
                <option value="processing">Processing Plant</option>
              </select>
            </label>

            <label className="flex items-center gap-2 px-3 py-2 border border-border bg-background rounded-xl">
              <span className="text-xs text-muted-foreground uppercase font-bold shrink-0">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent outline-none text-sm w-full text-foreground font-semibold"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Main Interactive Map & Details Area */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-[2fr_1fr] gap-10">
        
        {/* Interactive Map Visualizer */}
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl bg-secondary/30 border border-border overflow-hidden p-6 flex items-center justify-center shadow-[var(--shadow-soft)]">
            
            {/* Grid overlay for tech look */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60" />
            
            {/* Rwanda Abstract Boundaries SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[500px] text-muted-foreground/15 fill-current stroke-border stroke-[0.4] relative z-10 transition-colors">
              {/* Abstract Rwanda Map Outline shape */}
              <path d="M 20,40 C 25,30 35,20 50,20 C 65,20 80,25 85,30 C 90,35 95,45 90,60 C 85,75 75,80 65,80 C 50,85 30,85 20,75 C 10,65 15,50 20,40 Z" />
              
              {/* Province Grid Lines */}
              <line x1="50" y1="20" x2="50" y2="83" className="stroke-border/40 dasharray-[1,1]" />
              <line x1="18" y1="50" x2="92" y2="50" className="stroke-border/40 dasharray-[1,1]" />
            </svg>

            {/* Live Interactive Pins */}
            {filteredEntities.map((ent) => {
              const meta = typeMeta[ent.type];
              const isSelected = selectedEntity?.id === ent.id;
              return (
                <button
                  key={ent.id}
                  onClick={() => setSelectedEntity(ent)}
                  style={{ left: `${ent.coordinates.x}%`, top: `${ent.coordinates.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 flex items-center justify-center cursor-pointer"
                >
                  {/* Pin ripple circle */}
                  <span className={`absolute inline-flex rounded-full h-8 w-8 animate-ping opacity-25 ${meta.color} ${isSelected ? "scale-125" : "scale-75"}`} />
                  
                  {/* Pin main dot */}
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center border-2 border-card shadow-[var(--shadow-soft)] relative transition-all group-hover:scale-125 ${meta.color} ${
                    isSelected ? "ring-4 ring-leaf/30 scale-125" : ""
                  }`} />

                  {/* Tiny tooltip indicator */}
                  <span className="pointer-events-none absolute bottom-full mb-2 bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-30">
                    {ent.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> Deacomart Central Depot</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Farmers & Cooperatives</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Hotels & Restaurants</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500" /> Supermarkets</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> Processing Centers</div>
          </div>
        </div>

        {/* Details Card Panel */}
        <div className="space-y-6">
          {selectedEntity ? (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] sticky top-24 space-y-5">
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${typeMeta[selectedEntity.type].color} text-white`}>
                  {typeMeta[selectedEntity.type].label}
                </span>
                <h3 className="font-display font-bold text-2xl text-foreground mt-4 leading-tight">{selectedEntity.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4 text-leaf" /> {selectedEntity.locationDetails} ({selectedEntity.district} District)
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the Entity</h4>
                <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">{selectedEntity.description}</p>
              </div>

              {selectedEntity.products && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Produce</h4>
                  <ul className="mt-2 space-y-1">
                    {selectedEntity.products.map((prod) => (
                      <li key={prod} className="text-xs text-foreground font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-leaf shrink-0" />
                        {prod}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact details</h4>
                  <p className="text-sm font-semibold text-foreground mt-1">{selectedEntity.contact}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  {selectedEntity.type === "farmer" || selectedEntity.type === "distribution" ? (
                    <Link
                      to="/browse"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Shop Catalog <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={`https://wa.me/250780165257?text=${encodeURIComponent(`Hello Deacomart, I would like to inquire about collaboration with partner: ${selectedEntity.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Inquire Alliance
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-soft)] text-center text-muted-foreground">
              <Navigation className="w-10 h-10 mx-auto opacity-50 mb-2" />
              <p className="font-semibold">Select an entity on the map to inspect location profiles, crop varieties, and contacts.</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
