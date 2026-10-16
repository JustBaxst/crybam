"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onClickAnywhere = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickAnywhere);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickAnywhere);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors text-sm text-muted w-full max-w-xs"
        aria-label="Поиск"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span>Поиск дорам, актёров...</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-start justify-center pt-15vh">
          <div
            ref={modalRef}
            className="w-full max-w-xl mx-4 rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Дорама, актёр, персонаж..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted"
              />
              <kbd className="hidden md:inline-block text-[10px] text-muted px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>

            <div className="p-6 text-center text-sm text-muted">
              {query.trim() === "" ? (
                <>Начни печатать, чтобы найти дораму</>
              ) : (
                <>
                  Поиск «<span className="text-foreground">{query}</span>» пока не работает.
                  <br />
                  Скоро подключим.
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}