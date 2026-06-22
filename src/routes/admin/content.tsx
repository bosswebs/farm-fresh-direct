import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, RotateCcw, Plus, Trash2, Eye, Upload } from "lucide-react";
import {
  getDraft, saveDraft, publishDraft, discardDraft, resetContent,
  hasDraftChanges, SEED_CONTENT, type SiteContent
} from "@/lib/content-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({
  component: ContentManagementPage,
});

function ContentManagementPage() {
  const [c, setC] = useState<SiteContent>(() => getDraft());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(hasDraftChanges());
  }, [savedAt]);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function onSaveDraft() {
    saveDraft(c);
    setDirty(false);
    setSavedAt(Date.now());
    toast.success("Draft saved successfully!");
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
    toast.success("Content published live!");
  }

  function onDiscard() {
    if (!confirm("Discard draft and revert to currently published content?")) return;
    discardDraft();
    setC(getDraft());
    setDirty(false);
    setSavedAt(Date.now());
    toast.info("Draft discarded.");
  }

  function onReset() {
    if (!confirm("Reset BOTH published and draft content to defaults?")) return;
    resetContent();
    setC(SEED_CONTENT);
    setDirty(false);
    setSavedAt(Date.now());
    toast.info("Content reset to defaults.");
  }

  const status = dirty
    ? { label: "Unsaved changes", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-400" }
    : hasDraft
    ? { label: "Draft saved — not yet published", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-400" }
    : { label: "Live & published", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Landing Page Content Manager</h1>
          <p className="text-sm text-gray-500">Edit homepage slider settings, services, team profiles, and contact coordinates.</p>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.tone}`}>{status.label}</span>
          </div>
        </div>
        <ActionBar
          dirty={dirty}
          hasDraft={hasDraft}
          onSaveDraft={onSaveDraft}
          onPreview={onPreview}
          onPublish={onPublish}
          onDiscard={onDiscard}
          onReset={onReset}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Services */}
        <Section title="Core Activities (Services)">
          <div className="md:col-span-2">
            <RepeatList
              items={c.services}
              onChange={(items) => update("services", items)}
              emptyItem={{ id: "s-" + Math.random().toString(36).slice(2, 10), iconName: "Sprout", title: "", description: "" }}
              render={(item, setItem) => (
                <>
                  <Field label="Title">
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
                  </Field>
                  <Field label="Icon Code (Lucide Icon)">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.iconName} onChange={(e) => setItem({ ...item, iconName: e.target.value })}>
                      {["GraduationCap", "Truck", "Briefcase", "MessageCircle", "Phone", "Mail", "Building2", "ShieldCheck", "Sprout", "HelpCircle"].map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </Field>
                  <Field label="Description" full>
                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
                  </Field>
                </>
              )}
            />
          </div>
        </Section>

        {/* Partners */}
        <Section title="Trusted Partners">
          <div className="md:col-span-2">
            <RepeatList
              items={c.partners.map((name) => ({ name }))}
              onChange={(items) => update("partners", items.map((i) => i.name))}
              emptyItem={{ name: "" }}
              render={(item, setItem) => (
                <Field label="Partner name" full>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.name} onChange={(e) => setItem({ name: e.target.value })} />
                </Field>
              )}
            />
          </div>
        </Section>

        {/* Team */}
        <Section title="Team Members">
          <div className="md:col-span-2">
            <RepeatList
              items={c.team}
              onChange={(items) => update("team", items)}
              emptyItem={{ id: "t-" + Math.random().toString(36).slice(2, 10), role: "", name: "", expertise: "" }}
              render={(item, setItem) => (
                <>
                  <Field label="Role"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.role} onChange={(e) => setItem({ ...item, role: e.target.value })} /></Field>
                  <Field label="Name"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} /></Field>
                  <Field label="Expertise" full><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={item.expertise} onChange={(e) => setItem({ ...item, expertise: e.target.value })} /></Field>
                </>
              )}
            />
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Information & Banking Coordinates">
          <Field label="Headquarters"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.headquarters} onChange={(e) => update("contact", { ...c.contact, headquarters: e.target.value })} /></Field>
          <Field label="Phones"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.phones} onChange={(e) => update("contact", { ...c.contact, phones: e.target.value })} /></Field>
          <Field label="WhatsApp"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.whatsapp} onChange={(e) => update("contact", { ...c.contact, whatsapp: e.target.value })} /></Field>
          <Field label="Email"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.email} onChange={(e) => update("contact", { ...c.contact, email: e.target.value })} /></Field>
          <Field label="Bank Name"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.bankName} onChange={(e) => update("contact", { ...c.contact, bankName: e.target.value })} /></Field>
          <Field label="Account Holder"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.bankHolder} onChange={(e) => update("contact", { ...c.contact, bankHolder: e.target.value })} /></Field>
          <Field label="Account Number"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.bankAccount} onChange={(e) => update("contact", { ...c.contact, bankAccount: e.target.value })} /></Field>
          <Field label="TIN"><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={c.contact.tin} onChange={(e) => update("contact", { ...c.contact, tin: e.target.value })} /></Field>
        </Section>
      </div>
    </div>
  );
}

interface ActionBarProps {
  dirty: boolean;
  hasDraft: boolean;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onReset: () => void;
}

function ActionBar({
  dirty, hasDraft, onSaveDraft, onPreview, onPublish, onDiscard, onReset
}: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onReset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
        <RotateCcw className="w-3.5 h-3.5" /> Reset to default
      </button>
      {hasDraft && (
        <button onClick={onDiscard} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
          Discard draft
        </button>
      )}
      <button onClick={onSaveDraft} disabled={!dirty} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
        <Save className="w-3.5 h-3.5" /> Save draft
      </button>
      <button onClick={onPreview} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
        <Eye className="w-3.5 h-3.5" /> Preview
      </button>
      <button onClick={onPublish} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">
        <Upload className="w-3.5 h-3.5" /> Publish Live
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-base font-bold text-gray-900 mb-5">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{label}</span>
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
        <div key={i} className="relative rounded-xl border border-gray-100 bg-gray-50 p-4 grid md:grid-cols-2 gap-3">
          {render(item, (next) => {
            const copy = items.slice();
            copy[i] = next;
            onChange(copy);
          })}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, structuredClone(emptyItem)])}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-200 text-xs font-semibold text-gray-400 hover:text-gray-700 hover:border-gray-300"
      >
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}
