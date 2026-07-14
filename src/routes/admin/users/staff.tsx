import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Crown,
  Edit3,
  Eye,
  GraduationCap,
  HeadphonesIcon,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Truck,
  UserCheck,
  UserCog,
  UserX,
  X,
  Key,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { getStatusColor, type StaffMember } from "../../../lib/admin-data";
import {
  assignStaffTask,
  createStaffMember,
  getStaff,
  updateStaffMember,
  updateStaffStatus,
} from "../../../lib/admin-data.server";

export const Route = createFileRoute("/admin/users/staff")({
  loader: () => getStaff(),
  component: StaffPage,
});
type StaffRole = StaffMember["role"];
type StaffStatus = StaffMember["status"];
type StaffFormState = {
  name: string;
  role: StaffRole;
  department: string;
  phone: string;
  email: string;
  district: string;
  status: StaffStatus;
  joinDate: string;
  enableLogin: boolean;
  loginPassword?: string;
  loginRole?: string;
};

const roles: StaffRole[] = ["trainer", "consultant", "driver", "admin", "support"];
const statuses: StaffStatus[] = ["active", "on_leave", "inactive"];

const roleConfig: Record<StaffRole, { icon: ElementType; color: string; label: string }> = {
  trainer: {
    icon: GraduationCap,
    color: "bg-violet-100 text-violet-700 border-violet-200",
    label: "Trainer",
  },
  consultant: {
    icon: Briefcase,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Consultant",
  },
  driver: { icon: Truck, color: "bg-amber-100 text-amber-700 border-amber-200", label: "Driver" },
  admin: {
    icon: Crown,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Administrator",
  },
  support: {
    icon: HeadphonesIcon,
    color: "bg-pink-100 text-pink-700 border-pink-200",
    label: "Support Officer",
  },
};

const statusLabel: Record<StaffStatus, string> = {
  active: "Active",
  on_leave: "On Leave",
  inactive: "Inactive",
};
const inputClass =
  "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultLoginRoleFor(role: StaffRole): string {
  switch (role) {
    case "admin":
      return "super_admin";
    case "trainer":
      return "training_manager";
    case "consultant":
      return "consultancy_manager";
    case "driver":
      return "logistics_manager";
    case "support":
      return "support_officer";
    default:
      return "manager";
  }
}

function emptyForm(): StaffFormState {
  return {
    name: "",
    role: "trainer",
    department: "",
    phone: "",
    email: "",
    district: "",
    status: "active",
    joinDate: todayDate(),
    enableLogin: false,
    loginPassword: "",
    loginRole: "training_manager",
  };
}

