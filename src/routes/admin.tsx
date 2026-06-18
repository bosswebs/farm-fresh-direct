import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { getContent, saveContent, resetContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/content-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Edit site content — Deacomart" },
      { name: "description", content: "Update services, team, partners, contact and delivery terms without touching code." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

const ICON_OPTIONS = ["GraduationCap", "Truck", "Briefcase", "MessageCircle", "ShieldCheck", "Sprout"];

function Admin() {
  const [c, setC] = useState<SiteContent>(() => getContent());
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function onSave() {
    saveContent(c);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function onReset() {
    if (!confirm("Reset all site content to defaults?")) return;
    resetContent();
    setC(DEFAULT_CONTENT);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Site content editor</h1>
            <p className="mt-2 text-muted-foreground text-sm">Edit Services, Team, Partners, Contact and Delivery & Payment Terms. Changes save locally and update the landing page instantly.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={onSave} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
              <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Services */}
          <Section title="Core Activities (Services)">
            <Field label="Heading">
              <input className="input" value={c.servicesHeading} onChange={(e) => update("servicesHeading", e.target.value)} />
            </Field>
            <Field label="Intro">
              <textarea className="input min-h-[80px]" value={c.servicesIntro} onChange={(e) => update("servicesIntro", e.target.value)} />
            </Field>
            <RepeatList
              items={c.services}
              onChange={(items) => update("services", items)}
              emptyItem={{ icon: "Sprout", title: "", desc: "" }}
              render={(item, setItem) => (
                <>
                  <Field label="Title">
                    <input className="input" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
                  </Field>
                  <Field label="Icon">
                    <select className="input" value={item.icon} onChange={(e) => setItem({ ...item, icon: e.target.value })}>
                      {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </Field>
                  <Field label="Description" full>
                    <textarea className="input min-h-[70px]" value={item.desc} onChange={(e) => setItem({ ...item, desc: e.target.value })} />
                  </Field>
                </>
              )}
            />
          </Section>

          {/* Partners */}
          <Section title="Trusted Partners">
            <RepeatList
              items={c.partners.map((name) => ({ name }))}
              onChange={(items) => update("partners", items.map((i) => i.name))}
              emptyItem={{ name: "" }}
              render={(item, setItem) => (
                <Field label="Partner name" full>
                  <input className="input" value={item.name} onChange={(e) => setItem({ name: e.target.value })} />
                </Field>
              )}
            />
          </Section>

          {/* Team */}
          <Section title="Team Members">
            <RepeatList
              items={c.team}
              onChange={(items) => update("team", items)}
              emptyItem={{ role: "", name: "", expertise: "" }}
              render={(item, setItem) => (
                <>
                  <Field label="Role"><input className="input" value={item.role} onChange={(e) => setItem({ ...item, role: e.target.value })} /></Field>
                  <Field label="Name"><input className="input" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} /></Field>
                  <Field label="Expertise" full><input className="input" value={item.expertise} onChange={(e) => setItem({ ...item, expertise: e.target.value })} /></Field>
                </>
              )}
            />
          </Section>

          {/* Contact */}
          <Section title="Contact Information">
            <Field label="Headquarters"><input className="input" value={c.contact.headquarters} onChange={(e) => update("contact", { ...c.contact, headquarters: e.target.value })} /></Field>
            <Field label="Phones"><input className="input" value={c.contact.phones} onChange={(e) => update("contact", { ...c.contact, phones: e.target.value })} /></Field>
            <Field label="WhatsApp"><input className="input" value={c.contact.whatsapp} onChange={(e) => update("contact", { ...c.contact, whatsapp: e.target.value })} /></Field>
            <Field label="Email"><input className="input" value={c.contact.email} onChange={(e) => update("contact", { ...c.contact, email: e.target.value })} /></Field>
            <Field label="Bank line" full><input className="input" value={c.contact.bank} onChange={(e) => update("contact", { ...c.contact, bank: e.target.value })} /></Field>
          </Section>

          {/* Terms */}
          <Section title="Delivery & Payment Terms">
            <Field label="Intro paragraph" full>
              <textarea className="input min-h-[80px]" value={c.terms.intro} onChange={(e) => update("terms", { ...c.terms, intro: e.target.value })} />
            </Field>
            <Field label="Bank name"><input className="input" value={c.terms.bankName} onChange={(e) => update("terms", { ...c.terms, bankName: e.target.value })} /></Field>
            <Field label="Account name"><input className="input" value={c.terms.accountName} onChange={(e) => update("terms", { ...c.terms, accountName: e.target.value })} /></Field>
            <Field label="Account number"><input className="input" value={c.terms.accountNumber} onChange={(e) => update("terms", { ...c.terms, accountNumber: e.target.value })} /></Field>
            <Field label="TIN"><input className="input" value={c.terms.tin} onChange={(e) => update("terms", { ...c.terms, tin: e.target.value })} /></Field>
            <Field label="LPO lead-time (hours)">
              <input type="number" min={0} className="input" value={c.terms.lpoHours} onChange={(e) => update("terms", { ...c.terms, lpoHours: Number(e.target.value) || 0 })} />
            </Field>
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Terms bullets</div>
              <RepeatList
                items={c.terms.bullets.map((text) => ({ text }))}
                onChange={(items) => update("terms", { ...c.terms, bullets: items.map((i) => i.text) })}
                emptyItem={{ text: "" }}
                render={(item, setItem) => (
                  <Field label="Bullet" full>
                    <textarea className="input min-h-[60px]" value={item.text} onChange={(e) => setItem({ text: e.target.value })} />
                  </Field>
                )}
              />
            </div>
          </Section>
        </div>

        <div className="mt-10 flex justify-end gap-2">
          <button onClick={onReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={onSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-5">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function RepeatList<T>({
  items, onChange, emptyItem, render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  render: (item: T, setItem: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="md:col-span-2 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-border bg-background p-4 grid md:grid-cols-2 gap-3">
          {render(item, (next) => {
            const copy = items.slice();
            copy[i] = next;
            onChange(copy);
          })}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, structuredClone(emptyItem)])}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30"
      >
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}