"use client";

import { useState, useTransition } from "react";
import {
  X,
  Save,
  Star,
  MessageCircle,
  Calendar,
  Lock,
} from "lucide-react";
import { updateEntry } from "./actions";
import { FormSection } from "@/components/FormSection";
import type { CryTag } from "@/lib/cry-tags";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

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
  isFavorite: boolean;
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

  useLockBodyScroll();

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

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-medium text-muted mb-1.5";

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Шапка модалки */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold">
              {entry ? "Редактировать запись" : "Добавить в дневник"}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Твои личные данные о дораме
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Тело формы — скроллится только оно */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* ─── СТАТУС И ОЦЕНКА ─── */}
          <FormSection
            Icon={Star}
            title="Статус и оценка"
            description="Что это для тебя сейчас"
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Статус</label>
                <select
                  name="status"
                  defaultValue={entry?.status ?? "planned"}
                  className={inputCls}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Рейтинг (1–10)</label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="10"
                  defaultValue={entry?.rating ?? ""}
                  placeholder="8.5"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Эмоция</label>
                <select
                  name="cryTag"
                  defaultValue={entry?.cryTag ?? ""}
                  className={inputCls}
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
          </FormSection>

          {/* ─── ВПЕЧАТЛЕНИЯ ─── */}
          <FormSection
            Icon={MessageCircle}
            title="Впечатления"
            description="Что осталось в памяти"
          >
            <div>
              <label className={labelCls}>Впечатление (короткое)</label>
              <input
                type="text"
                name="impression"
                defaultValue={entry?.impression ?? ""}
                placeholder="Пара слов: «Идеальная героиня»"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Отзыв</label>
              <textarea
                name="review"
                defaultValue={entry?.review ?? ""}
                rows={6}
                placeholder="Полный отзыв..."
                className={`${inputCls} resize-y`}
              />
            </div>

            <div>
              <label className={labelCls}>
                Цитата для «Особого места»
              </label>
              <textarea
                name="quote"
                defaultValue={entry?.quote ?? ""}
                rows={2}
                placeholder="Любимая фраза из дорамы"
                className={`${inputCls} resize-y`}
              />
            </div>
          </FormSection>

          {/* ─── ДАТЫ И ПЕРЕСМОТРЫ ─── */}
          <FormSection
            Icon={Calendar}
            title="Даты и прогресс"
            description="Когда смотрел и сколько раз"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Начал смотреть</label>
                <input
                  type="date"
                  name="startedAt"
                  defaultValue={formatDateForInput(entry?.startedAt ?? null)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Досмотрел</label>
                <input
                  type="date"
                  name="watchedAt"
                  defaultValue={formatDateForInput(entry?.watchedAt ?? null)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Прогресс (серия)</label>
                <input
                  type="number"
                  name="progress"
                  min="0"
                  defaultValue={entry?.progress ?? ""}
                  placeholder="на какой серии остановился"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Пересмотров</label>
                <input
                  type="number"
                  name="rewatchCount"
                  min="0"
                  defaultValue={entry?.rewatchCount ?? 0}
                  className={inputCls}
                />
              </div>
            </div>
          </FormSection>

          {/* ─── ПРИВАТНОЕ ─── */}
          <FormSection
            Icon={Lock}
            title="Личные заметки"
            description="Видно только тебе"
          >
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-accent/40 transition-colors mb-2">
              <input
                type="checkbox"
                name="isFavorite"
                defaultChecked={entry?.isFavorite ?? false}
                className="w-4 h-4 accent-accent"
              />
              <div>
                <p className="text-sm font-medium">Добавить в «Особое место»</p>
                <p className="text-xs text-muted">Дорама появится в твоем «Зале славы»</p>
              </div>
            </label>
            <div>
              <label className={labelCls}>Заметки</label>
              <textarea
                name="notes"
                defaultValue={entry?.notes ?? ""}
                rows={3}
                placeholder="Только для тебя"
                className={`${inputCls} resize-y`}
              />
            </div>
          </FormSection>

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Футер модалки */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
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