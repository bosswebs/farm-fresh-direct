import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Truck, MapPin, Search, Navigation, User, Calendar, Plus, RefreshCw, Star, Info, Edit, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { deliveries, vehicles, staff, getStatusColor } from "../../lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/logistics")({
  component: LogisticsPage,
});

function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<"deliveries" | "vehicles">("deliveries");
  const [deliveryList, setDeliveryList] = useState(deliveries);
  const [vehicleList, setVehicleList] = useState(vehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const drivers = staff.filter(s => s.role === "driver");

  const filteredDeliveries = deliveryList.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setDeliveryList(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    toast.success(`Delivery ${id} status updated to ${newStatus}`);
  };

  const handleAssignDriver = (deliveryId: string, driverName: string) => {
    const matchedDriver = drivers.find(d => d.name === driverName);
    const vehicleName = matchedDriver ? (vehicleList.find(v => v.driver === driverName)?.plate || "RAB 483 A") : "RAB 483 A";
    setDeliveryList(prev => prev.map(d => d.id === deliveryId ? { ...d, driver: driverName, vehicle: vehicleName } : d));
    toast.success(`Assigned driver ${driverName} to delivery ${deliveryId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Logistics & Delivery</h1>
          <p className="text-sm text-gray-500">Dispatch drivers, manage vehicles, and track marketplace shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Refreshed delivery status maps")} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Delivery
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("deliveries")}
          className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px
            ${activeTab === "deliveries"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Deliveries Queue
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px
            ${activeTab === "vehicles"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Vehicle Fleet
        </button>
      </div>

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

          {/* Grid Cards of Deliveries */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400">{delivery.id}</span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">{delivery.distance}</Badge>
                  </div>
                  <Select
                    value={delivery.status}
                    onValueChange={(val) => handleUpdateStatus(delivery.id, val)}
                  >
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
                    <Select
                      value={delivery.driver}
                      onValueChange={(val) => handleAssignDriver(delivery.id, val)}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(d => (
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
        /* Vehicles tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicleList.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-400">{vehicle.id}</span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{vehicle.plate}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.toUpperCase()}
                </span>
              </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
