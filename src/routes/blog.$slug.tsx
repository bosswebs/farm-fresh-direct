import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User, Newspaper } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getBlogPostBySlug } from "@/lib/admin-data.server";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Deacomart Blog` },
          { name: "description", content: loaderData.post.excerpt },
        ]
      : [],
  }),
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold font-display">Post not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been unpublished or removed.</p>
        <Link
          to="/blog"
          className="inline-flex mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
        >
          Back to Blog
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
});

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const paragraphs = post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display leading-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-leaf" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-leaf" /> {formatDate(post.publishedAt || post.lastUpdated)}
            </span>
          </div>
        </div>

        <div className="mt-8 aspect-video w-full overflow-hidden rounded-3xl border border-border bg-muted">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-leaf)] text-primary-foreground">
              <Newspaper className="w-14 h-14 opacity-70" />
            </div>
          )}
        </div>

        <div className="mt-10 space-y-5 text-sm md:text-base leading-relaxed text-foreground/90">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
