"use client";

import { useState, useTransition } from "react";
import { Save, User, FileText, Image, Link2 } from "lucide-react";
import { createPerson, updatePerson } from "./actions";
import { FormSection } from "@/components/FormSection";

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
  socialLinks?: { platform: string; url: string }[];
  bloodType: string | null;
  mbti: string | null;
  zodiacWestern: string | null;
  zodiacChinese: string | null;
};

export function PersonForm({ person }: { person?: PersonData }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = person ? updatePerson : createPerson;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-medium text-muted mb-1.5";

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
        {/* Имя */}
        <div>
          <label className={labelCls}>
            Имя <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={person?.name ?? ""}
            required
            placeholder="Ким Су Хён"
            className={inputCls}
          />
        </div>

        {/* Дата рождения и агентство (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Дата рождения</label>
            <input
              type="date"
              name="birthDate"
              defaultValue={dateValue}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Агентство</label>
            <input
              type="text"
              name="agency"
              defaultValue={person?.agency ?? ""}
              placeholder="Gold Medalist"
              className={inputCls}
            />
          </div>
        </div>

        {/* Пол, рост, место рождения (3 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Пол</label>
            <select
              name="gender"
              defaultValue={person?.gender ?? ""}
              className={inputCls}
            >
              <option value="">— не указан —</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Рост (см)</label>
            <input
              type="number"
              name="height"
              defaultValue={person?.height ?? ""}
              placeholder="180"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Место рождения</label>
            <input
              type="text"
              name="birthPlace"
              defaultValue={person?.birthPlace ?? ""}
              placeholder="Сеул, Южная Корея"
              className={inputCls}
            />
          </div>
        </div>

        {/* Группа крови, MBTI, Зодиаки (4 колонки) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
            <label className={labelCls}>Группа крови</label>
            <select name="bloodType" defaultValue={person?.bloodType ?? ""} className={inputCls}>
              <option value="">— нет —</option>
              <option value="O(I)">O(I)</option>
              <option value="A(II)">A(II)</option>
              <option value="B(III)">B(III)</option>
              <option value="AB(IV)">AB(IV)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>MBTI</label>
            <input
              type="text"
              name="mbti"
              defaultValue={person?.mbti ?? ""}
              placeholder="INFP"
              className={`${inputCls} uppercase`}
            />
          </div>
          <div>
            <label className={labelCls}>Западный зодиак</label>
            <select name="zodiacWestern" defaultValue={person?.zodiacWestern ?? ""} className={inputCls}>
              <option value="">— нет —</option>
              {["Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Китайский зодиак</label>
            <select name="zodiacChinese" defaultValue={person?.zodiacChinese ?? ""} className={inputCls}>
              <option value="">— нет —</option>
              {["Крыса", "Бык", "Тигр", "Кролик", "Дракон", "Змея", "Лошадь", "Коза", "Обезьяна", "Петух", "Собака", "Свинья"].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      {/* ─── БИОГРАФИЯ ─── */}
      <FormSection
        Icon={FileText}
        title="Биография"
        description="Краткая справка о человеке"
      >
        <div>
          <label className={labelCls}>Био</label>
          <textarea
            name="bio"
            defaultValue={person?.bio ?? ""}
            rows={5}
            placeholder="Несколько предложений о карьере и жизни..."
            className={`${inputCls} resize-y`}
          />
        </div>
      </FormSection>

      {/* ─── МЕДИА И ССЫЛКИ ─── */}
      <FormSection
        Icon={Image}
        title="Медиа и ссылки"
        description="Фото и соцсети актёра"
      >
        <div>
          <label className={labelCls}>URL фотографии</label>
          <input
            type="url"
            name="photoUrl"
            defaultValue={person?.photoUrl ?? ""}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
        
        <div>
          <label className={labelCls}>
            Соцсети <span className="text-muted/60 font-normal">(формат: платформа|ссылка, каждая с новой строки)</span>
          </label>
          <textarea
            name="socialLinks"
            
            defaultValue={person?.socialLinks?.map((l) => `${l.platform}|${l.url}`).join("\n") ?? ""}
            rows={3}
            placeholder="instagram|https://...&#10;youtube|https://...&#10;wikipedia|https://..."
            className={`${inputCls} resize-y`}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              'instagram', 'youtube', 'twitter', 'tiktok', 'weibo', 'wikipedia',
              'facebook', 'linkedin', 'telegram', 'discord', 'threads', 'bluesky',
              'vk', 'spotify', 'soundcloud', 'naver', 'kakao', 'wechat', 'bilibili',
              'imdb', 'website'
            ].map((platform) => (
              <span 
                key={platform} 
                className="text-[10px] text-muted/60 bg-surface border border-border/50 px-1.5 py-0.5 rounded"
              >
                {platform}
              </span>
            ))}
            <span className="text-[10px] text-muted/40 self-center ml-1">и другие...</span>
          </div>
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
          {isPending ? "Сохранение..." : person ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}