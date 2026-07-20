import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Search, Briefcase, User, Calendar, DollarSign, Clock, CheckCircle, XCircle, Plus, Eye, MoreHorizontal, AlertCircle, X, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getStatusColor, formatRWF } from "../../lib/admin-data";
import {
  getConsultancyRequests,
  getStaff,
  createConsultancyRequest,
  updateConsultancyRequest,
  deleteConsultancyRequest
} from "../../lib/admin-data.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/consultancy")({
  loader: async () => {
    const [requests, staff] = await Promise.all([getConsultancyRequests(), getStaff()]);
    return { requests, staff };
  },
  component: ConsultancyPage,
});

const servicesList = [
  "Farm Planning & Design Advisory",
  "Soil Health & Irrigation Audit",
  "Agribusiness Financial Planning",
  "GAP & Organic Certification Prep",
  "Post-Harvest Facility Audit",
  "Export Market Access Compliance",
];

const inputClass =
  "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

function ConsultancyPage() {
  const { requests: loadedRequests, staff } = Route.useLoaderData();
  const router = useRouter();
  const [requests, setRequests] = useState(loadedRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<typeof loadedRequests[0] | null>(null);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const consultants = staff.filter((s) => s.role === "consultant");

  const [form, setForm] = useState({
    client: "",
    service: servicesList[0],
    consultant: consultants[0]?.name || "Unassigned",
    status: "pending" as "pending" | "in_progress" | "completed" | "cancelled",
    priority: "medium" as "high" | "medium" | "low",
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    invoiceAmount: 500000,
    invoiceStatus: "draft" as "draft" | "sent" | "paid" | "overdue",
    district: "Musanze",
  });

  useEffect(() => {
    setRequests(loadedRequests);
  }, [loadedRequests]);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  function emptyForm() {
    return {
      client: "",
      service: servicesList[0],
      consultant: consultants[0]?.name || "Unassigned",
      status: "pending" as const,
      priority: "medium" as const,
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
      invoiceAmount: 500000,
      invoiceStatus: "draft" as const,
      district: "Musanze",
    };
  }

  function openCreateForm() {
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  }

  async function refreshData() {
    await router.invalidate();
  }

  async function submitCreateForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const saved = await createConsultancyRequest({ data: form });
      setRequests((prev) => [saved, ...prev]);
      toast.success(`Consultancy project created for ${saved.client}.`);
      setFormOpen(false);
      await refreshData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create project.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateSelected(updatedData: Partial<typeof loadedRequests[0]>) {
    if (!selectedRequest) return;
    setBusyId(selectedRequest.id);
    const fullData = { ...selectedRequest, ...updatedData };
    try {
      const saved = await updateConsultancyRequest({
        data: {
          id: fullData.id,
          client: fullData.client,
          service: fullData.service,
          consultant: fullData.consultant,
          status: fullData.status as any,
          priority: fullData.priority as any,
          dueDate: fullData.dueDate,
          invoiceAmount: fullData.invoiceAmount,
          invoiceStatus: fullData.invoiceStatus as any,
          district: fullData.district,
        },
      });
      setRequests((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      setSelectedRequest(saved);
      toast.success(`Project ${saved.id} updated.`);
      await refreshData();
    } catch {
      toast.error("Failed to update project.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteProject(req: typeof loadedRequests[0]) {
    if (!confirm(`Are you sure you want to delete project for "${req.client}"?`)) return;
    setBusyId(req.id);
    try {
      await deleteConsultancyRequest({ data: { id: req.id } });
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      toast.success(`Project ${req.id} deleted.`);
      if (selectedRequest?.id === req.id) setSelectedRequest(null);
      await refreshData();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Consultancy Services</h1>
          <p className="text-sm text-gray-500">Manage farm planning advisory, audits, and business planning projects</p>
        </div>
        <Button onClick={openCreateForm} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
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
            {requests.filter(r => r.status === "pending" || !r.consultant || r.consultant === "Unassigned").length}
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
                <tr key={req.id} className={`hover:bg-gray-50/50 transition-colors ${busyId === req.id ? "opacity-50 pointer-events-none" : ""}`}>
                  <td className="p-4 font-mono font-bold text-xs text-gray-900">{req.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-950">{req.client}</div>
                    <div className="text-xs text-gray-400">{req.district} District</div>
                  </td>
                  <td className="p-4 text-gray-700">{req.service}</td>
                  <td className="p-4">
                    {req.consultant && req.consultant !== "Unassigned" ? (
                      <span className="text-gray-700 font-medium">{req.consultant}</span>
                    ) : (
                      <span className="text-amber-600 text-xs bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium inline-block">
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(req)} className="text-red-600 hover:text-red-700 h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
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

      {/* New Project Modal */}
      {formOpen && (
        <ConsultancyFormModal
          form={form}
          error={formError}
          saving={saving}
          consultants={consultants}
          onChange={setForm}
          onSubmit={submitCreateForm}
          onClose={() => {
            if (!saving) setFormOpen(false);
          }}
        />
      )}

      {/* Project Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
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
                  onValueChange={(val) => handleUpdateSelected({ consultant: val })}
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
                    onValueChange={(val) => handleUpdateSelected({ status: val as any })}
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
                    onValueChange={(val) => handleUpdateSelected({ invoiceStatus: val as any })}
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

            <div className="pt-4 flex justify-between gap-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => handleDeleteProject(selectedRequest)} className="text-red-600 border-red-200 hover:bg-red-50">
                Delete Project
              </Button>
              <Button onClick={() => setSelectedRequest(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Close & Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultancyFormModal({
  form,
  error,
  saving,
  consultants,
  onChange,
  onSubmit,
  onClose,
}: {
  form: {
    client: string;
    service: string;
    consultant: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    priority: "high" | "medium" | "low";
    dueDate: string;
    invoiceAmount: number;
    invoiceStatus: "draft" | "sent" | "paid" | "overdue";
    district: string;
  };
  error: string | null;
  saving: boolean;
  consultants: Array<{ id: string; name: string }>;
  onChange: (val: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-display">New Consultancy Project</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Client Name / Organization">
            <input
              required
              type="text"
              value={form.client}
              onChange={(e) => onChange({ ...form, client: e.target.value })}
              className={inputClass}
              placeholder="e.g. Musanze Farmers Cooperative"
            />
          </Field>

          <Field label="Consultancy Service">
            <select
              value={form.service}
              onChange={(e) => onChange({ ...form, service: e.target.value })}
              className={inputClass}
            >
              {servicesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Assigned Consultant">
              <select
                value={form.consultant}
                onChange={(e) => onChange({ ...form, consultant: e.target.value })}
                className={inputClass}
              >
                <option value="Unassigned">Unassigned</option>
                {consultants.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="District">
              <input
                required
                type="text"
                value={form.district}
                onChange={(e) => onChange({ ...form, district: e.target.value })}
                className={inputClass}
                placeholder="District"
              />
            </Field>

            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => onChange({ ...form, priority: e.target.value as any })}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>

            <Field label="Project Status">
              <select
                value={form.status}
                onChange={(e) => onChange({ ...form, status: e.target.value as any })}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <Field label="Due Date">
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Invoice Amount (RWF)">
              <input
                required
                type="number"
                min="0"
                value={form.invoiceAmount || ""}
                onChange={(e) => onChange({ ...form, invoiceAmount: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Invoice Status">
            <select
              value={form.invoiceStatus}
              onChange={(e) => onChange({ ...form, invoiceStatus: e.target.value as any })}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </Field>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-gray-700 flex flex-col">
      <span>{label}</span>
      {children}
    </label>
  );
}
