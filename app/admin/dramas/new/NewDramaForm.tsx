"use client";

import { useState, useTransition } from "react";
import { Save, Film, Sliders, Tv, Star, Image } from "lucide-react";
import { createDrama } from "../../actions";
import { FormSection } from "@/components/FormSection";
import Link from "next/link";

export function NewDramaForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createDrama(formData);
      if (result?.error) {
        setError(result.error);
        if (result.existingId && typeof result.existingId === "number") {
          setExistingId(result.existingId);
        }
      }
    });
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-medium text-muted mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 space-y-8"
    >
      {/* ─── ОСНОВНОЕ ─── */}
      <FormSection
        Icon={Film}
        title="Основное"
        description="Обязательный минимум — название"
      >
        <div>
          <label className={labelCls}>
            Название <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            autoFocus
            placeholder="Псих, но всё в порядке"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Год</label>
            <input
              type="number"
              name="year"
              placeholder="2020"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Страна</label>
            <input
              type="text"
              name="country"
              placeholder="Южная Корея"
              className={inputCls}
            />
          </div>
        </div>
      </FormSection>

      {/* ─── ПАРАМЕТРЫ ─── */}
      <FormSection
        Icon={Sliders}
        title="Параметры"
        description="Структура и длительность"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Серий</label>
            <input
              type="number"
              name="episodes"
              placeholder="16"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Сезонов</label>
            <input
              type="number"
              name="seasons"
              placeholder="1"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Мин / серия</label>
            <input
              type="number"
              name="episodeDuration"
              placeholder="70"
              className={inputCls}
            />
          </div>
        </div>
      </FormSection>

{/* ─── ВЕЩАНИЕ ─── */}
      <FormSection
        Icon={Tv}
        title="Вещание"
        description="Даты эфира и озвучка"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Дата начала эфира</label>
            <input type="date" name="airedFrom" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Дата конца эфира</label>
            <input type="date" name="airedTo" className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Статус выхода</label>
            <select name="airStatus" defaultValue="released" className={inputCls}>
              <option value="released">Вышла (Завершена)</option>
              <option value="ongoing">Выходит прямо сейчас</option>
              <option value="announced">Анонсирована</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Метка плача (до отзывов)</label>
            <select name="curatorCryTag" defaultValue="" className={inputCls}>
              <option value="">— не указана —</option>
              <option value="safe">❤️ Безопасно</option>
              <option value="bittersweet">❤️‍🩹 Слёзы счастья</option>
              <option value="sad">💔 Рыдай</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Студии озвучки</label>
          <input
            type="text"
            name="dubbingStudios"
            placeholder="Kinolibrary, SoftBox"
            className={inputCls}
          />
        </div>
      </FormSection>

      {/* ─── РЕЙТИНГИ ─── */}
      <FormSection
        Icon={Star}
        title="Внешние рейтинги"
        description="Оценки с других площадок"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Кинопоиск</label>
            <input type="text" inputMode="decimal" name="ratingKinopoisk" placeholder="8.4" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>MyDramaList</label>
            <input type="text" inputMode="decimal" name="ratingMDL" placeholder="9.2" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>IMDb</label>
            <input type="text" inputMode="decimal" name="ratingIMDB" placeholder="8.8" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Douban</label>
            <input type="text" inputMode="decimal" name="ratingDouban" placeholder="8.1" className={inputCls} />
          </div>
        </div>
      </FormSection>

      {/* ─── МЕДИА ─── */}
      <FormSection
        Icon={Image}
        title="Медиа и описание"
        description="Постер и синопсис"
      >
        <div>
          <label className={labelCls}>URL постера</label>
          <input type="url" name="posterUrl" placeholder="https://..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Синопсис</label>
          <textarea name="synopsis" rows={4} placeholder="О чём эта дорама..." className={`${inputCls} resize-y`} />
        </div>
      </FormSection>

        {error && (
        <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2 flex items-start justify-between gap-3">
          <span className="flex-1">{error}</span>
          {existingId && (
            <Link
              href={`/admin/dramas/${existingId}`}
              className="shrink-0 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors text-red-200 whitespace-nowrap"
            >
              Открыть её →
            </Link>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Создание..." : "Создать и перейти к редактированию"}
        </button>
      </div>
    </form>
  );
}