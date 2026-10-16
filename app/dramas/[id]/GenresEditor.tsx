"use client";

import { useState, useTransition } from "react";
import { X, Save } from "lucide-react";
import { updateGenres } from "./actions";

export function GenresEditor({
  dramaId,
  allGenres,
  linkedGenreIds,
  onClose,
}: {
  dramaId: number;
  allGenres: { id: number; name: string }[];
  linkedGenreIds: number[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(
    new Set(linkedGenreIds)
  );

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("dramaId", String(dramaId));

    startTransition(async () => {
      const result = await updateGenres(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-15vh px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Жанры</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {allGenres.length === 0 ? (
            <p className="text-sm text-muted">
              Жанров в базе пока нет — добавь первый ниже.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allGenres.map((g) => {
                const isOn = selected.has(g.id);
                return (
                  <label
                    key={g.id}
                    className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-colors ${
                      isOn
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-border text-muted hover:border-accent/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`genre_${g.id}`}
                      checked={isOn}
                      onChange={() => toggle(g.id)}
                      className="sr-only"
                    />
                    {g.name}
                  </label>
                );
              })}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Добавить новые (через запятую)
            </label>
            <input
              type="text"
              name="newGenres"
              placeholder="Романтика, Комедия, Фэнтези"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:border-accent/40 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}