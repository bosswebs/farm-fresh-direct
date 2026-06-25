import { useState } from "react";
import { X, Send, Award, Briefcase, Truck, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { WHATSAPP_LINK } from "@/lib/products-store";

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
                <img src="/images/whatsapp.svg" alt="" className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Deacomart Support</h4>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                  Online · "Be EcoWise"
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick links & info */}
          <div className="p-4 space-y-4 bg-background max-h-80 overflow-y-auto text-sm">
            <div className="bg-card border border-border p-3 rounded-xl">
              <p className="text-foreground leading-relaxed">
                Hello! 👋 We are here to help you connect with Rwandan farms, get consultancy, or
                register for training. What would you like to do?
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block">
                Quick Actions
              </span>

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
          <form
            onSubmit={handleSubmitMessage}
            className="p-3 border-t border-border bg-card flex gap-2"
          >
            <input
              type="text"
              required
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="input flex-1 py-2 px-3 text-xs"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#25d366] hover:bg-[#20b038] text-white transition-colors"
            >
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
        {isOpen ? (
          <X className="w-7 h-7 text-[#25d366]" />
        ) : (
          <img src="/images/whatsapp.svg" alt="" className="w-12 h-12" />
        )}
      </button>
    </div>
  );
}
