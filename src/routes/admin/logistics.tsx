import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Truck, MapPin, Search, Plus, RefreshCw, Edit2, Trash2, X, Save,
  CheckCircle, PackageOpen,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { getStatusColor } from "../../lib/admin-data";
import {
  getDeliveries, getVehicles, getStaff,
  createVehicle, updateVehicle, updateVehicleStatus, deleteVehicle,
} from "../../lib/admin-data.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/logistics")({
  loader: async () => ({
    deliveries: await getDeliveries(),
    vehicles: await getVehicles(),
    staff: await getStaff(),
  }),
  component: LogisticsPage,
});

type Vehicle = {
  id: string;
  plate: string;
  type: string;
  driver: string;
  capacity: string;
  status: string;
  lastMaintenance: string;
};

const VEHICLE_TYPES = [
  "Pickup Truck",
  "Refrigerated Van",
  "Motorcycle",
  "Flatbed Truck",
  "Cargo Van",
  "Mini-bus",
];

const VEHICLE_STATUSES = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "inactive", label: "Inactive" },
] as const;

const BLANK_FORM = {
  plate: "",
  type: "Pickup Truck",
  driverName: "TBD",
  capacity: "",
  status: "active" as "active" | "maintenance" | "inactive",
  lastMaintenance: "",
};

