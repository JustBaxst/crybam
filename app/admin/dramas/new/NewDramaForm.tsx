"use client";

import { useState, useTransition } from "react";
import { Save, Film, Sliders, Tv, Star, Image, Download } from "lucide-react";
import { createDrama } from "../../actions";
import { FormSection } from "@/components/FormSection";
import { COUNTRIES } from "@/lib/constants";
import { TvmazeImportModal } from "@/components/admin/TvmazeImportModal";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
} from "@/components/ui/form-elements";

type ImportedData = {
  title?: string;
  year?: number;
  country?: string;
  posterUrl?: string;
  synopsis?: string;
  episodes?: number;
  seasons?: number;
  episodeDuration?: number;
  airStatus?: string;
};

export function NewDramaForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState<ImportedData | null>(null);
  const [formKey, setFormKey] = useState(0);

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

  const handleImportSelect = (data: any) => {
    setImportData(data);
    setFormKey((prev) => prev + 1);
    setShowImport(false);
  };

  return (
    <>
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6 space-y-8"
      >
        {/* ─── ОСНОВНОЕ ─── */}
        <FormSection
          Icon={Film}
          title="Основное"
          description="Обязательный минимум — название"
        >
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowImport(true)}
              className="w-full gap-2 border-dashed border-accent/40 text-accent hover:bg-accent/5"
            >
              <Download className="w-4 h-4" />
              Импортировать данные из TVmaze
            </Button>
          </div>

          <FormField label="Название" required>
            <FormInput
              type="text"
              name="title"
              required
              autoFocus
              placeholder="Псих, но всё в порядке"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Год">
              <FormInput
                type="number"
                name="year"
                defaultValue={importData?.year ?? ""}
                placeholder="2020"
              />
            </FormField>
            <FormField label="Страна">
              <FormSelect
                name="country"
                defaultValue={importData?.country ?? ""}
              >
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
                defaultValue={importData?.episodes ?? ""}
                placeholder="16"
              />
            </FormField>
            <FormField label="Сезонов">
              <FormInput
                type="number"
                name="seasons"
                defaultValue={importData?.seasons ?? ""}
                placeholder="1"
              />
            </FormField>
            <FormField label="Мин / серия">
              <FormInput
                type="number"
                name="episodeDuration"
                defaultValue={importData?.episodeDuration ?? ""}
                placeholder="70"
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── ВЕЩАНИЕ ─── */}
        <FormSection
          Icon={Tv}
          title="Вещание"
          description="Даты эфира и озвучка"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Дата начала эфира">
              <FormInput type="date" name="airedFrom" />
            </FormField>
            <FormField label="Дата конца эфира">
              <FormInput type="date" name="airedTo" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Статус выхода">
              <FormSelect
                name="airStatus"
                defaultValue={importData?.airStatus ?? "released"}
              >
                <option value="released">Вышла (Завершена)</option>
                <option value="ongoing">Выходит прямо сейчас</option>
                <option value="announced">Анонсирована</option>
              </FormSelect>
            </FormField>
            <FormField label="Метка плача (до отзывов)">
              <FormSelect name="curatorCryTag" defaultValue="">
                <option value="">— не указана —</option>
                <option value="safe">Безопасно</option>
                <option value="bittersweet">Слёзы счастья</option>
                <option value="sad">Рыдай</option>
              </FormSelect>
            </FormField>
          </div>
          <FormField label="Студии озвучки">
            <FormInput
              type="text"
              name="dubbingStudios"
              placeholder="Kinolibrary, SoftBox"
            />
          </FormField>
          <FormField label="Платформы (через запятую)">
            <FormInput
              type="text"
              name="platforms"
              placeholder="Netflix, Viki, Кинопоиск"
            />
          </FormField>
          <FormField label="Производство (через запятую)">
            <FormInput
              type="text"
              name="studios"
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
                placeholder="8.4"
              />
            </FormField>
            <FormField label="MyDramaList">
              <FormInput
                type="text"
                inputMode="decimal"
                name="ratingMDL"
                placeholder="9.2"
              />
            </FormField>
            <FormField label="IMDb">
              <FormInput
                type="text"
                inputMode="decimal"
                name="ratingIMDB"
                placeholder="8.8"
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── МЕДИА ─── */}
        <FormSection
          Icon={Image}
          title="Медиа и описание"
          description="Постер и синопсис"
        >
          <FormField label="URL постера">
            <FormInput
              type="url"
              name="posterUrl"
              defaultValue={importData?.posterUrl ?? ""}
              placeholder="https://..."
            />
          </FormField>
          <FormField label="Синопсис">
            <FormTextarea
              name="synopsis"
              rows={4}
              placeholder="О чём эта дорама..."
            />
          </FormField>
        </FormSection>

        <FormError
          error={error}
          existingId={existingId}
          href={`/admin/dramas/${existingId}`}
        />

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

      {showImport && (
        <TvmazeImportModal
          onCloseAction={() => setShowImport(false)}
          onSelectAction={handleImportSelect}
        />
      )}
    </>
  );
}
