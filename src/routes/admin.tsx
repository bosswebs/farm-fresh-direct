import { useState, useEffect } from "react";
import { Link, Outlet, useRouterState, createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Coffee,
  GraduationCap,
  Briefcase,
  Truck,
  MessageSquare,
  Handshake,
  MapPin,
  FileText,
  BarChart3,
  Mail,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  Leaf,
  Package,
  CreditCard,
  Star,
  UserCheck,
  UserCog,
  DollarSign,
  BookOpen,
  Award,
  ClipboardList,
  Building2,
  Landmark,
  Globe,
  Newspaper,
  Megaphone,
  Shield,
  Home,
  TrendingUp,
  Activity,
  Lock,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import {
  changeAdminPassword,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  resetAdminPassword,
} from "@/lib/auth.functions";

type AdminUser = NonNullable<Awaited<ReturnType<typeof getAdminSession>>>;

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// ─── Sidebar Navigation Config ────────────────────────────────────
const navGroups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/admin" }],
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
    items: [{ label: "System Settings", icon: Settings, path: "/admin/settings" }],
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
        : currentPath.startsWith(item.path ?? "")
      : false;

  const hasChildren = "children" in item && item.children;
  const childActive =
    hasChildren &&
    item.children!.some((c) => "path" in c && currentPath.startsWith(c.path as string));
  const [open, setOpen] = useState(childActive || false);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
            ${
              childActive
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
              const childIsActive = "path" in child && currentPath.startsWith(child.path as string);
              return (
                <Link
                  key={child.path}
                  to={child.path as string}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                    ${
                      childIsActive
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
        ${
          isActive
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
  user,
}: {
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
  user: AdminUser;
}) {
  const roleLabel = user.role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const initials = user.displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{roleLabel}</div>
              <div className="text-[oklch(0.55_0.08_148)] text-[10px] truncate">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.42_0.14_152)] flex items-center justify-center text-white text-xs font-bold mx-auto">
            {initials}
          </div>
        )}
      </div>
    </aside>
  );
}

function AdminHeader({
  currentPath,
  onSignOut,
  onChangePassword,
  user,
}: {
  currentPath: string;
  onSignOut: () => void;
  onChangePassword: () => void;
  user: AdminUser;
}) {
  const breadcrumb = getBreadcrumb(currentPath);
  const roleLabel = user.role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const initials = user.displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
                i === breadcrumb.length - 1 ? "text-gray-900 font-medium" : "text-gray-400"
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
              <Badge className="bg-red-100 text-red-700 text-xs">
                {"—"}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { msg: "38 farmer products pending approval", time: "Just now", dot: "bg-amber-400" },
              { msg: "New order from Nakumatt Rwanda", time: "5 min ago", dot: "bg-emerald-400" },
              { msg: "DEL002 delivery in progress", time: "15 min ago", dot: "bg-blue-400" },
              {
                msg: "Consultancy request from Rwanda Coop",
                time: "1 hr ago",
                dot: "bg-purple-400",
              },
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
            <button className="flex items-center gap-2 pl-3 border-l border-gray-100 font-sans">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-medium text-gray-800">{roleLabel}</div>
                <div className="text-[10px] text-gray-400">{user.email}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={onChangePassword}>
              <KeyRound className="mr-2 h-4 w-4" /> Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onSignOut}>
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

// ─── Authentication Gate ──────────────────────────────────────────
function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await loginAdmin({ data: { email, password } });
      if (result.user) onAuthed();
      else
        setError(
          "Invalid email or password. Please try again later if access is temporarily locked.",
        );
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setResetMessage(null);
    if (resetPassword.length < 10) {
      setResetMessage("New password must be at least 10 characters.");
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetMessage("New passwords do not match.");
      return;
    }

    setResetBusy(true);
    try {
      const result = await resetAdminPassword({
        data: { email, resetCode, nextPassword: resetPassword },
      });
      if (!result.success) {
        setResetMessage("Reset failed. Check the email and reset code.");
        return;
      }
      setPassword("");
      setResetCode("");
      setResetPassword("");
      setResetConfirm("");
      setResetOpen(false);
      setError(null);
      setResetMessage("Password reset. Sign in with your new password.");
    } catch {
      setResetMessage("Password reset is temporarily unavailable.");
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="mx-auto max-w-md px-6 py-20 w-full">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold mb-4 text-emerald-700">
            <Lock className="w-3.5 h-3.5" /> Admin access
          </div>
          <h1 className="text-2xl font-bold mb-2 font-display">Sign in to Admin Portal</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Only authorized administrators can access the Deacomart Admin Portal.
          </p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              autoComplete="username"
              autoFocus
              required
              maxLength={254}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                maxLength={128}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {resetMessage && <p className="text-sm text-emerald-700">{resetMessage}</p>}
            <button
              type="submit"
              disabled={busy || !email || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {busy ? "Checking…" : "Unlock admin"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setResetOpen((value) => !value);
              setResetMessage(null);
            }}
            className="mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Reset password
          </button>

          {resetOpen && (
            <form
              onSubmit={submitReset}
              className="mt-4 space-y-3 rounded-xl border border-border bg-background/70 p-4"
            >
              <input
                type="text"
                autoComplete="one-time-code"
                maxLength={128}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showResetPassword ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={128}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="New password (min 10 chars)"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={showResetPassword ? "Hide new password" : "Show new password"}
                >
                  {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="password"
                autoComplete="new-password"
                maxLength={128}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Confirm new password"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
              />
              <button
                type="submit"
                disabled={resetBusy || !email || !resetCode || !resetPassword || !resetConfirm}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50 transition-colors"
              >
                {resetBusy ? "Resetting..." : "Set new password"}
              </button>
            </form>
          )}
          <div className="mt-6 border-t border-border pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 10) {
      setMsg("New password must be at least 10 characters.");
      return;
    }
    if (next !== confirmPwd) {
      setMsg("New passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const result = await changeAdminPassword({
        data: { currentPassword: current, nextPassword: next },
      });
      if (!result.success) {
        setMsg("Current password is incorrect.");
        return;
      }
      setMsg("Password updated successfully.");
      setTimeout(onClose, 800);
    } catch {
      setMsg("Password update failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display">
          <KeyRound className="w-4 h-4" /> Change admin password
        </h3>
        <form onSubmit={submit} className="space-y-3">
          <input
            autoComplete="current-password"
            maxLength={128}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="password"
            placeholder="Current password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <input
            autoComplete="new-password"
            maxLength={128}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="password"
            placeholder="New password (min 10 chars)"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="password"
            placeholder="Confirm new password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
          {msg && <p className="text-sm text-emerald-600 font-medium">{msg}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminLayoutMain({ onSignOut, user }: { onSignOut: () => void; user: AdminUser }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
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
            user={user}
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
          user={user}
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
          <AdminHeader
            currentPath={currentPath}
            onSignOut={onSignOut}
            onChangePassword={() => setShowPwd(true)}
            user={user}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {showPwd && <ChangePasswordDialog onClose={() => setShowPwd(false)} />}
    </div>
  );
}

function AdminLayout() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    getAdminSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  if (!user) {
    return (
      <AuthGate
        onAuthed={() => {
          setChecking(true);
          getAdminSession()
            .then(setUser)
            .finally(() => setChecking(false));
        }}
      />
    );
  }

  return (
    <AdminLayoutMain
      user={user}
      onSignOut={() => {
        logoutAdmin().finally(() => setUser(null));
      }}
    />
  );
}
