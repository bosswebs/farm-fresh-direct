import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, Building2, Landmark, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/lib/i18n";
import { WHATSAPP_LINK } from "@/lib/products-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Deacomart Ltd" },
      { name: "description", content: "Get in touch with Deacomart Ltd headquarters in Kigali, Rwanda — wholesale produce inquiries, farmer registration, and advisory services." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Wholesale Produce Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[url('/images/login_bg.png')] bg-cover bg-center relative py-20 text-white">
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm z-0" />
        <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-400">
            <Mail className="w-4 h-4 text-emerald-400" /> {t("contact.badge")}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.08] font-display">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto text-base">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Cards & Form Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-display">{t("contact.address")}</h2>
            <p className="text-xs text-muted-foreground mt-1">Visit our central depot and office in Kigali.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Deacomart Headquarters</h4>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  KN 3 Ave, Nyarugenge District, Kigali City, Rwanda
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Incorporated October 27, 2025 · TIN 122176313</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Direct Phone & Support</h4>
                <p className="text-muted-foreground mt-1">+250 780 165 257 / +250 788 000 000</p>
                <p className="text-muted-foreground">Mon - Sat: 07:00 AM - 07:00 PM</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Email Inquiries</h4>
                <p className="text-muted-foreground mt-1">info@deacomart.com / sales@deacomart.com</p>
                <p className="text-muted-foreground">General inquiries & wholesale contract orders</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center shrink-0 mt-0.5">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Bank & LPO Account</h4>
                <p className="text-muted-foreground mt-1">Equity Bank Rwanda — Deacomart Ltd</p>
                <p className="text-emerald-600 font-semibold mt-0.5">Account 4014201311299</p>
              </div>
            </div>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-[var(--shadow-soft)]"
          >
            <MessageCircle className="w-5 h-5" /> Start Instant WhatsApp Chat
          </a>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-soft)]">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold font-display">Message Received!</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you for contacting Deacomart Ltd. Your message has been routed to our team and we will respond via email/phone shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "Wholesale Produce Inquiry", message: "" }); }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold font-display mb-1">{t("contact.send_msg")}</h2>
              <p className="text-xs text-muted-foreground mb-6">Fill in the coordinates below and our team will get back to you promptly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MUREKEYISONI Marie"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +250 788 000 000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. Marie@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Inquiry Category *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                  >
                    <option value="Wholesale Produce Inquiry">Wholesale Produce & Bulk Orders</option>
                    <option value="Farmer Registration">Farmer / Cooperative Onboarding</option>
                    <option value="Advisory & Audits">Consultancy & Food Safety Audit</option>
                    <option value="Advertising">Advertising & Partnerships</option>
                    <option value="General Support">General Support & Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist your agribusiness or purchasing needs?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="flex w-full rounded-xl border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-[var(--shadow-soft)]"
                >
                  <Send className="w-4 h-4" /> {busy ? "Sending Message…" : "Send Message"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
