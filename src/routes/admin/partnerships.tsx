import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Search, Plus, ExternalLink, Calendar, MapPin, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { partners, getStatusColor, formatRWF } from "../../lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/partnerships")({
  component: PartnershipsPage,
});

function PartnershipsPage() {
  const [partnerList, setPartnerList] = useState(partners);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPartners = partnerList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApprovePartner = (id: string) => {
    setPartnerList(prev => prev.map(p => p.id === id ? { ...p, status: "active" as const } : p));
    toast.success(`Partnership request approved for ${partnerList.find(p => p.id === id)?.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Partnerships & Alliances</h1>
          <p className="text-sm text-gray-500">Coordinate and support retail contracts, hotels, cooperatives, and NGOs</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Add Partner
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by partner name, contact, or ID..."
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Partner Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="supermarket">Supermarkets</SelectItem>
              <SelectItem value="cooperative">Cooperatives</SelectItem>
              <SelectItem value="ngo">NGOs</SelectItem>
              <SelectItem value="government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="capitalize text-[10px] font-semibold">
                  {partner.type}
                </Badge>
                <Badge className={`text-[10px] font-bold border ${getStatusColor(partner.status)}`}>
                  {partner.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-gray-950 leading-tight">{partner.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{partner.district} District</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-600 space-y-1">
                <div>Contact: <span className="font-semibold text-gray-800">{partner.contactPerson}</span></div>
                <div>Phone: <span className="font-semibold text-gray-800">{partner.phone}</span></div>
                <div>Since: <span className="text-gray-400">{partner.since}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Transacted</span>
                <span className="text-sm font-bold text-emerald-800">{formatRWF(partner.totalValue)}</span>
              </div>
              <div>
                {partner.status === "pending" ? (
                  <Button onClick={() => handleApprovePartner(partner.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                    Approve
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toast.success("Opening partner file")}>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
