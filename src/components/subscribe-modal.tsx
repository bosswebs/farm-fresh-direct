import { useState } from "react";
import { Mail, CheckCircle2, X, BellRing, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<string[]>(["prices"]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  function toggleInterest(val: string) {
    setInterest((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);

    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold font-display text-foreground">{t("subscribe.success")}</h3>
            <p className="text-xs text-muted-foreground">
              We have added <strong className="text-foreground">{email}</strong> to our verified dispatch list.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf/10 text-[11px] font-semibold text-leaf mb-3">
              <BellRing className="w-3.5 h-3.5" /> {t("subscribe.badge")}
            </div>

            <h2 className="text-2xl font-bold font-display text-foreground mb-1">
              {t("subscribe.title")}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              {t("subscribe.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("subscribe.email")} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@hotel.rw or farmer@coop.rw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("subscribe.phone")}
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +250 788 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Topics of Interest
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "prices", label: "Weekly Price Index" },
                    { id: "harvest", label: "Harvest Schedule Alerts" },
                    { id: "wholesale", label: "Bulk Producer Discounts" },
                    { id: "training", label: "Academy Course Dates" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        interest.includes(item.id)
                          ? "bg-leaf/10 border-leaf text-foreground font-semibold"
                          : "border-border text-muted-foreground hover:border-leaf/40"
                      }`}
                    >
                      <span>{item.label}</span>
                      {interest.includes(item.id) && <Sparkles className="w-3 h-3 text-leaf" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-[var(--shadow-soft)]"
              >
                <Mail className="w-4 h-4" /> {busy ? "Subscribing…" : t("subscribe.btn")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
