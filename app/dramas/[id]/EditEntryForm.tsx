"use client";

import { useState, useTransition } from "react";
import {
  Save,
  Star,
  MessageCircle,
  Calendar,
  Lock,
  Pencil,
  AlertCircle,
} from "lucide-react";
import { updateEntry } from "./actions";
import { FormSection } from "@/components/FormSection";
import type { EntryData } from "@/lib/types";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";
import { DRAMA_STATUSES, type DramaStatus } from "@/lib/drama-status";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  FormError,
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/ui/form-elements";

export function EditEntryForm({
  dramaId,
  entry,
  onCloseAction,
}: {
  dramaId: number;
  entry: EntryData | null;
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Стейты для кастомных селектов
  const [status, setStatus] = useState<string>(entry?.status ?? "planned");
  const [cryTag, setCryTag] = useState<string>(entry?.cryTag ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("dramaId", String(dramaId));

    // Синхронизируем значения селектов
    formData.set("status", status);
    formData.set("cryTag", cryTag);

    // Клиентская валидация
    const ratingRaw = String(formData.get("rating") ?? "").trim();
    if (ratingRaw) {
      const rating = Number(ratingRaw);
      if (rating < 0 || rating > 10) {
        setError("Рейтинг должен быть от 0 до 10");
        return;
      }
    }

    const progressRaw = String(formData.get("progress") ?? "").trim();
    if (progressRaw && Number(progressRaw) < 0) {
      setError("Прогресс не может быть отрицательным");
      return;
    }

    startTransition(async () => {
      const result = await updateEntry(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onCloseAction();
      }
    });
  };

  const formatDateForInput = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  return (
    <Modal
      isOpen={true}
      onCloseAction={onCloseAction}
      title={entry ? "Редактировать запись" : "Добавить в дневник"}
      icon={<Pencil className="w-5 h-5" />}
      isDirty={isDirty}
      isPending={isPending}
      maxWidth="max-w-3xl"
      footer={(close) => (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isPending}
          >
            Отмена
          </Button>
          {/* Кнопка привязана к форме через form="entry-form" */}
          <Button type="submit" form="entry-form" disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </>
      )}
    >
      <form
        id="entry-form"
        onSubmit={handleSubmit}
        onChange={() => setIsDirty(true)}
        className="space-y-8"
      >
        {/* ─── СТАТУС И ОЦЕНКА ─── */}
        <FormSection
          Icon={Star}
          title="Статус и оценка"
          description="Что это для тебя сейчас"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Статус">
              <Select
                value={status}
                onChangeAction={(val) => {
                  setStatus(val);
                  setIsDirty(true);
                }}
                options={Object.entries(DRAMA_STATUSES).map(
                  ([value, config]) => ({
                    value,
                    label: config.label,
                  }),
                )}
              />
            </FormField>
            <FormField label="Рейтинг (1–10)">
              <FormInput
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="10"
                defaultValue={entry?.rating ?? ""}
                placeholder="8.5"
              />
            </FormField>
            <FormField label="Эмоция">
              <Select
                value={cryTag}
                onChangeAction={(val) => {
                  setCryTag(val);
                  setIsDirty(true);
                }}
                options={[
                  { value: "", label: "— не выбрано —" },
                  ...(Object.keys(CRY_TAGS) as CryTag[]).map((key) => ({
                    value: key,
                    label: CRY_TAGS[key].label,
                  })),
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── ВПЕЧАТЛЕНИЯ ─── */}
        <FormSection
          Icon={MessageCircle}
          title="Впечатления"
          description="Что осталось в памяти"
        >
          <FormField label="Впечатление (короткое)">
            <FormInput
              type="text"
              name="impression"
              defaultValue={entry?.impression ?? ""}
              placeholder="Пара слов: «Идеальная героиня»"
            />
          </FormField>

          <FormField label="Отзыв">
            <FormTextarea
              name="review"
              defaultValue={entry?.review ?? ""}
              rows={6}
              placeholder="Полный отзыв..."
            />
          </FormField>

          <FormField label="Цитата для «Особого места»">
            <FormTextarea
              name="quote"
              defaultValue={entry?.quote ?? ""}
              rows={2}
              placeholder="Любимая фраза из дорамы"
            />
          </FormField>
        </FormSection>

        {/* ─── ДАТЫ И ПЕРЕСМОТРЫ ─── */}
        <FormSection
          Icon={Calendar}
          title="Даты и прогресс"
          description="Когда смотрел и сколько раз"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Начал смотреть">
              <FormInput
                type="date"
                name="startedAt"
                defaultValue={formatDateForInput(entry?.startedAt ?? null)}
              />
            </FormField>
            <FormField label="Досмотрел">
              <FormInput
                type="date"
                name="watchedAt"
                defaultValue={formatDateForInput(entry?.watchedAt ?? null)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Прогресс (серия)">
              <FormInput
                type="number"
                name="progress"
                min="0"
                defaultValue={entry?.progress ?? ""}
                placeholder="на какой серии остановился"
              />
            </FormField>
            <FormField label="Пересмотров">
              <FormInput
                type="number"
                name="rewatchCount"
                min="0"
                defaultValue={entry?.rewatchCount ?? 0}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── ПРИВАТНОЕ ─── */}
        <FormSection
          Icon={Lock}
          title="Личные заметки"
          description="Видно только тебе"
        >
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-accent/40 transition-colors mb-4">
            <input
              type="checkbox"
              name="isFavorite"
              defaultChecked={entry?.isFavorite ?? false}
              className="w-4 h-4 accent-accent"
            />
            <div>
              <p className="text-sm font-medium">Добавить в «Особое место»</p>
              <p className="text-xs text-muted">
                Дорама появится в твоем «Зале славы»
              </p>
            </div>
          </label>
          <FormField label="Заметки">
            <FormTextarea
              name="notes"
              defaultValue={entry?.notes ?? ""}
              rows={3}
              placeholder="Только для тебя"
            />
          </FormField>
        </FormSection>

        <FormError error={error} />
      </form>
    </Modal>
  );
}
