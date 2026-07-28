import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Newspaper,
  Plus,
  Trash2,
  Edit,
  ChevronRight,
  Search,
  Filter,
  Eye,
  FileText,
  Archive,
  ExternalLink,
  X,
  Image as ImageIcon,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  updateBlogPostStatus,
  deleteBlogPost,
} from "@/lib/admin-data.server";
import { uploadProductImage } from "@/lib/products-store";

type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

export const Route = createFileRoute("/admin/blog")({
  loader: async () => {
    try {
      return { posts: await getBlogPosts() };
    } catch (e) {
      console.error("Failed to load blog posts:", e);
      return { posts: [] };
    }
  },
  head: () => ({
    meta: [{ title: "Blog & Updates Management — Admin Dashboard" }],
  }),
  component: AdminBlogPage,
});

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  status: "draft" as BlogPost["status"],
  author: "",
};

function AdminBlogPage() {
  const { posts: initialPosts } = Route.useLoaderData();
  const router = useRouter();

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [linkDraft, setLinkDraft] = useState<{ label: string; url: string } | null>(null);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const cursorPosRef = useRef<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  function trackCursor() {
    const el = bodyRef.current;
    if (el) cursorPosRef.current = el.selectionStart;
  }

  function insertIntoBody(snippet: string) {
    setForm((prev) => {
      const pos = cursorPosRef.current ?? prev.body.length;
      const nextBody = prev.body.slice(0, pos) + snippet + prev.body.slice(pos);
      const nextPos = pos + snippet.length;
      requestAnimationFrame(() => {
        const el = bodyRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(nextPos, nextPos);
        }
        cursorPosRef.current = nextPos;
      });
      return { ...prev, body: nextBody };
    });
  }

  async function refresh() {
    await router.invalidate();
  }

  function openNewPostModal() {
    setEditingPost({});
    setForm(emptyForm);
  }

  function openEditPostModal(post: BlogPost) {
    setEditingPost(post);
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      coverImage: post.coverImage || "",
      status: post.status,
      author: post.author,
    });
  }

  async function handleSavePost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        body: form.body,
        coverImage: form.coverImage || null,
        status: form.status,
        author: form.author || undefined,
      };

      if (form.id) {
        const updated = await updateBlogPost({ data: { id: form.id, ...payload } });
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success("Blog post updated");
      } else {
        const created = await createBlogPost({ data: payload });
        setPosts((prev) => [created, ...prev]);
        toast.success("Blog post created");
      }
      setEditingPost(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(post: BlogPost, status: BlogPost["status"]) {
    try {
      const updated = await updateBlogPostStatus({ data: { id: post.id, status } });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(`Post set to ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDeletePost(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await deleteBlogPost({ data: { id: post.id } });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Blog post deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog post");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, coverImage: url }));
      toast.success("Thumbnail uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleInsertBodyImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setInsertingImage(true);
    try {
      const url = await uploadProductImage(file);
      insertIntoBody(`\n\n![Image description](${url})\n\n`);
      toast.success("Image inserted into post");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setInsertingImage(false);
    }
  }

  function handleInsertLink() {
    if (!linkDraft?.label.trim() || !linkDraft.url.trim()) {
      toast.error("Enter both link text and a URL");
      return;
    }
    insertIntoBody(`[${linkDraft.label.trim()}](${linkDraft.url.trim()})`);
    setLinkDraft(null);
  }

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/admin" className="hover:text-foreground">Admin Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Blog & Updates</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-leaf" /> Blog & Updates Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Post news and updates to the public Deacomart blog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Live Blog
          </a>
          <button
            onClick={openNewPostModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Total Posts <FileText className="w-4 h-4 text-leaf" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">{posts.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Published <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2 font-display">{publishedCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Drafts <Edit className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">{draftCount}</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Archived <Archive className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">
            {posts.filter((p) => p.status === "archived").length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search post title, author, or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Post</th>
                <th className="p-4">Author</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {posts.length === 0 ? "No blog posts yet. Click New Post to write your first update." : "No posts found matching filters."}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 max-w-sm">
                      <div className="font-bold text-foreground truncate">{post.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">/blog/{post.slug}</div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{post.author}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(post.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="p-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleStatusChange(post, e.target.value as BlogPost["status"])}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                            : post.status === "archived"
                            ? "bg-gray-500/10 text-gray-600 border-gray-500/30"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {post.status === "published" && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-leaf/10 text-leaf font-bold hover:bg-leaf hover:text-primary-foreground transition-all cursor-pointer inline-block"
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={() => openEditPostModal(post)}
                        className="px-2.5 py-1 rounded-lg border border-border font-bold hover:bg-muted transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="p-1 text-muted-foreground hover:text-red-500 cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)] max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold font-display">
              {form.id ? "Edit Blog Post" : "Write New Blog Post"}
            </h2>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Deacomart Launches New Cold-Chain Hub in Musanze"
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">
                  URL Slug (optional — auto-generated from title if left blank)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. cold-chain-hub-musanze"
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background font-mono"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A short teaser shown on the blog listing page..."
                  className="w-full p-3 rounded-xl border border-input bg-background"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase text-[10px] text-muted-foreground block">Post Content *</label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleInsertBodyImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={insertingImage}
                      />
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors">
                        <ImageIcon className="w-3 h-3" /> {insertingImage ? "Uploading..." : "Insert Image"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkDraft({ label: "", url: "" })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Link2 className="w-3 h-3" /> Insert Link
                    </button>
                  </div>
                </div>

                {linkDraft && (
                  <div className="mb-2 p-3 rounded-xl border border-border bg-muted/40 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={linkDraft.label}
                      onChange={(e) => setLinkDraft({ ...linkDraft, label: e.target.value })}
                      placeholder="Link text (e.g. Read the full report)"
                      className="flex-1 h-8 px-2.5 rounded-lg border border-input bg-background text-[11px]"
                    />
                    <input
                      type="url"
                      value={linkDraft.url}
                      onChange={(e) => setLinkDraft({ ...linkDraft, url: e.target.value })}
                      placeholder="https://example.com"
                      className="flex-1 h-8 px-2.5 rounded-lg border border-input bg-background text-[11px]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleInsertLink}
                        className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold"
                      >
                        Insert
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkDraft(null)}
                        className="h-8 px-3 rounded-lg border border-border text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  ref={bodyRef}
                  rows={8}
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  onClick={trackCursor}
                  onKeyUp={trackCursor}
                  onSelect={trackCursor}
                  placeholder="Write the full post. Separate paragraphs with a blank line."
                  className="w-full p-3 rounded-xl border border-input bg-background"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Tip: use the buttons above to drop in photos or links, or type your own — links look like{" "}
                  <code className="font-mono">[link text](https://example.com)</code>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Defaults to your account name"
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BlogPost["status"] })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">
                  Thumbnail (shown on the blog list & post header)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className="flex h-9 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-[11px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                      {uploading ? "Uploading..." : "Choose Thumbnail"}
                    </div>
                  </div>
                  {form.coverImage && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: "" })}
                      className="h-9 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {form.coverImage && (
                  <div className="mt-2 relative aspect-video max-w-xs rounded-xl overflow-hidden border border-border bg-muted">
                    <img src={form.coverImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading || insertingImage}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
