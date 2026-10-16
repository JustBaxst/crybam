"use client";

import { useState, useTransition } from "react";
import { X, Save } from "lucide-react";
import { updateDrama } from "./actions";

type DramaData = {
  title: string;
  year: number | null;
  country: string | null;
  episodes: number | null;
  seasons: number | null;
  episodeDuration: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  airedFrom: Date | null;
  airedTo: Date | null;
  ratingKinopoisk: number | null;
  ratingMDL: number | null;
  ratingIMDB: number | null;
  ratingDouban: number | null;
  dubbingStudios: string | null;
};

export function EditDramaForm({
  dramaId,
  drama,
  onClose,
}: {
  dramaId: number;
  drama: DramaData;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateDrama(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  const toDateInput = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors";
  const labelCls = "block text-sm font-medium mb-2";

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl mb-10"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Редактировать дораму</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input type="hidden" name="dramaId" value={dramaId} />
        {/* ↑ ниже заменим через hiddenField */}

        <div className="p-6 space-y-5">
          {/* Название */}
          <div>
            <label className={labelCls}>Название (главное)</label>
            <input
              type="text"
              name="title"
              defaultValue={drama.title}
              required
              className={inputCls}
            />
          </div>

          {/* Год + страна + серии + сезоны */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Год</label>
              <input
                type="number"
                name="year"
                defaultValue={drama.year ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Страна</label>
              <input
                type="text"
                name="country"
                defaultValue={drama.country ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Серий</label>
              <input
                type="number"
                name="episodes"
                defaultValue={drama.episodes ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Сезонов</label>
              <input
                type="number"
                name="seasons"
                defaultValue={drama.seasons ?? ""}
                className={inputCls}
              />
            </div>
          </div>

          {/* Длительность */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Длительность серии (мин)</label>
              <input
                type="number"
                name="episodeDuration"
                defaultValue={drama.episodeDuration ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Студии озвучки</label>
              <input
                type="text"
                name="dubbingStudios"
                defaultValue={drama.dubbingStudios ?? ""}
                placeholder="Kinolibrary, AniLibria"
                className={inputCls}
              />
            </div>
          </div>

          {/* Даты выхода */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Дата начала эфира</label>
              <input
                type="date"
                name="airedFrom"
                defaultValue={toDateInput(drama.airedFrom)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Дата конца эфира</label>
              <input
                type="date"
                name="airedTo"
                defaultValue={toDateInput(drama.airedTo)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Внешние рейтинги */}
          <div>
            <label className={labelCls}>Оценки на площадках</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                inputMode="decimal"
                name="ratingKinopoisk"
                defaultValue={drama.ratingKinopoisk ?? ""}
                placeholder="Кинопоиск"
                className={inputCls}
              />
              <input
                type="text"
                inputMode="decimal"
                name="ratingMDL"
                defaultValue={drama.ratingMDL ?? ""}
                placeholder="MDL"
                className={inputCls}
              />
              <input
                type="text"
                inputMode="decimal"
                name="ratingIMDB"
                defaultValue={drama.ratingIMDB ?? ""}
                placeholder="IMDb"
                className={inputCls}
              />
              <input
                type="text"
                inputMode="decimal"
                name="ratingDouban"
                defaultValue={drama.ratingDouban ?? ""}
                placeholder="Douban"
                className={inputCls}
              />
            </div>
          </div>

          {/* Постер */}
          <div>
            <label className={labelCls}>URL постера</label>
            <input
              type="url"
              name="posterUrl"
              defaultValue={drama.posterUrl ?? ""}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          {/* Синопсис */}
          <div>
            <label className={labelCls}>Синопсис</label>
            <textarea
              name="synopsis"
              defaultValue={drama.synopsis ?? ""}
              rows={4}
              className={`${inputCls} resize-y`}
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