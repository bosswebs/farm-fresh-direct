import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Building2, User, Hotel, ShoppingBag, Landmark, MoreHorizontal, TrendingUp, Eye, Ban, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { formatRWF, getStatusColor, type Buyer } from "../../../lib/admin-data";
import { getBuyers } from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/users/buyers")({
  loader: () => getBuyers(),
  component: BuyersPage,
});

const typeIcons: Record<Buyer["type"], React.ElementType> = {
  individual: User,
  hotel: Hotel,
  restaurant: Building2,
  supermarket: ShoppingBag,
  institution: Landmark,
};

const typeColors: Record<Buyer["type"], string> = {
  individual: "bg-blue-50 text-blue-700 border-blue-200",
  hotel: "bg-violet-50 text-violet-700 border-violet-200",
  restaurant: "bg-orange-50 text-orange-700 border-orange-200",
  supermarket: "bg-teal-50 text-teal-700 border-teal-200",
  institution: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function BuyersPage() {
  const buyers = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = buyers.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.district.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || b.type === typeFilter;
    return matchSearch && matchType;
  });

  const typeCounts = {
    individual: buyers.filter((b) => b.type === "individual").length,
    hotel: buyers.filter((b) => b.type === "hotel").length,
    restaurant: buyers.filter((b) => b.type === "restaurant").length,
    supermarket: buyers.filter((b) => b.type === "supermarket").length,
    institution: buyers.filter((b) => b.type === "institution").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Buyer Management</h1>
          <p className="text-sm text-gray-500">Manage buyer accounts, order history, and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><User className="w-4 h-4" />Add Buyer</Button>
        </div>
      </div>

      {/* Type Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(typeCounts) as Buyer["type"][]).map((type) => {
          const Icon = typeIcons[type];
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm
                ${typeFilter === type ? "border-emerald-400 bg-emerald-50 shadow-sm" : "bg-white border-gray-100"}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${typeColors[type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-800 font-display">{typeCounts[type]}</div>
                <div className="text-[10px] text-gray-400 capitalize">{type}s</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search buyers by name or district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((buyer) => {
          const typeKey = buyer.type as "hotel" | "supermarket" | "individual" | "restaurant" | "institution";
          const Icon = typeIcons[typeKey];
          return (
            <div key={buyer.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${typeColors[typeKey]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight">{buyer.name}</div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${typeColors[typeKey]}`}>
                      {buyer.type}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="w-3.5 h-3.5" />View Profile</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-600"><Ban className="w-3.5 h-3.5" />Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-900 font-display">{buyer.totalOrders}</div>
                  <div className="text-[10px] text-gray-400">Total Orders</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-emerald-700 font-display">{formatRWF(buyer.totalSpent)}</div>
                  <div className="text-[10px] text-emerald-600">Total Spent</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">{buyer.district} · Joined {buyer.joinDate}</div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(buyer.status)}`}>
                  {buyer.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-gray-400 py-2">
        Showing {filtered.length} of {buyers.length} buyers
      </div>
    </div>
  );
}
