import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageCircle,
  ShoppingBag,
  Menu,
  X,
  MapPin,
  Award,
  Briefcase,
  BarChart3,
  ChevronDown,
  Info,
  House,
  Truck,
  ShieldCheck,
  Megaphone,
  Mail,
  User,
  Leaf,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { listCart, subscribeCart, openCartDrawer } from "@/lib/cart-store";
import { WHATSAPP_LINK } from "@/lib/products-store";
import { useLanguage, type TranslationKey } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRIMARY_NAV_CONFIG = [
  { to: "/", labelKey: "nav.home", icon: House },
  { to: "/about", labelKey: "nav.about", icon: Info },
  { to: "/advertise", labelKey: "nav.advertise", icon: Megaphone },
  { to: "/careers", labelKey: "nav.careers", icon: Briefcase },
  { to: "/contact", labelKey: "nav.contact", icon: Mail },
] as const;

const SHOP_NAV_CONFIG = [
  {
    to: "/browse",
    labelKey: "nav.shop",
    descKey: "nav.shop_desc",
    icon: ShoppingBag,
  },
  {
    to: "/tracking",
    labelKey: "nav.track_order",
    descKey: "nav.track_order_desc",
    icon: Truck,
  },
] as const;

const SERVICE_NAV_CONFIG = [
  {
    to: "/training",
    labelKey: "nav.academy",
    descKey: "nav.academy_desc",
    icon: Award,
  },
  {
    to: "/consultancy",
    labelKey: "nav.consultancy",
    descKey: "nav.consultancy_desc",
    icon: Briefcase,
  },
] as const;

