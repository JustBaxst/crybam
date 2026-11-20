"use client";

import { useState, useTransition } from "react";
import {
  Save,
  Film,
  Sliders,
  Tv,
  Star,
  Image,
  Download,
  Pencil,
} from "lucide-react";
import { FormSection } from "@/components/FormSection";
import { COUNTRIES } from "@/lib/constants";
import { TvmazeImportModal } from "@/components/admin/TvmazeImportModal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  FormError,
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/ui/form-elements";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

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
  airStatus: string;
  curatorCryTag: string | null;
};

export function DramaForm({
  dramaId,
  initialData,
  action,
  onCloseAction,
}: {
  dramaId?: number;
  initialData?: DramaData;
  action: (formData: FormData) => Promise<any>;
  onCloseAction?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Стейты для кастомных селектов
  const [country, setCountry] = useState(initialData?.country ?? "");
  const [airStatus, setAirStatus] = useState(
    initialData?.airStatus ?? "released",
  );
  const [curatorCryTag, setCuratorCryTag] = useState(
    initialData?.curatorCryTag ?? "",
  );

  // Импорт TVmaze
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [formKey, setFormKey] = useState(0);

  const isEdit = !!dramaId;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);

    const formData = new FormData(e.currentTarget);
    if (dramaId) formData.set("dramaId", String(dramaId));

    formData.set("country", country);
    formData.set("airStatus", airStatus);
    formData.set("curatorCryTag", curatorCryTag);

    // Клиентская валидация
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return setError("Название обязательно");

    const yearRaw = String(formData.get("year") ?? "").trim();
    if (!yearRaw) return setError("Год обязателен для заполнения");
    const year = Number(yearRaw);
    if (year < 1900 || year > 2100)
      return setError("Год должен быть от 1900 до 2100");

    const countryVal = String(formData.get("country") ?? "").trim();
    if (!countryVal) return setError("Выберите страну");

    const ratingFields = ["ratingKinopoisk", "ratingMDL", "ratingIMDB"];
    for (const field of ratingFields) {
      const val = String(formData.get(field) ?? "").trim();
      if (
        val &&
        (Number(val.replace(",", ".")) < 0 ||
          Number(val.replace(",", ".")) > 10)
      ) {
        return setError("Рейтинг должен быть от 0 до 10");
      }
    }

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        if (result.existingId) setExistingId(result.existingId);
      } else {
        if (onCloseAction) onCloseAction();
        else
          window.location.href = `/admin/dramas/${result.dramaId || dramaId}`; // Редирект после создания
      }
    });
  };

  const handleImportSelect = (data: any) => {
    setImportData(data);
    setFormKey((prev) => prev + 1);
    setShowImport(false);
    setIsDirty(true);
  };

  const toDateInput = (d: Date | null | undefined) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  const formContent = (
    <form
      id="drama-form"
      key={formKey}
      onSubmit={handleSubmit}
      onChange={() => setIsDirty(true)}
      className="space-y-8"
    >
      {/* ─── ОСНОВНОЕ ─── */}
      <FormSection
        Icon={Film}
        title="Основное"
        description="Обязательный минимум — название"
      >
        {!isEdit && (
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
        )}

        <FormField label="Название" required>
          <FormInput
            type="text"
            name="title"
            autoFocus={!isEdit}
            defaultValue={initialData?.title || importData?.title || ""}
            placeholder="Псих, но всё в порядке"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Год" required>
            <FormInput
              type="number"
              name="year"
              min="1900"
              max="2100"
              defaultValue={initialData?.year || importData?.year || ""}
              placeholder="2020"
            />
          </FormField>
          <FormField label="Страна" required>
            <Select
              value={country}
              onChangeAction={(val) => {
                setCountry(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— не выбрана —" },
                ...COUNTRIES.map((c) => ({ value: c, label: c })),
              ]}
            />
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
              min="1"
              name="episodes"
              defaultValue={initialData?.episodes || importData?.episodes || ""}
              placeholder="16"
            />
          </FormField>
          <FormField label="Сезонов">
            <FormInput
              type="number"
              min="1"
              name="seasons"
              defaultValue={initialData?.seasons || importData?.seasons || ""}
              placeholder="1"
            />
          </FormField>
          <FormField label="Мин / серия">
            <FormInput
              type="number"
              min="1"
              name="episodeDuration"
              defaultValue={
                initialData?.episodeDuration ||
                importData?.episodeDuration ||
                ""
              }
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
              <Select
                value={airStatus}
                onChangeAction={(val) => {
                  setAirStatus(val);
                  setIsDirty(true);
                }}
                options={[
                  { value: "released", label: "Вышла (Завершена)" },
                  { value: "ongoing", label: "Выходит прямо сейчас" },
                  { value: "announced", label: "Анонсирована" },
                ]}
              />
            </FormField>
            <FormField label="Метка плача">
              <Select
                value={curatorCryTag}
                onChangeAction={(val) => {
                  setCuratorCryTag(val);
                  setIsDirty(true);
                }}
                options={[
                  { value: "", label: "— не указана —" },
                  ...(Object.keys(CRY_TAGS) as CryTag[]).map((key) => ({
                    value: key,
                    label: CRY_TAGS[key].label,
                  })),
                ]}
              />
            </FormField>
          </div>
          <FormField label="Дата начала эфира">
            <FormInput
              type="date"
              name="airedFrom"
              defaultValue={toDateInput(initialData?.airedFrom)}
            />
          </FormField>
          <FormField label="Дата конца эфира">
            <FormInput
              type="date"
              name="airedTo"
              defaultValue={toDateInput(initialData?.airedTo)}
            />
          </FormField>
        </div>

        <FormField label="Студии озвучки" description="Через запятую">
          <FormInput
            type="text"
            name="dubbingStudios"
            defaultValue={initialData?.dubbingStudios || ""}
            placeholder="Kinolibrary, AniLibria"
          />
        </FormField>
        <FormField label="Платформы" description="Через запятую">
          <FormInput
            type="text"
            name="platforms"
            defaultValue={initialData?.platforms?.join(", ") || ""}
            placeholder="Netflix, Viki"
          />
        </FormField>
        <FormField label="Производство" description="Через запятую">
          <FormInput
            type="text"
            name="studios"
            defaultValue={initialData?.studios?.join(", ") || ""}
            placeholder="tvN, JTBC"
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
              defaultValue={initialData?.ratingKinopoisk ?? ""}
              placeholder="8.4"
            />
          </FormField>
          <FormField label="MyDramaList">
            <FormInput
              type="text"
              inputMode="decimal"
              name="ratingMDL"
              defaultValue={initialData?.ratingMDL ?? ""}
              placeholder="9.2"
            />
          </FormField>
          <FormField label="IMDb">
            <FormInput
              type="text"
              inputMode="decimal"
              name="ratingIMDB"
              defaultValue={initialData?.ratingIMDB ?? ""}
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
            defaultValue={initialData?.posterUrl || importData?.posterUrl || ""}
            placeholder="https://..."
          />
        </FormField>
        <FormField label="Синопсис">
          <FormTextarea
            name="synopsis"
            defaultValue={initialData?.synopsis || ""}
            rows={5}
            placeholder="О чём эта дорама..."
          />
        </FormField>
      </FormSection>

      <FormError
        error={error}
        existingId={existingId}
        href={existingId ? `/admin/dramas/${existingId}` : undefined}
      />
    </form>
  );

  const footerButtons = (close?: () => void) => (
    <>
      {onCloseAction && (
        <Button
          type="button"
          variant="outline"
          onClick={close || onCloseAction}
          disabled={isPending}
        >
          Отмена
        </Button>
      )}
      <Button type="submit" form="drama-form" disabled={isPending}>
        <Save className="w-4 h-4 mr-2" />
        {isPending
          ? "Сохранение..."
          : isEdit
            ? "Сохранить"
            : "Создать и перейти"}
      </Button>
    </>
  );

  return (
    <>
      {isEdit ? (
        <Modal
          isOpen={true}
          onCloseAction={onCloseAction!}
          title="Редактировать дораму"
          icon={<Pencil className="w-5 h-5" />}
          isDirty={isDirty}
          isPending={isPending}
          maxWidth="max-w-3xl"
          footer={(close) => footerButtons(close)}
        >
          {formContent}
        </Modal>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6">
          {formContent}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
            {footerButtons()}
          </div>
        </div>
      )}

      {showImport && (
        <TvmazeImportModal
          onCloseAction={() => setShowImport(false)}
          onSelectAction={handleImportSelect}
        />
      )}
    </>
  );
}
