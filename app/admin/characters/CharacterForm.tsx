"use client";

import { useState, useTransition } from "react";
import { Save, UserCircle, FileText, Image } from "lucide-react";
import { createCharacter, updateCharacter } from "./actions";
import { FormSection } from "@/components/FormSection";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
} from "@/components/ui/form-elements";

type CharacterData = {
  id?: number;
  dramaId?: number;
  name?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  gender?: string | null;
  height?: string | null;
  age?: string | null;
  birthDate?: string | null;
  occupation?: string | null;
  zodiacWestern?: string | null;
  zodiacChinese?: string | null;
};

type DramaOption = {
  id: number;
  title: string;
  year: number | null;
};

export function CharacterForm({
  character,
  dramas,
  fromDrama,
}: {
  character?: CharacterData;
  dramas: DramaOption[];
  fromDrama?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    if (fromDrama) formData.set("fromDrama", fromDrama);

    startTransition(async () => {
      const action = character ? updateCharacter : createCharacter;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 space-y-8"
    >
      {character?.id && (
        <input type="hidden" name="characterId" value={character.id} />
      )}

      {/* ─── ОСНОВНОЕ ─── */}
      <FormSection
        Icon={UserCircle}
        title="Основное"
        description="Имя и принадлежность к дораме"
      >
        {character ? (
          <FormField
            label="Дорама"
            description="Дораму нельзя изменить после создания"
          >
            <div className="px-3 py-2 rounded-lg border border-border bg-background/50 text-sm text-muted">
              {dramas.find((d) => d.id === character.dramaId)?.title ??
                "Неизвестная дорама"}
            </div>
          </FormField>
        ) : (
          <FormField label="Дорама" required>
            <FormSelect name="dramaId" required defaultValue="">
              <option value="" disabled>
                — выбери дораму —
              </option>
              {dramas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                  {d.year && ` (${d.year})`}
                </option>
              ))}
            </FormSelect>
          </FormField>
        )}

        <FormField label="Имя персонажа" required>
          <FormInput
            type="text"
            name="name"
            defaultValue={character?.name ?? ""}
            required
            placeholder="Мун Ган Тэ"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Пол">
            <FormSelect name="gender" defaultValue={character?.gender ?? ""}>
              <option value="">— не указан —</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </FormSelect>
          </FormField>
          <FormField label="Профессия / Роль">
            <FormInput
              type="text"
              name="occupation"
              defaultValue={character?.occupation ?? ""}
              placeholder="Наследный принц, Детектив..."
            />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Рост">
            <FormInput
              type="text"
              name="height"
              defaultValue={character?.height ?? ""}
              placeholder="178 см"
            />
          </FormField>
          <FormField label="Возраст">
            <FormInput
              type="text"
              name="age"
              defaultValue={character?.age ?? ""}
              placeholder="25 (или 1000+)"
            />
          </FormField>
          <FormField label="День рождения">
            <FormInput
              type="text"
              name="birthDate"
              defaultValue={character?.birthDate ?? ""}
              placeholder="14 февраля"
            />
          </FormField>
        </div>
      </FormSection>

      {/* ─── ОПИСАНИЕ ─── */}
      <FormSection
        Icon={FileText}
        title="Описание"
        description="Роль персонажа в сюжете"
      >
        <FormField label="Описание роли">
          <FormTextarea
            name="description"
            defaultValue={character?.description ?? ""}
            rows={4}
            placeholder="Медбрат в психиатрической больнице, заботится о старшем брате..."
          />
        </FormField>
      </FormSection>

      {/* ─── МЕДИА ─── */}
      <FormSection Icon={Image} title="Медиа" description="Фото персонажа">
        <FormField label="URL фотографии">
          <FormInput
            type="url"
            name="imageUrl"
            defaultValue={character?.imageUrl ?? ""}
            placeholder="https://..."
          />
        </FormField>
      </FormSection>

      <FormError error={error} />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Сохранение..." : character ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}
