import { Link } from "@tanstack/react-router";
import { Leaf, MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/products-store";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-[image:var(--gradient-leaf)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Leaf className="w-5 h-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span>Deacomart</span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">Be EcoWise</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/browse" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Shop</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Inventory</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
          >
            <MessageCircle className="w-4 h-4" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}