"use client";

import { Search } from "lucide-react";

export function MobileSearchButton() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className="sm:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg border border-border text-muted hover:text-foreground transition-colors"
      aria-label="Глобальный поиск"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}