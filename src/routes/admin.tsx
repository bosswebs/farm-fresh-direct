import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, Eye, Upload, Lock, LogOut, KeyRound } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import {
  getDraft, saveDraft, publishDraft, discardDraft, resetContent,
  hasDraftChanges, DEFAULT_CONTENT, type SiteContent,
  verifyAdminPassword, isAdminAuthed, adminSignOut, changeAdminPassword,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/content-store";

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
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(isAdminAuthed()); }, []);
  if (!authed) return <AuthGate onAuthed={() => setAuthed(true)} />;
  return <AdminEditor onSignOut={() => { adminSignOut(); setAuthed(false); }} />;
}

function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const ok = await verifyAdminPassword(password);
    setBusy(false);
    if (ok) onAuthed();
    else setError("Incorrect password.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" /> Admin access
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign in to edit content</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Only authorized administrators can change site content. Default password is{" "}
            <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground">{DEFAULT_ADMIN_PASSWORD}</code>{" "}
            on first use — change it from inside the dashboard.
          </p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              autoFocus
              className="input"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Checking…" : "Unlock admin"}
            </button>
          </form>
          <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminEditor({ onSignOut }: { onSignOut: () => void }) {
  const [c, setC] = useState<SiteContent>(() => getDraft());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { setHasDraft(hasDraftChanges()); }, [savedAt]);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function onSaveDraft() {
    saveDraft(c);
    setDirty(false);
    setSavedAt(Date.now());
  }

  function onPreview() {
    saveDraft(c);
    setDirty(false);
    setSavedAt(Date.now());
    window.open("/?preview=1", "_blank", "noopener");
  }

  function onPublish() {
    if (!confirm("Publish these changes? They will replace the live site content.")) return;
    publishDraft(c);
    setDirty(false);
    setSavedAt(Date.now());
  }

  function onDiscard() {
    if (!confirm("Discard draft and revert to currently published content?")) return;
    discardDraft();
    setC(getDraft());
    setDirty(false);
    setSavedAt(Date.now());
  }

  function onReset() {
    if (!confirm("Reset BOTH published and draft content to defaults?")) return;
    resetContent();
    setC(DEFAULT_CONTENT);
    setDirty(false);
    setSavedAt(Date.now());
  }

  const status = dirty
    ? { label: "Unsaved changes", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-400" }
    : hasDraft
    ? { label: "Draft saved — not yet published", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-400" }
    : { label: "Live & published", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" };

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
            <p className="mt-2 text-muted-foreground text-sm">
              Edit Services, Team, Partners, Contact and Delivery &amp; Payment Terms. Changes are kept as a private draft —
              use <strong>Preview</strong> to review and <strong>Publish</strong> to push them live.
            </p>
            <div className="mt-3 inline-flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.tone}`}>{status.label}</span>
              <button onClick={() => setShowPwd(true)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Change password
              </button>
              <button onClick={onSignOut} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>
          <ActionBar
            dirty={dirty}
            hasDraft={hasDraft}
            onSaveDraft={onSaveDraft}
            onPreview={onPreview}
            onPublish={onPublish}
            onDiscard={onDiscard}
          />
        </div>

        {showPwd && <ChangePasswordDialog onClose={() => setShowPwd(false)} />}

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

        <div className="mt-10">
          <ActionBar
            dirty={dirty}
            hasDraft={hasDraft}
            onSaveDraft={onSaveDraft}
            onPreview={onPreview}
            onPublish={onPublish}
            onDiscard={onDiscard}
            extra={
              <button onClick={onReset} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-secondary">
                <RotateCcw className="w-3.5 h-3.5" /> Reset all to defaults
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

function ActionBar({
  dirty, hasDraft, onSaveDraft, onPreview, onPublish, onDiscard, extra,
}: {
  dirty: boolean; hasDraft: boolean;
  onSaveDraft: () => void; onPreview: () => void; onPublish: () => void; onDiscard: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {extra}
      {hasDraft && (
        <button onClick={onDiscard} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary">
          Discard draft
        </button>
      )}
      <button onClick={onSaveDraft} disabled={!dirty} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary disabled:opacity-50">
        <Save className="w-4 h-4" /> Save draft
      </button>
      <button onClick={onPreview} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15">
        <Eye className="w-4 h-4" /> Preview
      </button>
      <button onClick={onPublish} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
        <Upload className="w-4 h-4" /> Publish
      </button>
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
    if (next.length < 6) { setMsg("New password must be at least 6 characters."); return; }
    if (next !== confirmPwd) { setMsg("New passwords do not match."); return; }
    setBusy(true);
    const ok = await changeAdminPassword(current, next);
    setBusy(false);
    if (!ok) { setMsg("Current password is incorrect."); return; }
    setMsg("Password updated.");
    setTimeout(onClose, 800);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change admin password</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <input className="input" type="password" placeholder="New password (min 6 chars)" value={next} onChange={(e) => setNext(e.target.value)} />
          <input className="input" type="password" placeholder="Confirm new password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary">Cancel</button>
            <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50">Update</button>
          </div>
        </form>
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