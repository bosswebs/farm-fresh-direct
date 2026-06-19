import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Globe, MapPin, Search, ChevronRight, Activity, Leaf, GraduationCap, Building2 } from "lucide-react";
import { rwandaProvinces } from "../../lib/admin-data";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/admin/geographic")({
  component: GeographicCoveragePage,
});

function GeographicCoveragePage() {
  const [selectedProvince, setSelectedProvince] = useState<typeof rwandaProvinces[0] | null>(rwandaProvinces[0]);
  const [activeLayer, setActiveLayer] = useState<"farmers" | "logistics" | "centers">("farmers");

  const totalFarmers = rwandaProvinces.reduce((acc, curr) => acc + curr.farmers, 0);

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
        {/* Left column: Interactive SVG / Coverage Map representation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" /> Rwanda Operational Map Representation
            </h2>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">Active in all 30 Districts</Badge>
          </div>

          {/* Simple visual interactive map mockup */}
          <div className="h-80 bg-emerald-50/20 rounded-2xl border border-emerald-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="grid grid-cols-5 gap-3 p-4 w-full max-w-md relative z-10">
              {rwandaProvinces.map((prov) => (
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
              <div className="text-xl font-bold text-gray-900 font-display">{totalFarmers}</div>
              <div className="text-[10px] text-gray-400">Total Covered Farmers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl font-bold text-gray-900 font-display">5</div>
              <div className="text-[10px] text-gray-400">Provinces Active</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xl font-bold text-gray-900 font-display">30</div>
              <div className="text-[10px] text-gray-400">Districts Active</div>
            </div>
          </div>
        </div>

        {/* Right column: Selected province breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          {selectedProvince ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-gray-950 font-display">{selectedProvince.name}</h2>
                <p className="text-xs text-gray-400">Operational Breakdown & Density</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Covered Districts ({selectedProvince.districts.length})</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedProvince.districts.map(d => (
                      <Badge key={d} variant="outline" className="text-[10px] font-medium text-gray-700">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Primary Hub Centers</span>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-800">{selectedProvince.name.split(" ")[0]} Main Warehouse</span>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[9px]">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-800">Seed Distribution Center</span>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[9px]">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-10">Select a province to view district and warehouse details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
