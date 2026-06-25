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
  Map,
} from "lucide-react";
import { WHATSAPP_LINK, WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/products-store";

export function SiteFooter() {
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
            Be EcoWise — Empowering Rwandan farmers and supplying quality food and beverages across
            all Districts.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" /> Order on WhatsApp
          </a>
        </div>

        {/* Platform Links */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            Platform
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <Link
                to="/browse"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-leaf shrink-0" /> Shop Products
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Map className="w-3.5 h-3.5 text-leaf shrink-0" /> Market Map
              </Link>
            </li>
            <li>
              <Link
                to="/training"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-leaf shrink-0" /> Farmer Academy
              </Link>
            </li>
            <li>
              <Link
                to="/consultancy"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-leaf shrink-0" /> Consultancy
              </Link>
            </li>
            <li>
              <Link
                to="/tracking"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-leaf shrink-0" /> Track Delivery
              </Link>
            </li>
            <li>
              <Link
                to="/impact"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-leaf shrink-0" /> Impact Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            Company
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <a href="/#about" className="hover:text-foreground transition-colors">
                About Deacomart
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-foreground transition-colors">
                Our Services
              </a>
            </li>
            <li>
              <a href="/#team" className="hover:text-foreground transition-colors">
                Our Team
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-foreground transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">
                Inventory Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-sm">
          <div className="font-semibold text-foreground mb-4 uppercase tracking-wider text-xs text-muted-foreground">
            Contact
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-leaf mt-0.5 shrink-0" />
              <span>
                Kigali, Rwanda
                <br />
                (All Districts served)
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
    </footer>
  );
}
