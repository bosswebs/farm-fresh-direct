import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Globe, MapPin, Leaf } from "lucide-react";
import { getGeographicStats } from "../../lib/admin-data.server";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/admin/geographic")({
  loader: () => getGeographicStats(),
  component: GeographicCoveragePage,
});

// Static structure — Rwanda provinces and their districts
const PROVINCES = [
  {
    name: "Kigali City",
    color: "from-emerald-500 to-emerald-700",
    districts: ["Gasabo", "Kicukiro", "Nyarugenge"],
  },
  {
    name: "Northern Province",
    color: "from-teal-500 to-teal-700",
    districts: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  },
  {
    name: "Southern Province",
    color: "from-blue-500 to-blue-700",
    districts: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  },
  {
    name: "Eastern Province",
    color: "from-violet-500 to-violet-700",
    districts: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  },
  {
    name: "Western Province",
    color: "from-orange-500 to-orange-700",
    districts: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"],
  },
];

function GeographicCoveragePage() {
  const geoStats = Route.useLoaderData();
  const farmersByDistrict = new Map(geoStats.map((g) => [g.district, g.farmers]));

  const provinces = PROVINCES.map((p) => ({
    ...p,
    farmers: p.districts.reduce((sum, d) => sum + (farmersByDistrict.get(d) ?? 0), 0),
  }));

  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
  const [activeLayer, setActiveLayer] = useState<"farmers" | "logistics">("farmers");

  const totalFarmers = geoStats.reduce((sum, g) => sum + g.farmers, 0);
  const coveredDistricts = new Set(geoStats.map((g) => g.district)).size;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-display">Geographic Coverage</h1>
        <p className="text-sm text-gray-500">Track distribution centers, active cooperative networks, and district outreach across Rwanda</p>
      </div>

      {/* Layer Toggles */}
      <div className="flex gap-2">
        <Button
          variant={activeLayer === "farmers" ? "default" : "outline"}
          onClick={() => setActiveLayer("farmers")}
          className={`h-9 text-xs gap-1.5 ${activeLayer === "farmers" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
        >
          <Leaf className="w-3.5 h-3.5" /> Farmer Density
        </Button>
        <Button
          variant={activeLayer === "logistics" ? "default" : "outline"}
          onClick={() => setActiveLayer("logistics")}
          className={`h-9 text-xs gap-1.5 ${activeLayer === "logistics" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
        >
          <MapPin className="w-3.5 h-3.5" /> Distribution Centers
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map representation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" /> Rwanda Operational Map
            </h2>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">
              {coveredDistricts} Districts with Farmers
            </Badge>
          </div>

          <div className="h-80 bg-emerald-50/20 rounded-2xl border border-emerald-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="grid grid-cols-5 gap-3 p-4 w-full max-w-md relative z-10">
              {provinces.map((prov) => (
                <button
                  key={prov.name}
                  onClick={() => setSelectedProvince(prov)}
                  className={`aspect-square rounded-2xl p-2 border flex flex-col items-center justify-center transition-all cursor-pointer shadow-xs
                    ${selectedProvince?.name === prov.name
                      ? "bg-emerald-600 text-white border-emerald-600 scale-105"
                      : "bg-white text-gray-700 border-gray-100 hover:border-emerald-300"
                    }`}
                >
                  <span className="text-[10px] font-bold text-center leading-tight line-clamp-1">{prov.name.split(" ")[0]}</span>
                  <span className={`text-xs font-extrabold mt-1 ${selectedProvince?.name === prov.name ? "text-white" : "text-emerald-700"}`}>
                    {prov.farmers}
                  </span>
                  <span className="text-[7px] opacity-65">farmers</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl font-bold text-gray-900 font-display">{totalFarmers.toLocaleString()}</div>
              <div className="text-[10px] text-gray-400">Total Registered Farmers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl font-bold text-gray-900 font-display">5</div>
              <div className="text-[10px] text-gray-400">Provinces Active</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl font-bold text-gray-900 font-display">30</div>
              <div className="text-[10px] text-gray-400">Districts Targeted</div>
            </div>
          </div>
        </div>

        {/* Selected province breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          {selectedProvince ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-gray-950 font-display">{selectedProvince.name}</h2>
                <p className="text-xs text-gray-400">Farmer Density by District</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Districts ({selectedProvince.districts.length})</span>
                <div className="space-y-2">
                  {selectedProvince.districts.map((d) => {
                    const count = farmersByDistrict.get(d) ?? 0;
                    const max = Math.max(...selectedProvince.districts.map((x) => farmersByDistrict.get(x) ?? 0), 1);
                    return (
                      <div key={d} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-700 font-medium">{d}</span>
                          <span className="text-emerald-700 font-bold">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Hub Centers</span>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-800">{selectedProvince.name.split(" ")[0]} Warehouse</span>
                    <Badge className="bg-emerald-50 text-emerald-700 text-[9px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-800">Seed Distribution Center</span>
                    <Badge className="bg-emerald-50 text-emerald-700 text-[9px]">Active</Badge>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-10">Select a province to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
