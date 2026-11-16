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
  Sparkles,
} from "lucide-react";
import { updateDrama } from "./actions";
import { FormSection } from "@/components/FormSection";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { COUNTRIES } from "@/lib/constants";
import { toast } from "sonner";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
} from "@/components/ui/form-elements";

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
  dubbingStudios: string | null;
  platforms: string[];
  studios: string[];
  themes: string[];
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
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateDrama(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        if (result.isJustCompleted) {
          toast.success(`Глава завершена: ${drama.title}`, {
            icon: <Sparkles className="w-4 h-4" />,
          });
        }
        onClose();
      }
    });
  };

  const toDateInput = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

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
            <p className="text-xs text-muted mt-0.5">{drama.title}</p>
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

        {/* Тело формы */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* ─── ОСНОВНОЕ ─── */}
          <FormSection
            Icon={Film}
            title="Основное"
            description="Название и главная информация"
          >
            <FormField label="Название" required>
              <FormInput
                type="text"
                name="title"
                defaultValue={drama.title}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Год">
                <FormInput
                  type="number"
                  name="year"
                  defaultValue={drama.year ?? ""}
                  placeholder="2020"
                />
              </FormField>
              <FormField label="Страна">
                <FormSelect name="country" defaultValue={drama.country ?? ""}>
                  <option value="">— не выбрана —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          {/* ─── ПАРАМЕТРЫ ─── */}
          <FormSection
            Icon={Sliders}
            title="Параметры"
            description="Структура и длительность"
          >
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Серий">
                <FormInput
                  type="number"
                  name="episodes"
                  defaultValue={drama.episodes ?? ""}
                  placeholder="16"
                />
              </FormField>
              <FormField label="Сезонов">
                <FormInput
                  type="number"
                  name="seasons"
                  defaultValue={drama.seasons ?? ""}
                  placeholder="1"
                />
              </FormField>
              <FormField label="Мин / серия">
                <FormInput
                  type="number"
                  name="episodeDuration"
                  defaultValue={drama.episodeDuration ?? ""}
                  placeholder="70"
                />
              </FormField>
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
                <FormField label="Статус выхода">
                  <FormSelect
                    name="airStatus"
                    defaultValue={drama.airStatus || "released"}
                  >
                    <option value="released">Вышла (Завершена)</option>
                    <option value="ongoing">Выходит прямо сейчас</option>
                    <option value="announced">Анонсирована</option>
                  </FormSelect>
                </FormField>
                <FormField label="Метка плача">
                  <FormSelect
                    name="curatorCryTag"
                    defaultValue={drama.curatorCryTag || ""}
                  >
                    <option value="">— не указана —</option>
                    <option value="safe">Безопасно</option>
                    <option value="bittersweet">Слёзы счастья</option>
                    <option value="sad">Рыдай</option>
                  </FormSelect>
                </FormField>
              </div>
              <FormField label="Дата начала эфира">
                <FormInput
                  type="date"
                  name="airedFrom"
                  defaultValue={toDateInput(drama.airedFrom)}
                />
              </FormField>
              <FormField label="Дата конца эфира">
                <FormInput
                  type="date"
                  name="airedTo"
                  defaultValue={toDateInput(drama.airedTo)}
                />
              </FormField>
            </div>

            <FormField label="Студии озвучки" description="Через запятую">
              <FormInput
                type="text"
                name="dubbingStudios"
                defaultValue={drama.dubbingStudios ?? ""}
                placeholder="Kinolibrary, AniLibria, SoftBox"
              />
            </FormField>

            <FormField label="Платформы (через запятую)">
              <FormInput
                type="text"
                name="platforms"
                defaultValue={drama.platforms.join(", ")}
                placeholder="Netflix, Viki, Кинопоиск"
              />
            </FormField>

            <FormField label="Производство (через запятую)">
              <FormInput
                type="text"
                name="studios"
                defaultValue={drama.studios.join(", ")}
                placeholder="tvN, JTBC, Studio Dragon"
              />
            </FormField>
          </FormSection>

          {/* ─── РЕЙТИНГИ ─── */}
          <FormSection
            Icon={Star}
            title="Внешние рейтинги"
            description="Оценки с других площадок"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Кинопоиск">
                <FormInput
                  type="text"
                  inputMode="decimal"
                  name="ratingKinopoisk"
                  defaultValue={drama.ratingKinopoisk ?? ""}
                  placeholder="8.4"
                />
              </FormField>
              <FormField label="MyDramaList">
                <FormInput
                  type="text"
                  inputMode="decimal"
                  name="ratingMDL"
                  defaultValue={drama.ratingMDL ?? ""}
                  placeholder="9.2"
                />
              </FormField>
              <FormField label="IMDb">
                <FormInput
                  type="text"
                  inputMode="decimal"
                  name="ratingIMDB"
                  defaultValue={drama.ratingIMDB ?? ""}
                  placeholder="8.8"
                />
              </FormField>
            </div>
          </FormSection>

          {/* ─── МЕДИА ─── */}
          <FormSection
            Icon={Image}
            title="Медиа и описание"
            description="Постер и краткое описание сюжета"
          >
            <FormField label="URL постера">
              <FormInput
                type="url"
                name="posterUrl"
                defaultValue={drama.posterUrl ?? ""}
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Синопсис">
              <FormTextarea
                name="synopsis"
                defaultValue={drama.synopsis ?? ""}
                rows={5}
                placeholder="О чём эта дорама..."
              />
            </FormField>
          </FormSection>

          <FormError error={error} />
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
