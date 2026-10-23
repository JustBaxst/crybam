"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { useIsMac } from "@/lib/useIsMac";



export function AdminSearchBar({ 
  placeholder = "Поиск...", 
  showGlobalSearch = false 
}: { 
  placeholder?: string; 
  showGlobalSearch?: boolean;
}) {



  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  

  const isMac = useIsMac();
  
  const [text, setText] = useState(searchParams.get("q") || "");
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);





  // Слушаем закрытие глобальной палитры, чтобы вернуть фокус
  useEffect(() => {
    const handleFocus = () => inputRef.current?.focus();
    window.addEventListener("command-palette-closed", handleFocus);
    return () => window.removeEventListener("command-palette-closed", handleFocus);
  }, []);

  // Debounce для фильтрации таблицы
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (text === currentQ) return;

    setIsPending(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (text) {
        params.set("q", text);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
      setIsPending(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, pathname, router, searchParams]);

  const openGlobalSearch = () => {
    window.dispatchEvent(new Event("open-command-palette"));
  };

    return (
    <div className="relative flex items-center w-full bg-accent/10 rounded-xl px-3 h-11 transition-all focus-within:ring-2 focus-within:ring-accent">
      <Search className="w-5 h-5 text-muted shrink-0" />
      
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none px-3 outline-none text-sm text-foreground placeholder:text-muted/70"
      />

    <div className="flex items-center gap-2 shrink-0">
        {isPending ? (
          <Loader2 className="w-4 h-4 text-muted animate-spin" />
        ) : text ? (
          <button onClick={() => setText("")} className="text-muted hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        ) : null}
        
        {/* Кнопка вызова палитры */}
        {showGlobalSearch && (
          <button 
            onClick={openGlobalSearch}
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted/80 px-2.5 py-1.5 rounded-md border border-border/80 bg-background hover:bg-surface hover:text-foreground transition-all"
            title="Глобальный поиск"
          >
            <span className="font-semibold text-[13px]">{isMac ? "⌘" : "Ctrl"}</span>
            <span className="font-semibold text-[13px]">K</span>
          </button>
        )}
      </div>
    </div>
  );
}