import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShoppingBag, Coffee, GraduationCap,
  Briefcase, Truck, MessageSquare, Handshake, MapPin, FileText,
  BarChart3, Mail, Settings, ChevronDown, ChevronRight, Menu, X,
  Bell, Search, LogOut, User, Leaf, Package, CreditCard, Star,
  UserCheck, UserCog, DollarSign, BookOpen, Award, ClipboardList,
  Building2, Landmark, Globe, Newspaper, Megaphone, Shield,
  Home, TrendingUp, Activity
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { adminStats } from "../lib/admin-data";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// ─── Sidebar Navigation Config ────────────────────────────────────
const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    ],
  },
  {
    label: "Users",
    items: [
      {
        label: "User Management",
        icon: Users,
        children: [
          { label: "Farmers", icon: Leaf, path: "/admin/users/farmers" },
          { label: "Buyers", icon: ShoppingBag, path: "/admin/users/buyers" },
          { label: "Staff & Admins", icon: UserCog, path: "/admin/users/staff" },
        ],
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        label: "Marketplace",
        icon: ShoppingBag,
        children: [
          { label: "Products", icon: Package, path: "/admin/marketplace/products" },
          { label: "Orders", icon: ClipboardList, path: "/admin/marketplace/orders" },
          { label: "Payments", icon: CreditCard, path: "/admin/marketplace/payments" },
        ],
      },
      { label: "Food & Beverage", icon: Coffee, path: "/admin/fnb" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Training Academy", icon: GraduationCap, path: "/admin/training" },
      { label: "Consultancy", icon: Briefcase, path: "/admin/consultancy" },
      { label: "Logistics", icon: Truck, path: "/admin/logistics" },
      { label: "WhatsApp Commerce", icon: MessageSquare, path: "/admin/whatsapp" },
    ],
  },
  {
    label: "Network",
    items: [
      { label: "Partnerships", icon: Handshake, path: "/admin/partnerships" },
      { label: "Geographic Coverage", icon: MapPin, path: "/admin/geographic" },
    ],
  },
  {
    label: "Content & Reports",
    items: [
      { label: "Content Management", icon: FileText, path: "/admin/content" },
      { label: "Reports & Analytics", icon: BarChart3, path: "/admin/reports" },
      { label: "Communication", icon: Mail, path: "/admin/communication" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "System Settings", icon: Settings, path: "/admin/settings" },
    ],
  },
];

