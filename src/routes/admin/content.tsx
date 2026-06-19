import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search, Plus, Edit, Eye, Trash2, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { contentPages, getStatusColor } from "../../lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({
  component: ContentManagementPage,
});

function ContentManagementPage() {
  const [pages, setPages] = useState(contentPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "page" | "blog" | "news">("all");

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || p.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleToggleStatus = (id: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === "published" ? "draft" : "published";
        toast.success(`"${p.title}" status updated to ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Content Management System</h1>
          <p className="text-sm text-gray-500">Edit homepage slider settings, agricultural guides, news blogs, and FAQs</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Create Content
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {(["all", "page", "blog", "news"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors
              ${activeTab === tab
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-gray-500 hover:bg-gray-50"
              }`}
          >
            {tab === "all" ? "All Content" : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search content by title, editor name..."
          className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm h-auto"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <div key={page.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider">
                  {page.type}
                </Badge>
                <Badge className={`text-[10px] font-bold border ${getStatusColor(page.status)}`}>
                  {page.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{page.title}</h3>
                <p className="text-[10px] text-gray-400 mt-2">Edited by {page.author} · {page.lastUpdated}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400">{page.id}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(page.id)} className="h-7 text-[10px]">
                  {page.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info(`Editing ${page.title}`)}>
                  <Edit className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
