"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { createPerson, updatePerson } from "./actions";

export function PersonForm({ person }: { person?: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const action = person ? updatePerson : createPerson;
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors";
  const labelCls = "block text-sm font-medium mb-2 text-muted";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 space-y-5">
      {person && <input type="hidden" name="personId" value={person.id} />}

      <div>
        <label className={labelCls}>Имя (русское/английское) <span className="text-accent">*</span></label>
        <input type="text" name="name" defaultValue={person?.name} required className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Имя на родном языке</label>
        <input type="text" name="nameNative" defaultValue={person?.nameNative} className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Дата рождения</label>
          <input 
            type="date" 
            name="birthDate" 
            defaultValue={person?.birthDate ? new Date(person.birthDate).toISOString().slice(0, 10) : ""} 
            className={inputCls} 
          />
        </div>
        <div>
          <label className={labelCls}>Агентство</label>
          <input type="text" name="agency" defaultValue={person?.agency} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Ссылка на фото (URL)</label>
        <input type="url" name="photoUrl" defaultValue={person?.photoUrl} placeholder="https://..." className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Биография</label>
        <textarea name="bio" defaultValue={person?.bio} rows={4} className={`${inputCls} resize-y`} />
      </div>

      {error && <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          <Save className="w-4 h-4" />
          {isPending ? "Сохранение..." : person ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
}