function SidebarItem({
  item,
  currentPath,
  collapsed,
}: {
  item: (typeof navGroups)[0]["items"][0];
  currentPath: string;
  collapsed: boolean;
}) {
  const isActive =
    "path" in item
      ? item.path === "/admin"
        ? currentPath === "/admin"
        : currentPath.startsWith(item.path)
      : false;

  const hasChildren = "children" in item && item.children;
  const childActive =
    hasChildren &&
    item.children!.some(
      (c) => "path" in c && currentPath.startsWith(c.path as string)
    );
  const [open, setOpen] = useState(childActive || false);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
            ${childActive
              ? "bg-[oklch(0.4_0.14_148)] text-white"
              : "text-[oklch(0.78_0.06_148)] hover:bg-[oklch(0.28_0.07_148)] hover:text-white"
            }`}
        >
          <item.icon
            className={`w-4 h-4 flex-shrink-0 ${childActive ? "text-white" : "text-[oklch(0.65_0.12_148)]"}`}
          />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              )}
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-[oklch(0.35_0.06_148)] pl-3">
            {item.children!.map((child) => {
              const childIsActive =
                "path" in child && currentPath.startsWith(child.path as string);
              return (
                <Link
                  key={"path" in child ? child.path : child.label}
                  to={"path" in child ? (child.path as string) : "#"}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                    ${childIsActive
                      ? "bg-[oklch(0.55_0.18_145)] text-white shadow-sm"
                      : "text-[oklch(0.72_0.07_148)] hover:bg-[oklch(0.3_0.07_148)] hover:text-white"
                    }`}
                >
                  <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={"path" in item ? item.path : "#"}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
        ${isActive
          ? "bg-[oklch(0.55_0.18_145)] text-white shadow-md shadow-[oklch(0.55_0.18_145/0.4)]"
          : "text-[oklch(0.78_0.06_148)] hover:bg-[oklch(0.28_0.07_148)] hover:text-white"
        }`}
    >
      <item.icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-[oklch(0.65_0.12_148)] group-hover:text-white"}`}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function AdminSidebar({
  collapsed,
  onToggle,
  currentPath,
}: {
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}) {
  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
        bg-[oklch(0.18_0.05_150)] border-r border-[oklch(0.26_0.06_148)]`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[oklch(0.26_0.06_148)]">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.42_0.14_152)] flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight font-display">
                Deacomart
              </div>
              <div className="text-[oklch(0.6_0.1_148)] text-[10px]">Admin Portal</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.42_0.14_152)] flex items-center justify-center shadow-md mx-auto">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-[oklch(0.6_0.1_148)] hover:text-white transition-colors p-1 rounded"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="text-[oklch(0.5_0.08_148)] text-[10px] font-semibold uppercase tracking-widest mb-2 px-3">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  currentPath={currentPath}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[oklch(0.26_0.06_148)]">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[oklch(0.26_0.06_148)] cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.42_0.14_152)] flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">Super Admin</div>
              <div className="text-[oklch(0.55_0.08_148)] text-[10px] truncate">admin@deacomart.rw</div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.42_0.14_152)] flex items-center justify-center text-white text-xs font-bold mx-auto">
            SA
          </div>
        )}
      </div>
    </aside>
  );
}

function AdminHeader({ currentPath }: { currentPath: string }) {
  const breadcrumb = getBreadcrumb(currentPath);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span
              className={
                i === breadcrumb.length - 1
                  ? "text-gray-900 font-medium"
                  : "text-gray-400"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 w-52 transition-all"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge className="bg-red-100 text-red-700 text-xs">{adminStats.pendingApprovals}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { msg: "38 farmer products pending approval", time: "Just now", dot: "bg-amber-400" },
              { msg: "New order from Nakumatt Rwanda", time: "5 min ago", dot: "bg-emerald-400" },
              { msg: "DEL002 delivery in progress", time: "15 min ago", dot: "bg-blue-400" },
              { msg: "Consultancy request from Rwanda Coop", time: "1 hr ago", dot: "bg-purple-400" },
            ].map((n, i) => (
              <DropdownMenuItem key={i} className="flex items-start gap-3 py-3 cursor-pointer">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                <div>
                  <p className="text-sm text-gray-700">{n.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-medium text-gray-800">Super Admin</div>
                <div className="text-[10px] text-gray-400">admin@deacomart.rw</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getBreadcrumb(path: string): string[] {
  const map: Record<string, string[]> = {
    "/admin": ["Dashboard"],
    "/admin/users/farmers": ["Users", "Farmers"],
    "/admin/users/buyers": ["Users", "Buyers"],
    "/admin/users/staff": ["Users", "Staff & Admins"],
    "/admin/marketplace/products": ["Marketplace", "Products"],
    "/admin/marketplace/orders": ["Marketplace", "Orders"],
    "/admin/marketplace/payments": ["Marketplace", "Payments"],
    "/admin/fnb": ["Food & Beverage Store"],
    "/admin/training": ["Training Academy"],
    "/admin/consultancy": ["Consultancy Services"],
    "/admin/logistics": ["Logistics & Delivery"],
    "/admin/whatsapp": ["WhatsApp Commerce"],
    "/admin/partnerships": ["Partnerships"],
    "/admin/geographic": ["Geographic Coverage"],
    "/admin/content": ["Content Management"],
    "/admin/reports": ["Reports & Analytics"],
    "/admin/communication": ["Communication Center"],
    "/admin/settings": ["System Settings"],
  };
  return map[path] ?? [path.split("/").filter(Boolean).pop() ?? ""];
}

// ─── Admin Layout ─────────────────────────────────────────────────
function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="relative flex h-full w-64">
          <AdminSidebar
            collapsed={false}
            onToggle={() => setMobileSidebarOpen(false)}
            currentPath={currentPath}
          />
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPath={currentPath}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Menu Button */}
        <div className="flex items-center lg:hidden h-14 bg-white border-b border-gray-100 px-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span className="font-display font-bold text-gray-900 text-sm">Deacomart Admin</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <AdminHeader currentPath={currentPath} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
