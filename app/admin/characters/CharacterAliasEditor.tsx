"use client";

import { useState, useTransition } from "react";
import { X, Save } from "lucide-react";
import { updateCharacterAliases } from "./actions";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";

export function CharacterAliasEditor({
  characterId,
  currentAliases,
  onClose,
}: {
  characterId: number;
  currentAliases: string[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  useLockBodyScroll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("characterId", String(characterId));

    startTransition(async () => {
      const result = await updateCharacterAliases(formData);
      if (result?.error) setError(result.error);
      else onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">Другие имена персонажа</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Имена (каждое с новой строки)</label>
            <textarea
              name="aliases"
              defaultValue={currentAliases.join("\n")}
              rows={5}
              placeholder="Ё Джин Гу&#10;Ё Чжин-гу&#10;Yeo Jin-goo"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none resize-y"
            />
            <p className="text-xs text-muted mt-1.5">
              Добавляй сюда разные варианты написания (транслитерации), чтобы поиск находил персонажа.
            </p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:border-accent/40">Отмена</button>
          <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}