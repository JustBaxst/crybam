"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Loader2 } from "lucide-react";

type SearchResult = {
  id: number;
  title: string;
  year: number | null;
  country: string | null;
  posterUrl: string | null;
  rating: number | null;
};

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Автофокус при открытии
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Слушатели Escape и клика вне
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

  // Debounce-поиск
  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Навигация стрелками
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/dramas/${results[activeIndex].id}`);
        closeAndReset();
      } else if (query.trim()) {
        router.push(`/dramas?q=${encodeURIComponent(query.trim())}`);
        closeAndReset();
      }
    }
  };

  const closeAndReset = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  const goTo = (id: number) => {
    router.push(`/dramas/${id}`);
    closeAndReset();
  };

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
            className="w-full max-w-xl mx-4 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
          >
            {/* Поле ввода */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Название дорамы..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted"
              />
              {loading && (
                <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0" />
              )}
              <kbd className="hidden md:inline-block text-[10px] text-muted px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Результаты */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-4 py-6 text-center text-sm text-muted">
                  Начни печатать, чтобы найти дораму
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="px-4 py-6 text-center text-sm text-muted">
                  По запросу «{query}» ничего не найдено
                </div>
              ) : (
                <div className="p-1.5">
                  {results.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => goTo(r.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        i === activeIndex ? "bg-accent/10" : "hover:bg-foreground/5"
                      }`}
                    >
                      {/* Мини-постер */}
                      <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {r.posterUrl ? (
                          <img
                            src={r.posterUrl}
                            alt={r.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-muted">🎬</span>
                        )}
                      </div>

                      {/* Инфо */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {r.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {[r.year, r.country].filter(Boolean).join(" · ")}
                        </p>
                      </div>

                      {/* Рейтинг */}
                      {r.rating != null && (
                        <div className="flex items-center gap-1 text-xs shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                          <span className="font-semibold">
                            {r.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Подвал */}
            {query.trim().length >= 2 && results.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>
                  Найдено: <span className="text-accent">{results.length}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    router.push(
                      `/dramas?q=${encodeURIComponent(query.trim())}`
                    );
                    closeAndReset();
                  }}
                  className="text-accent hover:underline"
                >
                  Показать все в каталоге →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}