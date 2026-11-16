"use client";

import { useState, useTransition } from "react";
import { X, Save, UserCircle, FileText, Image, Sparkles } from "lucide-react";
import { updateCharacter } from "./actions";
import { FormSection } from "@/components/FormSection";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { toast } from "sonner";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
} from "@/components/ui/form-elements";

type DramaOption = {
  id: number;
  title: string;
  year: number | null;
};

export function EditCharacterForm({
  character,
  dramas,
  onCloseAction,
}: {
  character: any;
  dramas: DramaOption[];
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useLockBodyScroll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateCharacter(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        if (result?.isJustCompleted) {
          toast.success(`Карточка персонажа завершена!`, {
            icon: <Sparkles className="w-4 h-4" />,
          });
        }
        onCloseAction();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Шапка модалки */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Редактировать персонажа</h2>
            <p className="text-xs text-muted mt-0.5">{character.name}</p>
          </div>
          <button
            type="button"
            onClick={onCloseAction}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input type="hidden" name="characterId" value={character.id} />

        {/* Тело формы */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          <FormSection
            Icon={UserCircle}
            title="Основное"
            description="Имя и принадлежность к дораме"
          >
            <FormField
              label="Дорама"
              description="Дораму нельзя изменить после создания"
            >
              <div className="px-3 py-2 rounded-lg border border-border bg-background/50 text-sm text-muted">
                {dramas.find((d) => d.id === character.dramaId)?.title ??
                  "Неизвестная дорама"}
              </div>
            </FormField>

            <FormField label="Имя персонажа" required>
              <FormInput
                type="text"
                name="name"
                defaultValue={character.name ?? ""}
                required
                placeholder="Мун Ган Тэ"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Пол">
                <FormSelect name="gender" defaultValue={character.gender ?? ""}>
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
                  defaultValue={character.occupation ?? ""}
                  placeholder="Наследный принц, Детектив..."
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Рост">
                <FormInput
                  type="text"
                  name="height"
                  defaultValue={character.height ?? ""}
                  placeholder="178 см"
                />
              </FormField>
              <FormField label="Возраст">
                <FormInput
                  type="text"
                  name="age"
                  defaultValue={character.age ?? ""}
                  placeholder="25 (или 1000+)"
                />
              </FormField>
              <FormField label="День рождения">
                <FormInput
                  type="text"
                  name="birthDate"
                  defaultValue={character.birthDate ?? ""}
                  placeholder="14 февраля"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            Icon={FileText}
            title="Описание"
            description="Роль персонажа в сюжете"
          >
            <FormField label="Описание роли">
              <FormTextarea
                name="description"
                defaultValue={character.description ?? ""}
                rows={4}
                placeholder="Медбрат в психиатрической больнице, заботится о старшем брате..."
              />
            </FormField>
          </FormSection>

          <FormSection Icon={Image} title="Медиа" description="Фото персонажа">
            <FormField label="URL фотографии">
              <FormInput
                type="url"
                name="imageUrl"
                defaultValue={character.imageUrl ?? ""}
                placeholder="https://..."
              />
            </FormField>
          </FormSection>

          <FormError error={error} />
        </div>

        {/* Футер модалки */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onCloseAction}
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
