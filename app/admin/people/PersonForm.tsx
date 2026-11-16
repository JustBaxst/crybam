"use client";

import { useState, useTransition } from "react";
import { Save, User, FileText, Image } from "lucide-react";
import { createPerson, updatePerson } from "./actions";
import { FormSection } from "@/components/FormSection";
import { COUNTRIES } from "@/lib/constants";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
} from "@/components/ui/form-elements";

type PersonData = {
  id?: number;
  name?: string | null;
  birthDate?: Date | null;
  agency?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  gender?: string | null;
  height?: number | null;
  birthPlace?: string | null;
  nationality?: string | null;
  socialLinks?: { platform: string; url: string }[];
  bloodType: string | null;
  mbti: string | null;
  zodiacWestern: string | null;
  zodiacChinese: string | null;
};

export function PersonForm({
  person,
  fromDrama,
}: {
  person?: PersonData;
  fromDrama?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);
    const formData = new FormData(e.currentTarget);
    if (fromDrama) formData.set("fromDrama", fromDrama);

    startTransition(async () => {
      const action = person ? updatePerson : createPerson;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
        if ("existingId" in result && result.existingId) {
          setExistingId(result.existingId);
        }
      }
    });
  };

  const dateValue = person?.birthDate
    ? new Date(person.birthDate).toISOString().slice(0, 10)
    : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 space-y-8"
    >
      {person?.id && <input type="hidden" name="personId" value={person.id} />}

      {/* ─── ОСНОВНОЕ ─── */}
      <FormSection
        Icon={User}
        title="Основное"
        description="Имя и информация о человеке"
      >
        <FormField label="Имя" required>
          <FormInput
            type="text"
            name="name"
            defaultValue={person?.name ?? ""}
            required
            placeholder="Ким Су Хён"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Дата рождения">
            <FormInput type="date" name="birthDate" defaultValue={dateValue} />
          </FormField>
          <FormField label="Агентство">
            <FormInput
              type="text"
              name="agency"
              defaultValue={person?.agency ?? ""}
              placeholder="Gold Medalist"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField label="Страна / Национальность">
            <FormSelect
              name="nationality"
              defaultValue={person?.nationality ?? ""}
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
            <FormSelect name="gender" defaultValue={person?.gender ?? ""}>
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
              defaultValue={person?.height ?? ""}
              placeholder="180"
            />
          </FormField>
          <FormField label="Место рождения">
            <FormInput
              type="text"
              name="birthPlace"
              defaultValue={person?.birthPlace ?? ""}
              placeholder="Сеул, Южная Корея"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField label="Группа крови">
            <FormSelect name="bloodType" defaultValue={person?.bloodType ?? ""}>
              <option value="">— нет —</option>
              <option value="O(I)">O(I)</option>
              <option value="A(II)">A(II)</option>
              <option value="B(III)">B(III)</option>
              <option value="AB(IV)">AB(IV)</option>
            </FormSelect>
          </FormField>
          <FormField label="MBTI">
            <FormInput
              type="text"
              name="mbti"
              defaultValue={person?.mbti ?? ""}
              placeholder="INFP"
              className="uppercase"
            />
          </FormField>
          <FormField label="Западный зодиак">
            <FormSelect
              name="zodiacWestern"
              defaultValue={person?.zodiacWestern ?? ""}
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
              defaultValue={person?.zodiacChinese ?? ""}
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

      {/* ─── БИОГРАФИЯ ─── */}
      <FormSection
        Icon={FileText}
        title="Биография"
        description="Краткая справка о человеке"
      >
        <FormField label="Био">
          <FormTextarea
            name="bio"
            defaultValue={person?.bio ?? ""}
            rows={5}
            placeholder="Несколько предложений о карьере и жизни..."
          />
        </FormField>
      </FormSection>

      {/* ─── МЕДИА И ССЫЛКИ ─── */}
      <FormSection
        Icon={Image}
        title="Медиа и ссылки"
        description="Фото и соцсети актёра"
      >
        <FormField label="URL фотографии">
          <FormInput
            type="url"
            name="photoUrl"
            defaultValue={person?.photoUrl ?? ""}
            placeholder="https://..."
          />
        </FormField>

        <FormField
          label="Соцсети"
          description="Формат: платформа|ссылка, каждая с новой строки"
        >
          <FormTextarea
            name="socialLinks"
            defaultValue={
              person?.socialLinks
                ?.map((l) => `${l.platform}|${l.url}`)
                .join("\n") ?? ""
            }
            rows={3}
            placeholder="instagram|https://...&#10;youtube|https://..."
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "instagram",
              "youtube",
              "twitter",
              "tiktok",
              "weibo",
              "wikipedia",
              "facebook",
              "linkedin",
              "telegram",
              "discord",
              "threads",
              "bluesky",
              "vk",
              "spotify",
              "soundcloud",
              "naver",
              "kakao",
              "wechat",
              "bilibili",
              "imdb",
              "website",
            ].map((platform) => (
              <span
                key={platform}
                className="text-[10px] text-muted/60 bg-surface border border-border/50 px-1.5 py-0.5 rounded"
              >
                {platform}
              </span>
            ))}
            <span className="text-[10px] text-muted/40 self-center ml-1">
              и другие...
            </span>
          </div>
        </FormField>
      </FormSection>

      <FormError
        error={error}
        existingId={existingId}
        href={`/admin/people/${existingId}`}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Сохранение..." : person ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}
