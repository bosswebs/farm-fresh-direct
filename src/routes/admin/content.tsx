import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Save, RotateCcw, Plus, Trash2, Eye, Upload, X } from "lucide-react";
import {
  getDraft, saveDraft, publishDraft, discardDraft, resetContent,
  hasDraftChanges, SEED_CONTENT, type SiteContent
} from "@/lib/content-store";
import { toast } from "sonner";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/admin-data.server";
import { uploadProductImage } from "@/lib/products-store";
import type { TeamMember } from "@/lib/admin-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TEAM_IMAGE_BY_ID: Record<string, string> = {
  "t-1": "/images/staff/DUKUZUMUREMYI Eric.jpeg",
  "t-3": "/images/staff/Accountant - TURIMASO Innocent.jpeg",
  "t-4": "/images/staff/HABIMANA Jpseph.jpeg",
};

export const Route = createFileRoute("/admin/content")({
  loader: async () => {
    try {
      return {
        teamMembers: await getTeamMembers(),
      };
    } catch (e) {
      console.error("Failed to load team members:", e);
      return { teamMembers: [] };
    }
  },
  component: ContentManagementPage,
});

function ContentManagementPage() {
  const { teamMembers: initialTeam } = Route.useLoaderData();
  const router = useRouter();

  const [c, setC] = useState<SiteContent>(() => getDraft());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Database team members state
  const [teamList, setTeamList] = useState<TeamMember[]>(initialTeam);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form fields state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formExpertise, setFormExpertise] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formBiography, setFormBiography] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSocialMedia, setFormSocialMedia] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHasDraft(hasDraftChanges());
  }, [savedAt]);

  useEffect(() => {
    setTeamList(initialTeam);
  }, [initialTeam]);

  function openAddDialog() {
    setEditingMember(null);
    setFormName("");
    setFormRole("");
    setFormExpertise("");
    setFormImageUrl("");
    setFormDisplayOrder(teamList.length + 1);
    setFormBiography("");
    setFormPhone("");
    setFormEmail("");
    setFormSocialMedia("");
    setDialogOpen(true);
  }

  function openEditDialog(member: TeamMember) {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormExpertise(member.expertise);
    setFormImageUrl(member.imageUrl || "");
    setFormDisplayOrder(member.displayOrder);
    setFormBiography(member.biography || "");
    setFormPhone(member.phone || "");
    setFormEmail(member.email || "");
    setFormSocialMedia(member.socialMedia || "");
    setDialogOpen(true);
  }

  async function handleSaveTeamMember(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim() || !formExpertise.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      if (editingMember) {
        const updated = await updateTeamMember({
          data: {
            id: editingMember.id,
            name: formName,
            role: formRole,
            expertise: formExpertise,
            imageUrl: formImageUrl || null,
            displayOrder: formDisplayOrder,
            biography: formBiography || null,
            phone: formPhone || null,
            email: formEmail || null,
            socialMedia: formSocialMedia || null,
          },
        });
        setTeamList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        toast.success(`Updated ${formName}`);
      } else {
        const created = await createTeamMember({
          data: {
            name: formName,
            role: formRole,
            expertise: formExpertise,
            imageUrl: formImageUrl || null,
            displayOrder: formDisplayOrder,
            biography: formBiography || null,
            phone: formPhone || null,
            email: formEmail || null,
            socialMedia: formSocialMedia || null,
          },
        });
        setTeamList((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder));
        toast.success(`Created team profile for ${formName}`);
      }
      setDialogOpen(false);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTeamMember(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await deleteTeamMember({ data: { id } });
      setTeamList((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Removed ${name} from the team`);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete team member");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setFormImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

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

        {/* Team (Database Managed) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-50 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-gray-900">Our Team Profiles (Live Database)</h2>
              <p className="text-xs text-gray-400">Directly perform CRUD on team profiles visible on the homepage.</p>
            </div>
            <button
              type="button"
              onClick={openAddDialog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teamList.map((m) => {
              const staticImage = TEAM_IMAGE_BY_ID[m.id];
              const imageSrc = m.imageUrl || staticImage;
              return (
                <div
                  key={m.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image / Avatar */}
                    <div className="aspect-video w-full overflow-hidden bg-gray-200 relative">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={m.name}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-leaf)] text-3xl font-bold text-primary-foreground">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Order #{m.displayOrder}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                        {m.role}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mt-1">{m.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{m.expertise}</p>
                      {m.biography && (
                        <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 italic">
                          "{m.biography}"
                        </p>
                      )}
                      {(m.phone || m.email || m.socialMedia) && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-[10px] text-gray-400">
                          {m.email && <span className="truncate max-w-[120px]" title={m.email}>📧 {m.email}</span>}
                          {m.phone && <span>📞 {m.phone}</span>}
                          {m.socialMedia && <span className="truncate max-w-[100px]" title={m.socialMedia}>🔗 Social</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2 border-t border-gray-100/50 mt-3">
                    <button
                      type="button"
                      onClick={() => openEditDialog(m)}
                      className="flex-1 inline-flex justify-center items-center gap-1.5 py-1 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeamMember(m.id, m.name)}
                      className="inline-flex justify-center items-center p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {teamList.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 text-sm">
                No team profiles found in database. Click Add Member to create one!
              </div>
            )}
          </div>
        </section>

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

      {/* Dialog for Add/Edit Team Member */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-100 shadow-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-955">
              {editingMember ? `Edit ${editingMember.name}` : "Add Team Member Profile"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTeamMember} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="e.g. Dukuzumuremyi Eric"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Role / Designation</label>
              <input
                required
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="e.g. CEO"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Expertise / Background</label>
              <input
                required
                type="text"
                value={formExpertise}
                onChange={(e) => setFormExpertise(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="e.g. Agribusiness Expert"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Biography / About</label>
              <textarea
                value={formBiography}
                onChange={(e) => setFormBiography(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Write a brief biography about this team member..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="+250 780 ..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="name@deacomart.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Social Media Link</label>
                <input
                  type="text"
                  value={formSocialMedia}
                  onChange={(e) => setFormSocialMedia(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 0)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Upload Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className="flex h-10 w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                    {uploading ? "Uploading..." : "Choose File"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Photo URL (Optional)</label>
              <input
                type="text"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="https://example.com/avatar.jpg"
              />
              {formImageUrl && (
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => setFormImageUrl("")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-xs h-9 cursor-pointer text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
