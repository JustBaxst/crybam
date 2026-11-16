"use client";

import { useState, useTransition } from "react";
import { X, Save, User, FileText, Image, Sparkles } from "lucide-react";
import { updatePerson } from "./actions";
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

export function EditPersonForm({
  person,
  onCloseAction,
}: {
  person: any;
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);

  useLockBodyScroll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePerson(formData);
      if (result?.error) {
        setError(result.error);
        if ("existingId" in result && result.existingId)
          setExistingId(result.existingId);
      } else {
        if (result?.isJustCompleted) {
          toast.success(`Карточка актера завершена!`, {
            icon: <Sparkles className="w-4 h-4" />,
          });
        }
        onCloseAction();
      }
    });
  };

  const dateValue = person?.birthDate
    ? new Date(person.birthDate).toISOString().slice(0, 10)
    : "";

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Редактировать актера</h2>
            <p className="text-xs text-muted mt-0.5">{person.name}</p>
          </div>
          <button
            type="button"
            onClick={onCloseAction}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input type="hidden" name="personId" value={person.id} />

        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          <FormSection
            Icon={User}
            title="Основное"
            description="Имя и информация о человеке"
          >
            <FormField label="Имя" required>
              <FormInput
                type="text"
                name="name"
                defaultValue={person.name}
                required
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Дата рождения">
                <FormInput
                  type="date"
                  name="birthDate"
                  defaultValue={dateValue}
                />
              </FormField>
              <FormField label="Агентство">
                <FormInput
                  type="text"
                  name="agency"
                  defaultValue={person.agency ?? ""}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Национальность">
                <FormSelect
                  name="nationality"
                  defaultValue={person.nationality ?? ""}
                >
                  <option value="">— не указана —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Пол">
                <FormSelect name="gender" defaultValue={person.gender ?? ""}>
                  <option value="">— не указан —</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другой</option>
                </FormSelect>
              </FormField>
              <FormField label="Рост (см)">
                <FormInput
                  type="number"
                  name="height"
                  defaultValue={person.height ?? ""}
                />
              </FormField>
              <FormField label="Место рождения">
                <FormInput
                  type="text"
                  name="birthPlace"
                  defaultValue={person.birthPlace ?? ""}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Группа крови">
                <FormSelect
                  name="bloodType"
                  defaultValue={person.bloodType ?? ""}
                >
                  <option value="">— нет —</option>
                  {["O(I)", "A(II)", "B(III)", "AB(IV)"].map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="MBTI">
                <FormInput
                  type="text"
                  name="mbti"
                  defaultValue={person.mbti ?? ""}
                  className="uppercase"
                />
              </FormField>
              <FormField label="Западный зодиак">
                <FormSelect
                  name="zodiacWestern"
                  defaultValue={person.zodiacWestern ?? ""}
                >
                  <option value="">— нет —</option>
                  {[
                    "Овен",
                    "Телец",
                    "Близнецы",
                    "Рак",
                    "Лев",
                    "Дева",
                    "Весы",
                    "Скорпион",
                    "Стрелец",
                    "Козерог",
                    "Водолей",
                    "Рыбы",
                  ].map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Китайский зодиак">
                <FormSelect
                  name="zodiacChinese"
                  defaultValue={person.zodiacChinese ?? ""}
                >
                  <option value="">— нет —</option>
                  {[
                    "Крыса",
                    "Бык",
                    "Тигр",
                    "Кролик",
                    "Дракон",
                    "Змея",
                    "Лошадь",
                    "Коза",
                    "Обезьяна",
                    "Петух",
                    "Собака",
                    "Свинья",
                  ].map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection
            Icon={FileText}
            title="Биография"
            description="Краткая справка"
          >
            <FormField label="Био">
              <FormTextarea
                name="bio"
                defaultValue={person.bio ?? ""}
                rows={5}
              />
            </FormField>
          </FormSection>

          <FormSection
            Icon={Image}
            title="Медиа и ссылки"
            description="Фото и соцсети"
          >
            <FormField label="URL фотографии">
              <FormInput
                type="url"
                name="photoUrl"
                defaultValue={person.photoUrl ?? ""}
              />
            </FormField>
            <FormField
              label="Соцсети"
              description="Формат: платформа|ссылка, каждая с новой строки"
            >
              <FormTextarea
                name="socialLinks"
                defaultValue={
                  person.socialLinks
                    ?.map((l: any) => `${l.platform}|${l.url}`)
                    .join("\n") ?? ""
                }
                rows={3}
              />
            </FormField>
          </FormSection>

          <FormError
            error={error}
            existingId={existingId}
            href={`/admin/people/${existingId}`}
          />
        </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
