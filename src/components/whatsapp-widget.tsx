import { useState } from "react";
import { X, Send, Award, Briefcase, Truck, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { WHATSAPP_LINK } from "@/lib/products-store";

/* ---- Official WhatsApp logo as inline SVG ---- */
function WhatsAppLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 175.216 175.552" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wa-btn-gradient" x1="85.915" y1="174.55" x2="85.915" y2="0.551" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#20b038" />
          <stop offset="1" stopColor="#60d66a" />
        </linearGradient>
      </defs>
      <path
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 8.144 30.68L25 174.547l58.902-15.438a61.05 61.05 0 0 0 29.181 7.435h.025c33.733 0 61.167-27.423 61.178-61.13.011-16.328-6.334-31.666-17.866-43.199A60.956 60.956 0 0 0 87.184 25.227z"
        fill="url(#wa-btn-gradient)"
      />
      <path
        d="M87.184 32.227c-29.882 0-54.178 24.285-54.188 54.13a53.98 53.98 0 0 0 7.573 27.567l1.176 1.869-5.001 18.26 18.747-4.916 1.804 1.069a54.085 54.085 0 0 0 27.594 7.54h.023c29.882 0 54.178-24.285 54.188-54.13a53.89 53.89 0 0 0-15.826-38.26 53.913 53.913 0 0 0-36.09-13.129z"
        fill="#fff"
      />
      <path
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.448 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.674-13.679z"
        fill="#25d366"
      />
    </svg>
  );
}

export function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  function handleSubmitMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const encoded = encodeURIComponent(chatMessage.trim());
    window.open(`${WHATSAPP_LINK}?text=${encoded}`, "_blank");
    setChatMessage("");
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-[var(--shadow-glow)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header — WhatsApp official dark green */}
          <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow">
                <WhatsAppLogo className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Deacomart Support</h4>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                  Online · "Be EcoWise"
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick links & info */}
          <div className="p-4 space-y-4 bg-background max-h-80 overflow-y-auto text-sm">
            <div className="bg-card border border-border p-3 rounded-xl">
              <p className="text-foreground leading-relaxed">
                Hello! 👋 We are here to help you connect with Rwandan farms, get consultancy, or register for training. What would you like to do?
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block">Quick Actions</span>

              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hello, I would like to request a quotation for agribusiness products.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-leaf hover:text-primary transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-medium">
                  <MessageCircle className="w-4 h-4 text-leaf" /> Request a Quote
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/training"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-leaf hover:text-primary transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4 text-leaf" /> Register for Training
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/consultancy"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-leaf hover:text-primary transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Briefcase className="w-4 h-4 text-leaf" /> Agribusiness Consulting
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/tracking"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-leaf hover:text-primary transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-leaf" /> Track Delivery Status
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSubmitMessage} className="p-3 border-t border-border bg-card flex gap-2">
            <input
              type="text"
              required
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="input flex-1 py-2 px-3 text-xs"
            />
            <button type="submit" className="p-2 rounded-lg bg-[#25d366] hover:bg-[#20b038] text-white transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button — real WhatsApp logo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.55)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.75)] transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Open WhatsApp Chat Widget"
      >
        {isOpen
          ? <X className="w-7 h-7 text-[#25d366]" />
          : <WhatsAppLogo className="w-12 h-12" />
        }
      </button>
    </div>
  );
}
