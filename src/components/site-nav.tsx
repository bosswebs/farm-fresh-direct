import { Link } from "@tanstack/react-router";
import { Leaf, ArrowRight } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-primary">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-[image:var(--gradient-leaf)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Leaf className="w-5 h-5" />
          </span>
          AgriMarket
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/browse" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Browse</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Farmer dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]">
            Sell produce <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}