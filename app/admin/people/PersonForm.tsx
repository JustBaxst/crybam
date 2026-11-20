"use client";

import { useState, useTransition } from "react";
import { Save, User, FileText, Image, Sparkles, Edit } from "lucide-react";
import { FormSection } from "@/components/FormSection";
import { COUNTRIES } from "@/lib/constants";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import {
  FormField,
  FormInput,
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
  action,
  onCloseAction,
}: {
  person?: PersonData;
  fromDrama?: string;
  action: (formData: FormData) => Promise<any>;
  onCloseAction?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Стейты для кастомных селектов
  const [nationality, setNationality] = useState(person?.nationality ?? "");
  const [gender, setGender] = useState(person?.gender ?? "");
  const [bloodType, setBloodType] = useState(person?.bloodType ?? "");
  const [zodiacWestern, setZodiacWestern] = useState(
    person?.zodiacWestern ?? "",
  );
  const [zodiacChinese, setZodiacChinese] = useState(
    person?.zodiacChinese ?? "",
  );

  const isEdit = !!person?.id;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);

    const formData = new FormData(e.currentTarget);
    if (fromDrama) formData.set("fromDrama", fromDrama);

    formData.set("nationality", nationality);
    formData.set("gender", gender);
    formData.set("bloodType", bloodType);
    formData.set("zodiacWestern", zodiacWestern);
    formData.set("zodiacChinese", zodiacChinese);

    startTransition(async () => {
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
        if ("existingId" in result && result.existingId) {
          setExistingId(result.existingId);
        }
      } else {
        if (result?.isJustCompleted) {
          toast.success(`Карточка актера завершена!`, {
            icon: <Sparkles className="w-4 h-4" />,
          });
        }
        if (onCloseAction) onCloseAction();
      }
    });
  };

  const dateValue = person?.birthDate
    ? new Date(person.birthDate).toISOString().slice(0, 10)
    : "";

  const formContent = (
    <form
      id="person-form"
      onSubmit={handleSubmit}
      onChange={() => setIsDirty(true)}
      className="space-y-8"
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
          <FormField label="Национальность">
            <Select
              value={nationality}
              onChangeAction={(val) => {
                setNationality(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— не указана —" },
                ...COUNTRIES.map((c) => ({ value: c, label: c })),
              ]}
            />
          </FormField>
          <FormField label="Пол">
            <Select
              value={gender}
              onChangeAction={(val) => {
                setGender(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— не указан —" },
                { value: "male", label: "Мужской" },
                { value: "female", label: "Женский" },
                { value: "other", label: "Другой" },
              ]}
            />
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
            <Select
              value={bloodType}
              onChangeAction={(val) => {
                setBloodType(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— нет —" },
                ...["O(I)", "A(II)", "B(III)", "AB(IV)"].map((z) => ({
                  value: z,
                  label: z,
                })),
              ]}
            />
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
            <Select
              value={zodiacWestern}
              onChangeAction={(val) => {
                setZodiacWestern(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— нет —" },
                ...[
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
                ].map((z) => ({ value: z, label: z })),
              ]}
            />
          </FormField>
          <FormField label="Китайский зодиак">
            <Select
              value={zodiacChinese}
              onChangeAction={(val) => {
                setZodiacChinese(val);
                setIsDirty(true);
              }}
              options={[
                { value: "", label: "— нет —" },
                ...[
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
                ].map((z) => ({ value: z, label: z })),
              ]}
            />
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
    </form>
  );

  if (isEdit && onCloseAction) {
    return (
      <Modal
        isOpen={true}
        onCloseAction={onCloseAction}
        title="Редактировать актера"
        icon={<Edit className="w-5 h-5" />}
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
            <Button type="submit" form="person-form" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </>
        )}
      >
        {formContent}
      </Modal>
    );
  }

  // Рендер для страницы создания (NewPersonPage)
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-8">
      {formContent}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button type="submit" form="person-form" disabled={isPending}>
          <Save className="w-4 h-4 mr-2" />
          {isPending ? "Создание..." : "Создать"}
        </Button>
      </div>
    </div>
  );
}
