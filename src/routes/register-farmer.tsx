import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Lock, CheckCircle2, ChevronRight, Eye, EyeOff } from "lucide-react";
import { registerFarmer } from "@/lib/admin-data.server";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/register-farmer")({
  component: RegisterFarmerPage,
});

function RegisterFarmerPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    sector: "",
    farmName: "",
    farmSize: "",
    password: "",
    productsInput: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const prodList = form.productsInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const result = await registerFarmer({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          district: form.district,
          sector: form.sector,
          farmName: form.farmName,
          farmSize: form.farmSize,
          password: form.password,
          products: prodList,
        },
      });

      if (result.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to register. Please check your inputs.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-glow)] text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-3">Application Submitted!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Thank you for registering for the Agribusiness Farmer Portal. Your application is currently
            <strong className="text-emerald-600 font-semibold"> pending review and approval by our System Super Administrator</strong>.
          </p>
          <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 text-left text-xs space-y-2.5 mb-8">
            <div className="font-semibold text-foreground uppercase tracking-wider text-[10px]">What happens next?</div>
            <div className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold">1</span>
              <p className="text-muted-foreground">Admin verifies your agribusiness profile and KYC credentials (usually within 24 hours).</p>
            </div>
            <div className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold">2</span>
              <p className="text-muted-foreground">Once approved, your account will be activated and you will receive a notification.</p>
            </div>
            <div className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold">3</span>
              <p className="text-muted-foreground">You can then log in to list products directly in Deacomart's Marketplace.</p>
            </div>
          </div>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("common.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-20 px-6">
      <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-glow)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-semibold mb-4 text-emerald-800">
          <Leaf className="w-3.5 h-3.5" /> {t("register.badge")}
        </div>
        <h1 className="text-2xl font-bold mb-1 font-display">{t("register.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t("register.subtitle")}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.fullname")}</label>
              <input
                type="text"
                required
                maxLength={80}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. Habimana Joseph"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.phone")}</label>
              <input
                type="tel"
                required
                maxLength={20}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. +250 788 000 000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.email")}</label>
            <input
              type="email"
              required
              maxLength={254}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              placeholder="e.g. joseph.h@gmail.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.district")}</label>
              <input
                type="text"
                required
                maxLength={50}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. Musanze"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.sector")}</label>
              <input
                type="text"
                required
                maxLength={50}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. Kinigi"
                value={form.sector}
                onChange={(e) => update("sector", e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.farm_name")}</label>
              <input
                type="text"
                required
                maxLength={100}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. Kinigi Honey Cooperative"
                value={form.farmName}
                onChange={(e) => update("farmName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.farm_size")}</label>
              <input
                type="text"
                required
                maxLength={50}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="e.g. 2.5 Hectares"
                value={form.farmSize}
                onChange={(e) => update("farmSize", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.products")}</label>
            <input
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              placeholder="e.g. Honey, Tea, Cabbage, Potatoes"
              value={form.productsInput}
              onChange={(e) => update("productsInput", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{t("register.password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={10}
                maxLength={128}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                placeholder="Password (minimum 10 characters)"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-[var(--shadow-soft)]"
          >
            {busy ? "Submitting application…" : t("register.submit")}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <span className="text-xs text-muted-foreground">Already applied or approved? </span>
          <Link to="/dashboard" className="text-xs text-emerald-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
