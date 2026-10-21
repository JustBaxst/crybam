"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

export function AdminSearchBar({ placeholder = "Поиск..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [text, setText] = useState(searchParams.get("q") || "");
  const [isPending, setIsPending] = useState(false);

  // Debounce
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

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 rounded-lg border border-border bg-surface focus:border-accent outline-none transition-colors text-sm"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
        {isPending ? (
          <Loader2 className="w-4 h-4 text-muted animate-spin" />
        ) : text ? (
          <button onClick={() => setText("")} className="text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}