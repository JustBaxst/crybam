"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Film, User, UserCircle, Loader2 } from "lucide-react";

type SearchResults = {
  dramas: { id: number; title: string; year: number | null }[];
  people: { id: number; name: string }[];
  characters: { id: number; name: string; imageUrl: string | null; drama: { title: string } }[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ dramas: [], people: [], characters: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Слушатель Ctrl+K, Escape и клика по кнопке
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Добавил проверку на e.code === "KeyK", так как e.key иногда сбоит с раскладками
      if (e.code === "KeyK" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") setOpen(false);
    };

    const handleOpenPalette = () => setOpen(true); // ← Слушаем кнопку

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleOpenPalette); // ← Вешаем слушатель

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleOpenPalette); // ← Снимаем
    };
  }, []);

  useEffect(() => {
    if (!open) {
      // Когда палитра закрывается — возвращаем фокус
      window.dispatchEvent(new Event("command-palette-closed"));
    }
  }, [open]);

  // Дебаунс поиска
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults({ dramas: [], people: [], characters: [] });
      return;
    }

    if (query.length < 2) {
      setResults({ dramas: [], people: [], characters: [] });
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (

    <div onClick={() => setOpen(false)} className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div
        className="w-full max-w-xl mx-4 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} className="flex flex-col">
          {/* Поле ввода */}
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Быстрый поиск (дорамы, актеры, персонажи)..."
              className="flex-1 px-3 py-4 bg-transparent outline-none text-base placeholder:text-muted"
              autoFocus
            />
            {loading && <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0" />}
            <kbd className="hidden md:inline-block text-[10px] text-muted px-1.5 py-0.5 rounded border border-border ml-2">
              ESC
            </kbd>
          </div>

          {/* Результаты */}
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted">
              {query.length < 2 ? "Введите хотя бы 2 символа..." : "Ничего не найдено."}
            </Command.Empty>

            {results.dramas.length > 0 && (
              <Command.Group heading="Дорамы" className="px-2 py-1.5 text-xs font-medium text-muted">
                {results.dramas.map((d) => (
                  <Command.Item
                    key={`drama-${d.id}`}
                    onSelect={() => handleSelect(`/admin/dramas/${d.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent"
                  >
                    <Film className="w-4 h-4 text-muted" />
                    <span className="flex-1 truncate">{d.title}</span>
                    <span className="text-xs text-muted">{d.year}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results.people.length > 0 && (
              <Command.Group heading="Актёры" className="px-2 py-1.5 text-xs font-medium text-muted">
                {results.people.map((p) => (
                  <Command.Item
                    key={`person-${p.id}`}
                    onSelect={() => handleSelect(`/admin/people/${p.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent"
                  >
                    <User className="w-4 h-4 text-muted" />
                    <span className="flex-1 truncate">{p.name}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results.characters.length > 0 && (
              <Command.Group heading="Персонажи" className="px-2 py-1.5 text-xs font-medium text-muted">
                {results.characters.map((c) => (
                  <Command.Item
                    key={`char-${c.id}`}
                    onSelect={() => handleSelect(`/admin/characters/${c.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent"
                  >
                    <div className="w-8 h-10 rounded bg-accent-soft/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}