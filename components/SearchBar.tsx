"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Loader2, Film, User, UserCircle, X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

type SearchResults = {
  dramas: { id: number; title: string; year: number | null; country: string | null; posterUrl: string | null; rating: number | null }[];
  people: { id: number; name: string;  photoUrl: string | null }[];
  characters: { id: number; name: string; imageUrl: string | null; drama: { id: number; title: string } }[]; 
};

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ dramas: [], people: [], characters: [] });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Блокируем скролл фоновой страницы, когда поиск открыт
  useLockBodyScroll(open);

  // Автофокус при открытии
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Слушатели Escape и клика вне
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndReset();
    };

    const onClickAnywhere = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeAndReset();
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
      setResults({ dramas: [], people: [], characters: [] });
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults({ 
          dramas: data.dramas || [], 
          people: data.people || [], 
          characters: data.characters || [] 
        });
        setActiveIndex(-1); 
      } catch {
        setResults({ dramas: [], people: [], characters: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const flatList = [
    ...results.dramas.map(d => ({ url: `/dramas/${d.id}` })),
    ...results.people.map(p => ({ url: `/people/${p.id}` })),
    ...results.characters.map(c => ({ url: `/dramas/${c.drama.id}` })),
  ];

  const totalFound = flatList.length;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, totalFound - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatList[activeIndex]) {
        router.push(flatList[activeIndex].url);
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
    setResults({ dramas: [], people: [], characters: [] });
    setActiveIndex(-1);
  };

  const goTo = (url: string) => {
    router.push(url);
    closeAndReset();
  };

  return (
    <div className="relative w-full max-w-xs" ref={containerRef}>
      
      {/* КОГДА ЗАКРЫТО: Показываем кнопку */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors text-sm text-muted w-full"
          aria-label="Поиск"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span>Поиск дорам, актёров...</span>
        </button>
      )}

      {/* КОГДА ОТКРЫТО: Показываем инпут на месте кнопки + дропдаун */}
      {open && (
        <>
          {/* Инпут (выглядит как кнопка, но с рамкой акцента) */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent bg-surface text-sm text-foreground w-full shadow-sm relative z-50">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Дорамы, актеры, персонажи..."
              className="flex-1 bg-transparent outline-none placeholder:text-muted"
            />
            {loading && <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0" />}
            {query ? (
              <button onClick={() => setQuery("")} className="text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block text-[10px] text-muted px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            )}
          </div>

          {/* Выпадающий список результатов */}
          <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-4 py-6 text-center text-sm text-muted">
                  Начни печатать, чтобы найти...
                </div>
              ) : totalFound === 0 && !loading ? (
                <div className="px-4 py-6 text-center text-sm text-muted">
                  По запросу «{query}» ничего не найдено
                </div>
              ) : (
                <div className="p-1.5 space-y-2">
                  {/* СЕКЦИЯ: ДОРАМЫ */}
                  {results.dramas.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold text-muted flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5" /> Дорамы
                      </div>
                      {results.dramas.map((r, i) => (
                        <button
                          key={`drama-${r.id}`}
                          type="button"
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => goTo(`/dramas/${r.id}`)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${i === activeIndex ? "bg-accent/10" : "hover:bg-foreground/5"}`}
                        >
                          <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                            {r.posterUrl ? <img src={r.posterUrl} alt={r.title} className="w-full h-full object-cover" /> : <span className="text-muted">🎬</span>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{r.title}</p>
                            <p className="text-xs text-muted mt-0.5">{[r.year, r.country].filter(Boolean).join(" · ")}</p>
                          </div>
                          {r.rating != null && (
                            <div className="flex items-center gap-1 text-xs shrink-0">
                              <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                              <span className="font-semibold">{r.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* СЕКЦИЯ: АКТЕРЫ */}
                  {results.people.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold text-muted flex items-center gap-1.5 pt-2">
                        <User className="w-3.5 h-3.5" /> Актёры
                      </div>
                      {results.people.map((r, i) => {
                        const globalIdx = results.dramas.length + i;
                        return (
                          <button
                            key={`person-${r.id}`}
                            type="button"
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                            onClick={() => goTo(`/people/${r.id}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${globalIdx === activeIndex ? "bg-accent/10" : "hover:bg-foreground/5"}`}
                          >
                            <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center shrink-0 overflow-hidden">
                            {r.photoUrl ? (
                              <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-5 h-5 text-muted" />
                            )}
                          </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{r.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* СЕКЦИЯ: ПЕРСОНАЖИ */}
                  {results.characters.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold text-muted flex items-center gap-1.5 pt-2">
                        <UserCircle className="w-3.5 h-3.5" /> Персонажи
                      </div>
                      {results.characters.map((r, i) => {
                        const globalIdx = results.dramas.length + results.people.length + i;
                        return (
                          <button
                            key={`char-${r.id}`}
                            type="button"
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                            onClick={() => goTo(`/characters/${r.id}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${globalIdx === activeIndex ? "bg-accent/10" : "hover:bg-foreground/5"}`}
                          >
                            <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center shrink-0 overflow-hidden">
                              {r.imageUrl ? ( // ← Здесь imageUrl
                                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                              ) : (
                                <UserCircle className="w-5 h-5 text-muted" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{r.name}</p>
                              <p className="text-[10px] text-muted truncate">из дорамы «{r.drama.title}»</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Подвал */}
            {query.trim().length >= 2 && totalFound > 0 && (
              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>Найдено: <span className="text-accent">{totalFound}</span></span>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/dramas?q=${encodeURIComponent(query.trim())}`);
                    closeAndReset();
                  }}
                  className="text-accent hover:underline"
                >
                  Показать все в каталоге →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}