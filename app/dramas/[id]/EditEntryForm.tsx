"use client";

import { useState, useTransition } from "react";
import { X, Save } from "lucide-react";
import { updateEntry } from "./actions";
import type { CryTag } from "@/lib/cry-tags";

type EntryData = {
  status: string;
  rating: number | null;
  cryTag: string | null;
  impression: string | null;
  review: string | null;
  quote: string | null;
  notes: string | null;
  progress: number | null;
  rewatchCount: number;
  startedAt: Date | null;
  watchedAt: Date | null;
};

const CRY_OPTIONS: { value: CryTag; label: string }[] = [
  { value: "safe", label: "❤️ Безопасно" },
  { value: "bittersweet", label: "❤️‍🩹 Слёзы счастья" },
  { value: "sad", label: "💔 Рыдай" },
];

const STATUS_OPTIONS = [
  { value: "planned", label: "В планах" },
  { value: "watching", label: "Смотрю" },
  { value: "watched", label: "Просмотрено" },
  { value: "on_hold", label: "Отложено" },
  { value: "dropped", label: "Брошено" },
];

export function EditEntryForm({
  dramaId,
  entry,
  onClose,
}: {
  dramaId: number;
  entry: EntryData | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("dramaId", String(dramaId));

    startTransition(async () => {
      const result = await updateEntry(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  const formatDateForInput = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl mb-10"
      >
        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Редактировать запись</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Тело формы */}
        <div className="p-6 space-y-5">
          {/* Статус */}
          <div>
            <label className="block text-sm font-medium mb-2">Статус</label>
            <select
              name="status"
              defaultValue={entry?.status ?? "planned"}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Рейтинг + cryTag в ряд */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Рейтинг</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="10"
                defaultValue={entry?.rating ?? ""}
                placeholder="0–10"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Эмоция</label>
              <select
                name="cryTag"
                defaultValue={entry?.cryTag ?? ""}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              >
                <option value="">— не выбрано —</option>
                {CRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Впечатление */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Впечатление (короткое)
            </label>
            <input
              type="text"
              name="impression"
              defaultValue={entry?.impression ?? ""}
              placeholder="Пара слов: «Идеальная героиня»"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
            />
          </div>

          {/* Отзыв */}
          <div>
            <label className="block text-sm font-medium mb-2">Отзыв</label>
            <textarea
              name="review"
              defaultValue={entry?.review ?? ""}
              rows={6}
              placeholder="Полный отзыв..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors resize-y"
            />
          </div>

          {/* Цитата */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Цитата (для «Особого места»)
            </label>
            <textarea
              name="quote"
              defaultValue={entry?.quote ?? ""}
              rows={2}
              placeholder="Любимая фраза из дорамы"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors resize-y"
            />
          </div>

          {/* Прогресс + пересмотры */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Прогресс (серия)
              </label>
              <input
                type="number"
                name="progress"
                min="0"
                defaultValue={entry?.progress ?? ""}
                placeholder="на какой серии"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Пересмотров
              </label>
              <input
                type="number"
                name="rewatchCount"
                min="0"
                defaultValue={entry?.rewatchCount ?? 0}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Начал смотреть
              </label>
              <input
                type="date"
                name="startedAt"
                defaultValue={formatDateForInput(entry?.startedAt ?? null)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Досмотрел</label>
              <input
                type="date"
                name="watchedAt"
                defaultValue={formatDateForInput(entry?.watchedAt ?? null)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Личные заметки (приватные)
            </label>
            <textarea
              name="notes"
              defaultValue={entry?.notes ?? ""}
              rows={3}
              placeholder="Только для тебя"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Кнопки */}
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