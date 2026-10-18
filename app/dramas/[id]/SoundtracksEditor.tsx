"use client";

import { useState, useTransition } from "react";
import { X, Plus, Trash2, Music } from "lucide-react";
import { addSoundtrack, removeSoundtrack } from "./actions";

export function SoundtracksEditor({
  dramaId,
  soundtracks,
  onClose,
}: {
  dramaId: number;
  soundtracks: any[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("dramaId", String(dramaId));

    startTransition(async () => {
      const result = await addSoundtrack(formData);
      if (result?.error) setError(result.error);
      else { form.reset(); setError(null); }
    });
  };

  const handleRemove = (id: number) => {
    const formData = new FormData();
    formData.set("soundtrackId", String(id));
    formData.set("dramaId", String(dramaId));
    startTransition(async () => { await removeSoundtrack(formData); });
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none text-sm";
  const labelCls = "block text-xs font-medium text-muted mb-1.5";

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">Саундтрек</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Существующие */}
          {soundtracks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Добавленные треки</p>
              {soundtracks.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-background">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    {s.artist && <p className="text-xs text-muted truncate">{s.artist}</p>}
                  </div>
                  <button type="button" onClick={() => handleRemove(s.id)} disabled={isPending} className="w-7 h-7 rounded-md border border-border hover:border-red-500/40 hover:text-red-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Форма добавления */}
          <form onSubmit={handleAdd} className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className={labelCls}>Название трека *</label>
              <input type="text" name="title" required placeholder="Stay With Me" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Исполнитель</label>
              <input type="text" name="artist" placeholder="Chanyeol, Punch" className={inputCls} />
            </div>
                        <div>
              <label className={labelCls}>Тип трека</label>
              <select name="kind" className={inputCls} defaultValue="ost_part">
                <option value="ost_part">OST Part (сингл)</option>
                <option value="full_ost">Из полного OST</option>
                <option value="bgm">BGM / Фоновая музыка</option>
                <option value="instrumental">Instrumental (минус)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Ссылка (YouTube или Spotify) *</label>
              <input type="url" name="url" required placeholder="https://youtube.com/watch?v=..." className={inputCls} />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Plus className="w-4 h-4" />
              {isPending ? "Добавление..." : "Добавить трек"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}