export function SiteNav() {
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const isShopRoute = SHOP_NAV_CONFIG.some((link) => pathname.startsWith(link.to));
  const isServicesRoute = SERVICE_NAV_CONFIG.some((link) => pathname.startsWith(link.to));

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

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
    setIsMobileServicesOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img
            src="/images/logo.jpg"
            alt="Deacomart Logo"
            className="h-10 w-auto object-contain rounded-lg bg-white p-0.5 border border-border"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-5 text-sm font-medium text-muted-foreground"
        >
          {/* Home */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary font-semibold border-b-2 border-leaf pb-1" }}
            className="hover:text-foreground transition-colors pb-1"
          >
            {t("nav.home")}
          </Link>

          {/* Shop Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`group flex items-center gap-1 pb-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 cursor-pointer ${
                  isShopRoute
                    ? "border-b-2 border-leaf font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.shop")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={12} className="w-80 p-2">
              {SHOP_NAV_CONFIG.map((link) => {
                const Icon = link.icon;
                return (
                  <DropdownMenuItem key={link.to} asChild className="p-0">
                    <Link
                      to={link.to}
                      activeProps={{ className: "bg-secondary text-primary" }}
                      className="group flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 outline-none transition-colors focus:bg-secondary"
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground">
                          {t(link.labelKey as TranslationKey)}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {t(link.descKey as TranslationKey)}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Services Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`group flex items-center gap-1 pb-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 cursor-pointer ${
                  isServicesRoute
                    ? "border-b-2 border-leaf font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.services")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={12} className="w-80 p-2">
              {SERVICE_NAV_CONFIG.map((link) => {
                const Icon = link.icon;
                return (
                  <DropdownMenuItem key={link.to} asChild className="p-0">
                    <Link
                      to={link.to}
                      activeProps={{ className: "bg-secondary text-primary" }}
                      className="group flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 outline-none transition-colors focus:bg-secondary"
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground">
                          {t(link.labelKey as TranslationKey)}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {t(link.descKey as TranslationKey)}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {PRIMARY_NAV_CONFIG.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="pb-1 transition-colors hover:text-foreground"
              activeProps={{ className: "border-b-2 border-leaf pb-1 font-semibold text-primary" }}
            >
              {t(link.labelKey as TranslationKey)}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Language Switcher (ENGLISH - RWANDA flags) */}
          <div className="hidden sm:block">
            <LanguageSwitcher variant="desktop" />
          </div>

          {/* Cart Icon with badge */}
          <button
            onClick={triggerCartOpen}
            className="relative p-2 rounded-xl border border-border bg-card text-foreground hover:border-leaf hover:text-primary transition-all shadow-[var(--shadow-soft)] cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-leaf text-primary-foreground text-[10px] font-bold grid place-items-center animate-in scale-in duration-200">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-border bg-card text-foreground hover:border-leaf hover:text-primary transition-all cursor-pointer shadow-xs">
              <User className="w-3.5 h-3.5 text-leaf" />
              <span>{t("nav.account")}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl bg-card border border-border shadow-lg space-y-1">
              <DropdownMenuItem asChild>
                <Link to="/register-farmer" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-muted cursor-pointer">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t("nav.register")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-muted cursor-pointer">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <span>{t("nav.farmer_portal")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-muted cursor-pointer">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("nav.admin")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* WhatsApp Quick Link */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
          >
            <MessageCircle className="w-4 h-4" /> {t("nav.order_whatsapp")}
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen((isOpen) => !isOpen);
              setIsMobileServicesOpen(false);
            }}
            className="xl:hidden p-2 rounded-xl border border-border bg-card hover:border-leaf text-foreground transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-card border-b border-border shadow-[var(--shadow-soft)] animate-in slide-in-from-top duration-200">
          <nav aria-label="Mobile navigation" className="px-6 py-4 flex flex-col gap-2">
            {/* Mobile Language Switcher (Flags) */}
            <div className="mb-2">
              <LanguageSwitcher variant="mobile" />
            </div>

            {/* Home */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary font-bold bg-secondary/50" }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <House className="w-4 h-4 text-leaf shrink-0" />
              {t("nav.home")}
            </Link>

            {/* Mobile Shop Menu */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileShopOpen((isOpen) => !isOpen)}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                  isShopRoute
                    ? "bg-secondary/50 font-bold text-primary"
                    : "text-muted-foreground"
                }`}
                aria-expanded={isMobileShopOpen}
                aria-controls="mobile-shop-menu"
              >
                <ShoppingBag className="h-4 w-4 shrink-0 text-leaf" />
                <span className="flex-1">{t("nav.shop")}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileShopOpen && (
                <div
                  id="mobile-shop-menu"
                  className="ml-5 mt-1 space-y-1 border-l border-border pl-3"
                >
                  {SHOP_NAV_CONFIG.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMobileMenu}
                        activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-leaf" />
                        {t(link.labelKey as TranslationKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Services Menu */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen((isOpen) => !isOpen)}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                  isServicesRoute
                    ? "bg-secondary/50 font-bold text-primary"
                    : "text-muted-foreground"
                }`}
                aria-expanded={isMobileServicesOpen}
                aria-controls="mobile-services-menu"
              >
                <Briefcase className="h-4 w-4 shrink-0 text-leaf" />
                <span className="flex-1">{t("nav.services")}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileServicesOpen && (
                <div
                  id="mobile-services-menu"
                  className="ml-5 mt-1 space-y-1 border-l border-border pl-3"
                >
                  {SERVICE_NAV_CONFIG.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMobileMenu}
                        activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-leaf" />
                        {t(link.labelKey as TranslationKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {PRIMARY_NAV_CONFIG.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                activeProps={{ className: "text-primary font-bold bg-secondary/50" }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon && <link.icon className="w-4 h-4 text-leaf shrink-0" />}
                {t(link.labelKey as TranslationKey)}
              </Link>
            ))}

            <hr className="my-2 border-border/60" />

            <Link
              to="/register-farmer"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/40 text-primary bg-card font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {t("nav.register")}
            </Link>

            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-600/20 text-emerald-800 bg-emerald-500/5 font-semibold text-sm hover:bg-emerald-500/10 transition-colors"
            >
              {t("nav.farmer_portal")}
            </Link>

            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-gray-700 bg-gray-50 font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              {t("nav.admin")}
            </Link>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex sm:hidden items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> {t("nav.order_whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

