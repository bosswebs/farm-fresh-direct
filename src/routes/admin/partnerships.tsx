import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Handshake, Search, Plus, Edit, MapPin, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getStatusColor, formatRWF } from "../../lib/admin-data";
import {
  getPartners,
  createPartner,
  updatePartner,
  updatePartnerStatus,
  deletePartner,
} from "../../lib/admin-data.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/partnerships")({
  loader: () => getPartners(),
  component: PartnershipsPage,
});

type Partner = Awaited<ReturnType<typeof getPartners>>[number];

const emptyForm = {
  id: "",
  name: "",
  type: "hotel" as Partner["type"],
  district: "",
  contactPerson: "",
  phone: "",
  status: "pending" as Partner["status"],
};

function PartnershipsPage() {
  const loaded = Route.useLoaderData();
  const router = useRouter();
  const [partnerList, setPartnerList] = useState(loaded);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filteredPartners = partnerList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  function openAddDialog() {
    setEditingPartner({});
    setForm(emptyForm);
  }

  function openEditDialog(partner: Partner) {
    setEditingPartner(partner);
    setForm({
      id: partner.id,
      name: partner.name,
      type: partner.type as Partner["type"],
      district: partner.district,
      contactPerson: partner.contactPerson,
      phone: partner.phone,
      status: partner.status as Partner["status"],
    });
  }

  async function handleSavePartner(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        district: form.district,
        contactPerson: form.contactPerson,
        phone: form.phone,
        status: form.status,
      };

      if (form.id) {
        const updated = await updatePartner({ data: { id: form.id, ...payload } });
        setPartnerList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(`Updated ${updated.name}`);
      } else {
        const created = await createPartner({ data: payload });
        setPartnerList((prev) => [created, ...prev]);
        toast.success(`Added partner ${created.name}`);
      }
      setEditingPartner(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save partner");
    } finally {
      setSaving(false);
    }
  }

  async function handleApprovePartner(partner: Partner) {
    try {
      const updated = await updatePartnerStatus({ data: { id: partner.id, status: "active" } });
      setPartnerList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(`Partnership request approved for ${updated.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve partner");
    }
  }

  async function handleDeletePartner(partner: Partner) {
    if (!confirm(`Remove ${partner.name} from partnerships? This cannot be undone.`)) return;
    try {
      await deletePartner({ data: { id: partner.id } });
      setPartnerList((prev) => prev.filter((p) => p.id !== partner.id));
      setEditingPartner(null);
      toast.success(`Removed ${partner.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove partner");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Partnerships & Alliances</h1>
          <p className="text-sm text-gray-500">Coordinate and support retail contracts, hotels, cooperatives, and NGOs</p>
        </div>
        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
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
      {filteredPartners.length === 0 ? (
        <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl">
          <Handshake className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {partnerList.length === 0 ? "No partners yet. Click Add Partner to create one." : "No partners match your filters."}
          </p>
        </div>
      ) : (
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
                <div className="flex items-center gap-1">
                  {partner.status === "pending" && (
                    <Button onClick={() => handleApprovePartner(partner)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                      Approve
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(partner)}>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Partner Dialog */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 shadow-xl space-y-4">
            <button
              onClick={() => setEditingPartner(null)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold font-display text-gray-900 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-emerald-600" />
              {form.id ? "Edit Partner" : "Add New Partner"}
            </h2>

            <form onSubmit={handleSavePartner} className="space-y-4 text-sm">
              <div>
                <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">Organization Name *</label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kigali Marriott Hotel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">Type *</label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Partner["type"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="supermarket">Supermarket</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">District *</label>
                  <Input
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="e.g. Gasabo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">Contact Person *</label>
                  <Input
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">Phone *</label>
                  <Input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+250 78..."
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-gray-400 mb-1 block">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Partner["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                {form.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(editingPartner as Partner)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove partner
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingPartner(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {saving ? "Saving..." : "Save Partner"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
