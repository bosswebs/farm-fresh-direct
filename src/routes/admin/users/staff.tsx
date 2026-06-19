import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UserCog, Briefcase, Truck, HeadphonesIcon, GraduationCap, Crown, MoreHorizontal, Phone, Mail, MapPin, Eye, UserX, UserCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { staff, getStatusColor, type StaffMember } from "../../../lib/admin-data";

export const Route = createFileRoute("/admin/users/staff")({
  component: StaffPage,
});

const roleConfig: Record<StaffMember["role"], { icon: React.ElementType; color: string; label: string }> = {
  trainer: { icon: GraduationCap, color: "bg-violet-100 text-violet-700 border-violet-200", label: "Trainer" },
  consultant: { icon: Briefcase, color: "bg-blue-100 text-blue-700 border-blue-200", label: "Consultant" },
  driver: { icon: Truck, color: "bg-amber-100 text-amber-700 border-amber-200", label: "Driver" },
  admin: { icon: Crown, color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Administrator" },
  support: { icon: HeadphonesIcon, color: "bg-pink-100 text-pink-700 border-pink-200", label: "Support Officer" },
};

const statusConfig: Record<string, string> = {
  active: "text-emerald-700 bg-emerald-50 border-emerald-200",
  on_leave: "text-amber-700 bg-amber-50 border-amber-200",
  inactive: "text-gray-600 bg-gray-50 border-gray-200",
};

function StaffPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = staff.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = {
    trainer: staff.filter((s) => s.role === "trainer").length,
    consultant: staff.filter((s) => s.role === "consultant").length,
    driver: staff.filter((s) => s.role === "driver").length,
    admin: staff.filter((s) => s.role === "admin").length,
    support: staff.filter((s) => s.role === "support").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Staff & Administrators</h1>
          <p className="text-sm text-gray-500">Manage trainers, consultants, drivers, and admin staff</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <UserCog className="w-4 h-4" />Add Staff Member
        </Button>
      </div>

      {/* Role Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRoleFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${roleFilter === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
        >
          All Staff ({staff.length})
        </button>
        {(Object.keys(roleCounts) as StaffMember["role"][]).map((role) => {
          const cfg = roleConfig[role];
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                ${roleFilter === role ? `${cfg.color} shadow-sm` : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              <cfg.icon className="w-3 h-3" />
              {cfg.label} ({roleCounts[role]})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search staff by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const cfg = roleConfig[member.role];
          return (
            <div key={member.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit mt-1 ${cfg.color}`}>
                      <cfg.icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusConfig[member.status]}`}>
                    {member.status === "on_leave" ? "On Leave" : member.status}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="w-3.5 h-3.5" />View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-700"><UserCheck className="w-3.5 h-3.5" />Assign Task</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer text-red-600"><UserX className="w-3.5 h-3.5" />Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Briefcase className="w-3.5 h-3.5 text-gray-300" />
                  {member.department}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-300" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-300" />
                  {member.district}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">Joined {member.joinDate}</div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  {member.assignedTasks} tasks
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
