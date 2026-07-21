import { useState } from "react";
import { useLanguage, type Language } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export function FlagUK({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={`inline-block rounded-xs shadow-xs border border-black/15 shrink-0 ${className}`}>
      <clipPath id="uk-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <g clipPath="url(#uk-clip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}

export function FlagRwanda({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={`inline-block rounded-xs shadow-xs border border-black/15 shrink-0 ${className}`}>
      <rect width="60" height="20" fill="#00A3E0" />
      <rect y="20" width="60" height="10" fill="#FAD201" />
      <rect y="30" width="60" height="10" fill="#20603D" />
      <g transform="translate(48, 10)">
        <circle r="4" fill="#FAD201" />
        <path
          d="M0,-6.5 L0,6.5 M-6.5,0 L6.5,0 M-4.5,-4.5 L4.5,4.5 M-4.5,4.5 L4.5,-4.5"
          stroke="#FAD201"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile" | "inline";
}

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "inline" || variant === "mobile") {
    return (
      <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/80">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            language === "en"
              ? "bg-background text-primary shadow-xs border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FlagUK />
          <span>ENGLISH</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("rw")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            language === "rw"
              ? "bg-background text-primary shadow-xs border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FlagRwanda />
          <span>RWANDA</span>
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card text-foreground hover:border-leaf hover:bg-secondary/40 transition-all text-xs font-bold shadow-xs cursor-pointer focus:outline-none"
        >
          {language === "en" ? (
            <>
              <FlagUK className="w-4 h-3" />
              <span>ENGLISH</span>
            </>
          ) : (
            <>
              <FlagRwanda className="w-4 h-3" />
              <span>RWANDA</span>
            </>
          )}
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1.5">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FlagUK className="w-4 h-3" />
            <span>ENGLISH</span>
          </div>
          {language === "en" && <Check className="w-3.5 h-3.5 text-leaf" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("rw")}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FlagRwanda className="w-4 h-3" />
            <span>RWANDA</span>
          </div>
          {language === "rw" && <Check className="w-3.5 h-3.5 text-leaf" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
