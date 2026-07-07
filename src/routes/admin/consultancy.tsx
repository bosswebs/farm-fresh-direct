import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Briefcase, User, Calendar, DollarSign, Clock, CheckCircle, XCircle, Plus, Eye, MoreHorizontal, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getStatusColor, formatRWF } from "../../lib/admin-data";
import { getConsultancyRequests, getStaff } from "../../lib/admin-data.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/consultancy")({
  loader: async () => {
    const [requests, staff] = await Promise.all([getConsultancyRequests(), getStaff()]);
    return { requests, staff };
  },
  component: ConsultancyPage,
});

function ConsultancyPage() {
  const { requests: loadedRequests, staff } = Route.useLoaderData();
  const [requests, setRequests] = useState(loadedRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<typeof loadedRequests[0] | null>(null);

  const consultants = staff.filter((s) => s.role === "consultant");

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (id: string, newStatus: any) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Request ${id} status updated to ${newStatus}`);
  };

  const handleAssignConsultant = (id: string, consultantName: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, consultant: consultantName } : r));
    toast.success(`Assigned ${consultantName} to request ${id}`);
  };

  const handleInvoiceStatusChange = (id: string, newInvoiceStatus: any) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, invoiceStatus: newInvoiceStatus } : r));
    toast.success(`Invoice for ${id} set to ${newInvoiceStatus}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Consultancy Services</h1>
          <p className="text-sm text-gray-500">Manage farm planning advisory, audits, and business planning projects</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400">Total Projects</div>
          <div className="text-2xl font-bold text-gray-900 font-display mt-1">{requests.length}</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 shadow-sm">
          <div className="text-xs text-emerald-600 font-medium">Completed Projects</div>
          <div className="text-2xl font-bold text-emerald-800 font-display mt-1">
            {requests.filter(r => r.status === "completed").length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
          <div className="text-xs text-blue-600 font-medium">In Progress</div>
          <div className="text-2xl font-bold text-blue-800 font-display mt-1">
            {requests.filter(r => r.status === "in_progress").length}
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="text-xs text-amber-600 font-medium">Pending Assignment</div>
          <div className="text-2xl font-bold text-amber-800 font-display mt-1">
            {requests.filter(r => r.status === "pending" || !r.consultant).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, service, or ID..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <th className="p-4">Project ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Consultant</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Invoice</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-gray-900">{req.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-950">{req.client}</div>
                    <div className="text-xs text-gray-400">{req.district} District</div>
                  </td>
                  <td className="p-4 text-gray-700">{req.service}</td>
                  <td className="p-4">
                    {req.consultant ? (
                      <span className="text-gray-700 font-medium">{req.consultant}</span>
                    ) : (
                      <span className="text-amber-600 text-xs bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium inline-block animate-pulse">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(req.status)}`}>
                      {req.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border
                      ${req.priority === "high"
                        ? "text-red-700 bg-red-50 border-red-200"
                        : req.priority === "medium"
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : "text-gray-600 bg-gray-50 border-gray-200"
                      }`}>
                      {req.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{formatRWF(req.invoiceAmount)}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(req.invoiceStatus)}`}>
                      {req.invoiceStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No projects found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase font-mono">{selectedRequest.id}</span>
                <h3 className="text-lg font-bold text-gray-950 font-display mt-0.5">{selectedRequest.client}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>✕</Button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase block">Consultancy Service</span>
                <span className="text-sm font-semibold text-gray-800">{selectedRequest.service}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase block">Request Date</span>
                  <span className="text-sm text-gray-800">{selectedRequest.requestDate}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase block">Due Date</span>
                  <span className="text-sm text-gray-800">{selectedRequest.dueDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Assign Consultant</span>
                <Select
                  value={selectedRequest.consultant || "none"}
                  onValueChange={(val) => handleAssignConsultant(selectedRequest.id, val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {consultants.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Project Status</span>
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(val) => handleStatusChange(selectedRequest.id, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Invoice Status</span>
                  <Select
                    value={selectedRequest.invoiceStatus}
                    onValueChange={(val) => handleInvoiceStatusChange(selectedRequest.id, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Invoice Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setSelectedRequest(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                Close & Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
