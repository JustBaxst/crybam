"use client";

import { useState, useTransition } from "react";
import {
  X,
  Save,
  Film,
  Tv,
  Star,
  Image,
  Sliders,
} from "lucide-react";
import { updateDrama } from "./actions";
import { FormSection } from "@/components/FormSection";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { COUNTRIES } from "@/lib/constants";

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
  platforms: string[];
  studios: string[];
  airStatus: string;
  curatorCryTag: string | null;
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

  useLockBodyScroll();

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
            <h2 className="text-lg font-semibold">Редактировать дораму</h2>
            <p className="text-xs text-muted mt-0.5">
              {drama.title}
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

        <input type="hidden" name="dramaId" value={dramaId} />

        {/* Тело формы — скроллится только оно */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* ─── ОСНОВНОЕ ─── */}
          <FormSection
            Icon={Film}
            title="Основное"
            description="Название и главная информация"
          >
            <div>
              <label className={labelCls}>
                Название <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={drama.title}
                required
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Год</label>
                <input
                  type="number"
                  name="year"
                  defaultValue={drama.year ?? ""}
                  placeholder="2020"
                  className={inputCls}
                />
              </div>
                            <div>
                <label className={labelCls}>Страна</label>
                <select
                  name="country"
                  defaultValue={drama.country ?? ""}
                  className={inputCls}
                >
                  <option value="">— не выбрана —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
                  defaultValue={drama.episodes ?? ""}
                  placeholder="16"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Сезонов</label>
                <input
                  type="number"
                  name="seasons"
                  defaultValue={drama.seasons ?? ""}
                  placeholder="1"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Мин / серия</label>
                <input
                  type="number"
                  name="episodeDuration"
                  defaultValue={drama.episodeDuration ?? ""}
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
            description="Даты эфира, озвучка и платформы"
          >
            <div className="grid grid-cols-2 gap-4">

              <div className="grid grid-cols-2 gap-4">
  <div>
    <label className={labelCls}>Статус выхода</label>
    <select name="airStatus" defaultValue={drama.airStatus || "released"} className={inputCls}>
      <option value="released">Вышла (Завершена)</option>
      <option value="ongoing">Выходит прямо сейчас</option>
      <option value="announced">Анонсирована</option>
    </select>
  </div>
  <div>
    <label className={labelCls}>Метка плача (до отзывов)</label>
    <select name="curatorCryTag" defaultValue={drama.curatorCryTag || ""} className={inputCls}>
      <option value="">— не указана —</option>
      <option value="safe">❤️ Безопасно</option>
      <option value="bittersweet">❤️‍🩹 Слёзы счастья</option>
      <option value="sad">💔 Рыдай</option>
    </select>
  </div>
</div>
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

            <div>
              <label className={labelCls}>Студии озвучки</label>
              <input
                type="text"
                name="dubbingStudios"
                defaultValue={drama.dubbingStudios ?? ""}
                placeholder="Kinolibrary, AniLibria, SoftBox"
                className={inputCls}
              />
              <p className="text-[11px] text-muted/70 mt-1.5">
                Через запятую
              </p>
            </div>

            <div>                                                           
          <label className={labelCls}>Платформы (через запятую)</label> 
          <input                                                      
            type="text"                                               
            name="platforms"                                          
            defaultValue={drama.platforms.join(", ")}                 
            placeholder="Netflix, Viki, Кинопоиск"                    
            className={inputCls}                                      
          />                                                          
        </div>                                                        

        <div>                                                           
          <label className={labelCls}>Производство (через запятую)</label> 
          <input                                                      
            type="text"                                               
            name="studios"                                            
            defaultValue={drama.studios.join(", ")}                   
            placeholder="tvN, JTBC, Studio Dragon"                    
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
                <input
                  type="text"
                  inputMode="decimal"
                  name="ratingKinopoisk"
                  defaultValue={drama.ratingKinopoisk ?? ""}
                  placeholder="8.4"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>MyDramaList</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="ratingMDL"
                  defaultValue={drama.ratingMDL ?? ""}
                  placeholder="9.2"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>IMDb</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="ratingIMDB"
                  defaultValue={drama.ratingIMDB ?? ""}
                  placeholder="8.8"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Douban</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="ratingDouban"
                  defaultValue={drama.ratingDouban ?? ""}
                  placeholder="8.1"
                  className={inputCls}
                />
              </div>
            </div>
          </FormSection>

          {/* ─── МЕДИА ─── */}
          <FormSection
            Icon={Image}
            title="Медиа и описание"
            description="Постер и краткое описание сюжета"
          >
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

            <div>
              <label className={labelCls}>Синопсис</label>
              <textarea
                name="synopsis"
                defaultValue={drama.synopsis ?? ""}
                rows={5}
                placeholder="О чём эта дорама..."
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