function formFromMember(member: StaffMember): StaffFormState {
  return {
    name: member.name,
    role: member.role,
    department: member.department,
    phone: member.phone,
    email: member.email,
    district: member.district,
    status: member.status,
    joinDate: member.joinDate,
    enableLogin: !!member.authUserId,
    loginPassword: "",
    loginRole: member.loginRole || defaultLoginRoleFor(member.role),
  };
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StaffPage() {
  const loadedStaff = Route.useLoaderData();
  const router = useRouter();
  const [staff, setStaff] = useState(loadedStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<StaffFormState>(() => emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setStaff(loadedStaff);
  }, [loadedStaff]);

  const selectedMember = selectedId
    ? (staff.find((member) => member.id === selectedId) ?? null)
    : null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staff.filter((member) => {
      const matchSearch =
        !query ||
        [member.name, member.department, member.email, member.phone, member.district]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchRole = roleFilter === "all" || member.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [roleFilter, search, staff]);

  const roleCounts = useMemo(
    () =>
      roles.reduce(
        (counts, role) => ({
          ...counts,
          [role]: staff.filter((member) => member.role === role).length,
        }),
        {} as Record<StaffRole, number>,
      ),
    [staff],
  );

  const activeStaff = staff.filter((member) => member.status === "active").length;
  const totalTasks = staff.reduce((sum, member) => sum + member.assignedTasks, 0);

  function openCreateForm() {
    setEditingMember(null);
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(member: StaffMember) {
    setEditingMember(member);
    setForm(formFromMember(member));
    setFormError(null);
    setFormOpen(true);
  }

  function applyStaffUpdate(member: StaffMember) {
    setStaff((current) => current.map((item) => (item.id === member.id ? member : item)));
  }

  async function refreshStaff() {
    await router.invalidate();
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const saved = editingMember
        ? await updateStaffMember({ data: { id: editingMember.id, ...form } })
        : await createStaffMember({ data: form });

      if (editingMember) {
        applyStaffUpdate(saved);
        toast.success(`${saved.name} was updated.`);
      } else {
        setStaff((current) => [saved, ...current]);
        toast.success(`${saved.name} was added to staff.`);
      }
      setFormOpen(false);
      setEditingMember(null);
      await refreshStaff();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save staff member.";
      setFormError(
        message.includes("duplicate") ? "A staff member with this email already exists." : message,
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(member: StaffMember, status: StaffStatus) {
    setBusyId(member.id);
    try {
      const updated = await updateStaffStatus({ data: { id: member.id, status } });
      applyStaffUpdate(updated);
      toast.success(`${updated.name} is now ${statusLabel[updated.status].toLowerCase()}.`);
      await refreshStaff();
    } catch {
      toast.error("Could not update staff status.");
    } finally {
      setBusyId(null);
    }
  }

  async function assignTask(member: StaffMember) {
    setBusyId(member.id);
    try {
      const updated = await assignStaffTask({ data: { id: member.id } });
      applyStaffUpdate(updated);
      toast.success(`Assigned a task to ${updated.name}.`);
      await refreshStaff();
    } catch {
      toast.error("Could not assign task.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Staff & Administrators</h1>
          <p className="text-sm text-gray-500">
            Manage trainers, consultants, drivers, and admin staff
          </p>
        </div>
        <Button
          onClick={openCreateForm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Staff"
          value={staff.length}
          icon={UserCog}
          color="from-emerald-500 to-emerald-700"
        />
        <SummaryCard
          label="Active Staff"
          value={activeStaff}
          icon={UserCheck}
          color="from-teal-500 to-teal-700"
        />
        <SummaryCard
          label="Assigned Tasks"
          value={totalTasks}
          icon={ClipboardCheck}
          color="from-blue-500 to-blue-700"
        />
        <SummaryCard
          label="Administrators"
          value={roleCounts.admin}
          icon={Crown}
          color="from-violet-500 to-violet-700"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRoleFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            roleFilter === "all"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
          }`}
        >
          All Staff ({staff.length})
        </button>
        {roles.map((role) => {
          const cfg = roleConfig[role];
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                roleFilter === role
                  ? `${cfg.color} shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <cfg.icon className="w-3 h-3" />
              {cfg.label} ({roleCounts[role]})
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search staff by name, department, email, phone, or district..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            busy={busyId === member.id}
            onView={() => setSelectedId(member.id)}
            onEdit={() => openEditForm(member)}
            onAssignTask={() => assignTask(member)}
            onStatusChange={(status) => changeStatus(member, status)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No staff members match the current filters.
        </div>
      )}

      {formOpen && (
        <StaffFormModal
          form={form}
          mode={editingMember ? "edit" : "create"}
          error={formError}
          saving={saving}
          onChange={setForm}
          onSubmit={submitForm}
          onClose={() => {
            if (!saving) setFormOpen(false);
          }}
        />
      )}

      {selectedMember && (
        <StaffProfileModal
          member={selectedMember}
          busy={busyId === selectedMember.id}
          onClose={() => setSelectedId(null)}
          onEdit={() => openEditForm(selectedMember)}
          onAssignTask={() => assignTask(selectedMember)}
          onStatusChange={(status) => changeStatus(selectedMember, status)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900 font-display">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function StaffCard({
  member,
  busy,
  onView,
  onEdit,
  onAssignTask,
  onStatusChange,
}: {
  member: StaffMember;
  busy: boolean;
  onView: () => void;
  onEdit: () => void;
  onAssignTask: () => void;
  onStatusChange: (status: StaffStatus) => void;
}) {
  const cfg = roleConfig[member.role];
  const StatusIcon = member.status === "inactive" ? UserX : UserCheck;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initialsFor(member.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{member.name}</div>
              {member.authUserId && (
                <span
                  title={`Login enabled (${member.loginRole?.replace("_", " ")})`}
                  className="flex-shrink-0"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit mt-1 ${cfg.color}`}
            >
              <cfg.icon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(member.status)}`}
          >
            {statusLabel[member.status]}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={busy}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onView}>
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onEdit}>
                <Edit3 className="w-3.5 h-3.5" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-emerald-700"
                onClick={onAssignTask}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Assign Task
              </DropdownMenuItem>
              {member.status !== "active" && (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => onStatusChange("active")}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Mark Active
                </DropdownMenuItem>
              )}
              {member.status !== "on_leave" && (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => onStatusChange("on_leave")}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  Mark On Leave
                </DropdownMenuItem>
              )}
              {member.status !== "inactive" && (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-red-600"
                  onClick={() => onStatusChange("inactive")}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  Deactivate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <StaffMeta icon={Briefcase} label={member.department} />
        <StaffMeta icon={Phone} label={member.phone} />
        <StaffMeta icon={Mail} label={member.email} />
        <StaffMeta icon={MapPin} label={`${member.district} District`} />
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">Joined {member.joinDate}</div>
        <button
          onClick={onAssignTask}
          disabled={busy}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 disabled:opacity-60"
        >
          {member.assignedTasks} tasks
        </button>
      </div>
    </div>
  );
}

function StaffMeta({ icon: Icon, label }: { icon: ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
      <Icon className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function StaffFormModal({
  form,
  mode,
  error,
  saving,
  onChange,
  onSubmit,
  onClose,
}: {
  form: StaffFormState;
  mode: "create" | "edit";
  error: string | null;
  saving: boolean;
  onChange: (form: StaffFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              {mode === "create" ? "Add Staff Member" : "Edit Staff Member"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "create"
                ? "Create a team profile and assign an operational role."
                : "Update contact, role, and status details."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onClose}
            disabled={saving}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(event) => onChange({ ...form, name: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                maxLength={254}
                value={form.email}
                onChange={(event) => onChange({ ...form, email: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(event) => {
                  const selectedRole = event.target.value as StaffRole;
                  onChange({
                    ...form,
                    role: selectedRole,
                    loginRole: form.enableLogin
                      ? defaultLoginRoleFor(selectedRole)
                      : form.loginRole,
                  });
                }}
                className={inputClass}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleConfig[role].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department">
              <input
                required
                maxLength={120}
                value={form.department}
                onChange={(event) => onChange({ ...form, department: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <input
                required
                maxLength={40}
                value={form.phone}
                onChange={(event) => onChange({ ...form, phone: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="District">
              <input
                required
                maxLength={80}
                value={form.district}
                onChange={(event) => onChange({ ...form, district: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  onChange({ ...form, status: event.target.value as StaffStatus })
                }
                className={inputClass}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel[status]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Join Date">
              <input
                required
                type="date"
                value={form.joinDate}
                onChange={(event) => onChange({ ...form, joinDate: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Login Credentials Section */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enableLogin}
                onChange={(event) => {
                  const enable = event.target.checked;
                  onChange({
                    ...form,
                    enableLogin: enable,
                    loginRole: enable
                      ? form.loginRole || defaultLoginRoleFor(form.role)
                      : undefined,
                  });
                }}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              Enable Portal Login Access
            </label>

            {form.enableLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <Field
                  label={mode === "create" ? "Login Password" : "Change Login Password (optional)"}
                >
                  <input
                    required={mode === "create"}
                    type="password"
                    minLength={10}
                    maxLength={128}
                    placeholder={
                      mode === "create" ? "At least 10 characters" : "Leave blank to keep current"
                    }
                    value={form.loginPassword || ""}
                    onChange={(event) => onChange({ ...form, loginPassword: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Portal Login Role">
                  <select
                    value={form.loginRole || "manager"}
                    onChange={(event) => onChange({ ...form, loginRole: event.target.value })}
                    className={inputClass}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="manager">Manager</option>
                    <option value="marketplace_manager">Marketplace Manager</option>
                    <option value="finance_manager">Finance Manager</option>
                    <option value="training_manager">Training Manager</option>
                    <option value="consultancy_manager">Consultancy Manager</option>
                    <option value="logistics_manager">Logistics Manager</option>
                    <option value="content_manager">Content Manager</option>
                    <option value="support_officer">Support Officer</option>
                  </select>
                </Field>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Saving..." : mode === "create" ? "Add Staff Member" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-gray-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StaffProfileModal({
  member,
  busy,
  onClose,
  onEdit,
  onAssignTask,
  onStatusChange,
}: {
  member: StaffMember;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAssignTask: () => void;
  onStatusChange: (status: StaffStatus) => void;
}) {
  const cfg = roleConfig[member.role];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
              {initialsFor(member.name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 font-display truncate">
                {member.name}
              </h2>
              <div className="mt-1 flex flex-wrap gap-2">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}
                >
                  <cfg.icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(member.status)}`}
                >
                  {statusLabel[member.status]}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ProfileField icon={Briefcase} label="Department" value={member.department} />
          <ProfileField icon={MapPin} label="District" value={member.district} />
          <ProfileField icon={Phone} label="Phone" value={member.phone} />
          <ProfileField icon={Mail} label="Email" value={member.email} />
          <ProfileField icon={CalendarDays} label="Joined" value={member.joinDate} />
          <ProfileField
            icon={ClipboardCheck}
            label="Assigned Tasks"
            value={member.assignedTasks.toString()}
          />
          <ProfileField
            icon={Key}
            label="Portal Login Access"
            value={
              member.authUserId ? `Enabled (${member.loginRole?.replace("_", " ")})` : "Disabled"
            }
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="outline" className="gap-2" onClick={onEdit}>
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="outline" className="gap-2" onClick={onAssignTask} disabled={busy}>
            <ClipboardCheck className="w-4 h-4" />
            Assign Task
          </Button>
          {member.status !== "active" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => onStatusChange("active")}
              disabled={busy}
            >
              <UserCheck className="w-4 h-4" />
              Mark Active
            </Button>
          )}
          {member.status !== "inactive" && (
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700"
              onClick={() => onStatusChange("inactive")}
              disabled={busy}
            >
              <UserX className="w-4 h-4" />
              Deactivate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-gray-400">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
}
