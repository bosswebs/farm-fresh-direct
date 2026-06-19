import { Link } from "@tanstack/react-router";
import { Leaf, MessageCircle, ShoppingBag, Menu, X, MapPin, Award, Briefcase, BarChart3, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { listCart, subscribeCart } from "@/lib/cart-store";
import { WHATSAPP_LINK } from "@/lib/products-store";
import deacomartLogo from "@/assets/logo.jpg";

export function SiteNav() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const cart = listCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCount();
    return subscribeCart(updateCount);
  }, []);

  function triggerCartOpen() {
    window.dispatchEvent(new CustomEvent("agrimarket:open-cart"));
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Shop", icon: ShoppingBag },
    { to: "/map", label: "Market Map", icon: MapPin },
    { to: "/training", label: "Academy", icon: Award },
    { to: "/consultancy", label: "Consultancy", icon: Briefcase },
    { to: "/tracking", label: "Track Order", icon: Truck },
    { to: "/impact", label: "Impact", icon: BarChart3 },
    { to: "/dashboard", label: "Inventory", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img
            src={deacomartLogo}
            alt="Deacomart Logo"
            className="h-10 w-auto object-contain rounded-lg bg-white p-0.5 border border-border"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-primary font-semibold border-b-2 border-leaf pb-1" }}
              className="hover:text-foreground transition-colors pb-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Icon with badge */}
          <button
            onClick={triggerCartOpen}
            className="relative p-2 rounded-xl border border-border bg-card text-foreground hover:border-leaf hover:text-primary transition-all shadow-[var(--shadow-soft)]"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-leaf text-primary-foreground text-[10px] font-bold grid place-items-center animate-in scale-in duration-200">
                {cartCount}
              </span>
            )}
          </button>

          {/* Farmer Portal CTA */}
          <Link
            to="/dashboard"
            className="hidden lg:inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-600/30 text-emerald-800 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-600/50 transition-all shadow-xs"
          >
            Farmer Portal
          </Link>

          {/* Admin Portal CTA */}
          <Link
            to="/admin"
            className="hidden lg:inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all shadow-xs"
          >
            Admin
          </Link>

          {/* WhatsApp Quick Link */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
          >
            <MessageCircle className="w-4 h-4" /> Order via WhatsApp
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-border bg-card hover:border-leaf text-foreground transition-all"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-card border-b border-border shadow-[var(--shadow-soft)] animate-in slide-in-from-top duration-200">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-primary font-bold bg-secondary/50" }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon && <link.icon className="w-4 h-4 text-leaf shrink-0" />}
                {link.label}
              </Link>
            ))}

            <hr className="border-border/60" />

            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-600/20 text-emerald-800 bg-emerald-500/5 font-semibold text-sm hover:bg-emerald-500/10 transition-colors"
            >
              Farmer Portal
            </Link>

            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-gray-700 bg-gray-50 font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Admin Portal
            </Link>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex sm:hidden items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> Order via WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}