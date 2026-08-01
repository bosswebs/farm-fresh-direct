import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Newspaper, Search, Calendar, User, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedBlogPosts } from "@/lib/admin-data.server";
import { absoluteUrl, socialImageUrl } from "@/lib/site-config";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const title = "Blog & Updates — Deacomart Ltd";
    const description =
      "News, updates, and stories from Deacomart Ltd — Rwanda's agribusiness marketplace and farmer empowerment platform.";
    const image = socialImageUrl(null);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: absoluteUrl("/blog") },
        { property: "og:site_name", content: "Deacomart Ltd" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
    };
  },
  loader: async () => {
    try {
      return { posts: await getPublishedBlogPosts() };
    } catch (e) {
      console.error("Failed to load blog posts:", e);
      return { posts: [] };
    }
  },
  component: BlogPage,
});

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <Newspaper className="w-4 h-4 text-leaf" /> Blog & Updates
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.08] font-display">
            Stories from Rwanda's Agribusiness Frontline
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Updates on farmer training, marketplace milestones, food safety, and Deacomart's journey to strengthen
            Rwanda's agricultural value chain.
          </p>
        </div>
      </section>

      {/* Search & Posts */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 pb-6 border-b border-border">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts by title, topic, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-input bg-card text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 shadow-xs"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-3xl p-8 max-w-lg mx-auto">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold font-display">
              {posts.length === 0 ? "No posts published yet" : "No Matching Posts Found"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {posts.length === 0
                ? "Check back soon for updates from the Deacomart team."
                : "Try adjusting your search."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col rounded-3xl bg-card border border-border hover:border-leaf/50 transition-all overflow-hidden shadow-[var(--shadow-soft)]"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-leaf)] text-primary-foreground">
                      <Newspaper className="w-10 h-10 opacity-70" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-leaf transition-colors font-display line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-leaf" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-leaf" /> {formatDate(post.publishedAt || post.lastUpdated)}
                    </span>
                  </div>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-leaf group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
