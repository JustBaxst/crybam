"use client";

import { useState, useTransition } from "react";
import { Save, Film, Sliders } from "lucide-react";
import { createDrama } from "../../actions";
import { FormSection } from "@/components/FormSection";
import Link from "next/link";

export function NewDramaForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setExistingId(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createDrama(formData);
            if (result?.error) {
        setError(result.error);
        if ("existingId" in result) setExistingId(result.existingId ?? null);
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
      {/* ─── ОСНОВНОЕ ─── */}
      <FormSection
        Icon={Film}
        title="Основное"
        description="Обязательный минимум — название"
      >
        <div>
          <label className={labelCls}>
            Название <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            autoFocus
            placeholder="Псих, но всё в порядке"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Год</label>
            <input
              type="number"
              name="year"
              placeholder="2020"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Страна</label>
            <input
              type="text"
              name="country"
              placeholder="Южная Корея"
              className={inputCls}
            />
          </div>
        </div>
      </FormSection>

      {/* ─── ПАРАМЕТРЫ ─── */}
      <FormSection
        Icon={Sliders}
        title="Параметры"
        description="Структура и длительность"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Серий</label>
            <input
              type="number"
              name="episodes"
              placeholder="16"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Сезонов</label>
            <input
              type="number"
              name="seasons"
              placeholder="1"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Мин / серия</label>
            <input
              type="number"
              name="episodeDuration"
              placeholder="70"
              className={inputCls}
            />
          </div>
        </div>
      </FormSection>

        {error && (
        <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2 flex items-start justify-between gap-3">
          <span className="flex-1">{error}</span>
          {existingId && (
            <Link
              href={`/admin/dramas/${existingId}`}
              className="shrink-0 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors text-red-200 whitespace-nowrap"
            >
              Открыть её →
            </Link>
          )}
        </div>
      )}

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
  );
}