import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, Calendar, User, Newspaper } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getBlogPostBySlug } from "@/lib/admin-data.server";
import { absoluteUrl, socialImageUrl } from "@/lib/site-config";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { post } = loaderData;
    const title = `${post.title} — Deacomart Blog`;
    const description = post.excerpt || "News and updates from Deacomart Ltd.";
    const image = socialImageUrl(post.coverImage);
    const url = absoluteUrl(`/blog/${post.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:image:secure_url", content: image },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Deacomart Ltd" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
    };
  },
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

// Body content supports a small, safe markup subset authored via the admin editor:
//   ![alt text](https://image-url)   — a standalone image block
//   [link text](https://example.com) — an inline link within a paragraph
type BodyBlock = { type: "image"; alt: string; src: string } | { type: "paragraph"; text: string };

function parseBodyBlocks(body: string): BodyBlock[] {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const imageMatch = block.match(/^!\[([^\]]*)\]\((\S+)\)$/);
      if (imageMatch) return { type: "image", alt: imageMatch[1], src: imageMatch[2] };
      return { type: "paragraph", text: block };
    });
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith("/") || url.startsWith("mailto:");
}

function renderInline(text: string): ReactNode[] {
  const linkPattern = /\[([^\]]+)\]\((\S+?)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [full, label, url] = match;
    if (isSafeUrl(url)) {
      nodes.push(
        <a
          key={key++}
          href={url}
          target={url.startsWith("/") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="text-leaf font-semibold underline underline-offset-2 hover:text-primary transition-colors"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(full);
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const blocks = parseBodyBlocks(post.body);

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
          {blocks.map((block, i) =>
            block.type === "image" ? (
              <figure key={i} className="rounded-2xl overflow-hidden border border-border bg-muted">
                <img src={block.src} alt={block.alt} className="w-full h-auto" loading="lazy" />
                {block.alt && (
                  <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            ) : (
              <p key={i}>{renderInline(block.text)}</p>
            ),
          )}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
