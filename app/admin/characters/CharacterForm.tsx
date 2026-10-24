"use client";

import { useState, useTransition } from "react";
import { Save, UserCircle, FileText, Image, Users, Sparkles } from "lucide-react";
import { createCharacter, updateCharacter } from "./actions";
import { FormSection } from "@/components/FormSection";

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
}: {
  character?: CharacterData;
  dramas: DramaOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = character ? updateCharacter : createCharacter;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
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
          <div>
            <label className={labelCls}>Дорама</label>
            <div className="px-3 py-2 rounded-lg border border-border bg-background/50 text-sm text-muted">
              {dramas.find((d) => d.id === character.dramaId)?.title ??
                "Неизвестная дорама"}
            </div>
            <p className="text-[11px] text-muted/70 mt-1.5">
              Дораму нельзя изменить после создания
            </p>
          </div>
        ) : (
          <div>
            <label className={labelCls}>
              Дорама <span className="text-accent">*</span>
            </label>
            <select
              name="dramaId"
              required
              defaultValue=""
              className={inputCls}
            >
              <option value="" disabled>
                — выбери дораму —
              </option>
              {dramas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                  {d.year && ` (${d.year})`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelCls}>
            Имя персонажа <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={character?.name ?? ""}
            required
            placeholder="Мун Ган Тэ"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Пол</label>
            <select
              name="gender"
              defaultValue={character?.gender ?? ""}
              className={inputCls}
            >
              <option value="">— не указан —</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Профессия / Роль</label>
            <input
              type="text"
              name="occupation"
              defaultValue={character?.occupation ?? ""}
              placeholder="Наследный принц, Детектив..."
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Рост</label>
            <input
              type="text"
              name="height"
              defaultValue={character?.height ?? ""}
              placeholder="178 см"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Возраст</label>
            <input
              type="text"
              name="age"
              defaultValue={character?.age ?? ""}
              placeholder="25 (или 1000+)"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>День рождения</label>
            <input
              type="text"
              name="birthDate"
              defaultValue={character?.birthDate ?? ""}
              placeholder="14 февраля"
              className={inputCls}
            />
          </div>
        </div>
      </FormSection>

      {/* ─── ОПИСАНИЕ ─── */}
      <FormSection
        Icon={FileText}
        title="Описание"
        description="Роль персонажа в сюжете"
      >
        <div>
          <label className={labelCls}>Описание роли</label>
          <textarea
            name="description"
            defaultValue={character?.description ?? ""}
            rows={4}
            placeholder="Медбрат в психиатрической больнице, заботится о старшем брате..."
            className={`${inputCls} resize-y`}
          />
        </div>
      </FormSection>

      {/* ─── МЕДИА ─── */}
      <FormSection Icon={Image} title="Медиа" description="Фото персонажа">
        <div>
          <label className={labelCls}>URL фотографии</label>
          <input
            type="url"
            name="imageUrl"
            defaultValue={character?.imageUrl ?? ""}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
      </FormSection>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending
            ? "Сохранение..."
            : character
            ? "Сохранить"
            : "Создать"}
        </button>
      </div>
    </form>
  );
}