import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  GraduationCap,
  Truck,
  Briefcase,
  BarChart3,
  BellRing,
} from "lucide-react";
import { WHATSAPP_LINK, WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/products-store";
import { useLanguage } from "@/lib/i18n";
import { SubscribeModal } from "@/components/subscribe-modal";

export function SiteFooter() {
  const { t } = useLanguage();
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/images/logo.jpg"
              alt="Deacomart Logo"
              className="h-11 w-auto object-contain rounded-lg bg-white p-0.5 border border-border"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
            {t("footer.tagline")}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 max-w-xs">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> {t("nav.order_whatsapp")}
            </a>
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-leaf/10 border border-leaf/30 text-leaf hover:bg-leaf hover:text-primary-foreground text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <BellRing className="w-3.5 h-3.5" /> Subscribe to Agri Updates
            </button>
          </div>
        </div>

        {/* Platform Links */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            {t("footer.platform")}
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <Link
                to="/browse"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-leaf shrink-0" /> {t("nav.shop")}
              </Link>
            </li>
            <li>
              <Link
                to="/training"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-leaf shrink-0" /> {t("nav.academy")}
              </Link>
            </li>
            <li>
              <Link
                to="/consultancy"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-leaf shrink-0" /> {t("nav.consultancy")}
              </Link>
            </li>
            <li>
              <Link
                to="/tracking"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-leaf shrink-0" /> {t("nav.track_order")}
              </Link>
            </li>
            <li>
              <Link
                to="/impact"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-leaf shrink-0" /> {t("nav.impact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            {t("footer.company")}
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground transition-colors">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/trust" className="hover:text-foreground transition-colors">
                {t("nav.trust")}
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-foreground transition-colors">
                {t("nav.careers")}
              </Link>
            </li>
            <li>
              <Link to="/advertise" className="hover:text-foreground transition-colors">
                {t("nav.advertise")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">
                {t("nav.farmer_portal")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            {t("footer.contact")}
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-leaf mt-0.5 shrink-0" />
              <span>
                Kigali, Rwanda
                <br />
                {t("footer.rights")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-leaf shrink-0" />
              <div>
                <div>+250 780 165 257</div>
                <div>+250 798 975 082</div>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-leaf shrink-0" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-foreground transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>

          {/* Legal */}
          <div className="mt-5 p-3 bg-secondary/50 rounded-xl text-xs text-muted-foreground space-y-1">
            <div>
              <span className="font-semibold text-foreground">TIN:</span> 150039210
            </div>
            <div>
              <span className="font-semibold text-foreground">Bank:</span> Equity Bank ·
              4014201311299
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Deacomart Ltd — Be EcoWise · Kigali, Rwanda</span>
          <span className="flex items-center gap-4">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">
              {CONTACT_EMAIL}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {WHATSAPP_NUMBER}
            </a>
          </span>
        </div>
      </div>

      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </footer>
  );
}