function LogisticsPage() {
  const { deliveries: loadedDeliveries, vehicles: loadedVehicles, staff } = Route.useLoaderData();

  const [activeTab, setActiveTab] = useState<"deliveries" | "vehicles">("deliveries");
  const [deliveryList, setDeliveryList] = useState(loadedDeliveries);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(loadedVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const drivers = staff.filter((s) => s.role === "driver");

  // ── Delivery helpers ──
  const filteredDeliveries = deliveryList.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleUpdateStatus(id: string, newStatus: any) {
    setDeliveryList((prev) => prev.map((d) => d.id === id ? { ...d, status: newStatus } : d));
    toast.success(`Delivery ${id} status updated to ${newStatus}`);
  }

  function handleAssignDriver(deliveryId: string, driverName: string) {
    const vehicle = vehicleList.find((v) => v.driver === driverName)?.plate ?? "—";
    setDeliveryList((prev) =>
      prev.map((d) => d.id === deliveryId ? { ...d, driver: driverName, vehicle } : d),
    );
    toast.success(`Assigned driver ${driverName} to delivery ${deliveryId}`);
  }

  // ── Vehicle modal helpers ──
  function openAdd() {
    setEditingVehicle(null);
    setForm(BLANK_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditingVehicle(v);
    setForm({
      plate: v.plate,
      type: v.type,
      driverName: v.driver,
      capacity: v.capacity,
      status: v.status as "active" | "maintenance" | "inactive",
      lastMaintenance: v.lastMaintenance === "—" ? "" : v.lastMaintenance,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editingVehicle) {
        const updated = await updateVehicle({ data: { ...form, id: editingVehicle.id } });
        setVehicleList((prev) => prev.map((v) => v.id === editingVehicle.id ? updated : v));
        toast.success(`${updated.plate} updated.`);
      } else {
        const created = await createVehicle({ data: form });
        setVehicleList((prev) => [created, ...prev]);
        toast.success(`${created.plate} added to fleet.`);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message ?? "Could not save vehicle.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: string, status: "active" | "maintenance" | "inactive") {
    setBusyId(id);
    try {
      const updated = await updateVehicleStatus({ data: { id, status } });
      setVehicleList((prev) => prev.map((v) => v.id === id ? updated : v));
      toast.success(`${updated.plate} is now ${status}.`);
    } catch {
      toast.error("Could not update vehicle status.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await deleteVehicle({ data: { id } });
      setVehicleList((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle removed from fleet.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not delete vehicle.");
    } finally {
      setBusyId(null);
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Logistics &amp; Delivery</h1>
          <p className="text-sm text-gray-500">Dispatch drivers, manage vehicles, and track marketplace shipments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Refreshed delivery status maps")}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          {activeTab === "vehicles" ? (
            <Button
              id="add-vehicle-btn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={openAdd}
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Delivery
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["deliveries", "vehicles"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px capitalize
              ${activeTab === tab
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "deliveries" ? "Deliveries Queue" : "Vehicle Fleet"}
          </button>
        ))}
      </div>

      {/* ── Deliveries tab ── */}
      {activeTab === "deliveries" ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, buyer, or farmer..."
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400">{delivery.id}</span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">
                      {delivery.distance}
                    </Badge>
                  </div>
                  <Select value={delivery.status} onValueChange={(val) => handleUpdateStatus(delivery.id, val)}>
                    <SelectTrigger className="w-32 h-8 text-xs font-semibold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> Origin
                    </div>
                    <div className="text-xs font-semibold text-gray-800">{delivery.farmer}</div>
                    <div className="text-[10px] text-gray-400">{delivery.pickupDistrict} District</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-500" /> Destination
                    </div>
                    <div className="text-xs font-semibold text-gray-800">{delivery.buyer}</div>
                    <div className="text-[10px] text-gray-400">{delivery.deliveryDistrict} District</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 items-center">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Driver</div>
                    <Select value={delivery.driver} onValueChange={(val) => handleAssignDriver(delivery.id, val)}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {drivers.map((d) => (
                          <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Vehicle</div>
                    <div className="text-xs font-bold font-mono text-gray-900 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                      {delivery.vehicle}
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Vehicles tab ── */
        <div className="space-y-4">
          {vehicleList.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <PackageOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No vehicles registered yet</h3>
              <p className="text-sm text-gray-400 mb-6">Add your first vehicle to start managing the fleet.</p>
              <Button
                id="empty-add-vehicle-btn"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={openAdd}
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleList.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-400">{vehicle.id}</span>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">{vehicle.plate}</h3>
                    </div>
                    <Select
                      value={vehicle.status}
                      onValueChange={(val) =>
                        handleStatusChange(vehicle.id, val as "active" | "maintenance" | "inactive")
                      }
                      disabled={busyId === vehicle.id}
                    >
                      <SelectTrigger className="w-36 h-7 text-[11px] font-bold border-0 p-0 shadow-none focus:ring-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status.toUpperCase()}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span className="font-semibold text-gray-900">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Driver</span>
                      <span className="font-semibold text-gray-900">{vehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Load Capacity</span>
                      <span className="font-semibold text-gray-900">{vehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Service</span>
                      <span className="text-xs text-gray-400">{vehicle.lastMaintenance}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <Button
                      id={`edit-vehicle-${vehicle.id}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs"
                      onClick={() => openEdit(vehicle)}
                      disabled={busyId === vehicle.id}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>

                    {deletingId === vehicle.id ? (
                      /* Inline delete confirm */
                      <div className="flex gap-1.5 flex-1">
                        <Button
                          id={`confirm-delete-vehicle-${vehicle.id}`}
                          size="sm"
                          variant="destructive"
                          className="flex-1 text-xs gap-1"
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={busyId === vehicle.id}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        id={`delete-vehicle-${vehicle.id}`}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeletingId(vehicle.id)}
                        disabled={busyId === vehicle.id}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit Vehicle Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5">
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                    Plate Number *
                  </label>
                  <Input
                    id="vehicle-plate"
                    required
                    maxLength={20}
                    placeholder="e.g. RAB 483 A"
                    value={form.plate}
                    onChange={(e) => setForm((f) => ({ ...f, plate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                    Vehicle Type *
                  </label>
                  <Select
                    value={form.type}
                    onValueChange={(val) => setForm((f) => ({ ...f, type: val }))}
                  >
                    <SelectTrigger id="vehicle-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                  Assigned Driver
                </label>
                <Select
                  value={form.driverName}
                  onValueChange={(val) => setForm((f) => ({ ...f, driverName: val }))}
                >
                  <SelectTrigger id="vehicle-driver">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TBD">Unassigned (TBD)</SelectItem>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                    Load Capacity *
                  </label>
                  <Input
                    id="vehicle-capacity"
                    required
                    maxLength={60}
                    placeholder="e.g. 1,500 kg"
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                    Status
                  </label>
                  <Select
                    value={form.status}
                    onValueChange={(val) =>
                      setForm((f) => ({ ...f, status: val as typeof form.status }))
                    }
                  >
                    <SelectTrigger id="vehicle-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                  Last Maintenance Date
                </label>
                <Input
                  id="vehicle-maintenance"
                  type="date"
                  value={form.lastMaintenance}
                  onChange={(e) => setForm((f) => ({ ...f, lastMaintenance: e.target.value }))}
                />
              </div>
            </div>

            {formError && (
              <p className="text-xs text-red-600 font-medium">{formError}</p>
            )}

            {/* Modal footer */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                id="save-vehicle-btn"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={handleSave}
                disabled={saving || !form.plate.trim() || !form.capacity.trim()}
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : editingVehicle ? "Save Changes" : "Add Vehicle"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
