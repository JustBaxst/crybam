"use client";

import { useState, useTransition } from "react";
import { Trash2, Music, Plus } from "lucide-react";
import { addSoundtrack, removeSoundtrack } from "./actions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormField, FormInput, FormError } from "@/components/ui/form-elements";
import { toast } from "sonner";

/**
 * Редактор саундтрека дорамы.
 * @dontDuplicate Не верстать модалку и форму добавления трека вручную.
 */
export function SoundtracksEditor({
  dramaId,
  soundtracks,
  onCloseAction,
}: {
  dramaId: number;
  soundtracks: any[];
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState("ost_part");
  const [isDirty, setIsDirty] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("dramaId", String(dramaId));
    formData.set("kind", kind);

    startTransition(async () => {
      const result = await addSoundtrack(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Трек добавлен");
        form.reset();
        setKind("ost_part");
        setIsDirty(false);
      }
    });
  };

  const handleRemove = (id: number) => {
    const formData = new FormData();
    formData.set("soundtrackId", String(id));
    formData.set("dramaId", String(dramaId));

    startTransition(async () => {
      await removeSoundtrack(formData);
      toast.success("Трек удален");
    });
  };

  return (
    <Modal
      isOpen={true}
      onCloseAction={onCloseAction}
      title="Саундтрек"
      icon={<Music className="w-5 h-5" />}
      isDirty={isDirty}
      isPending={isPending}
      maxWidth="max-w-4xl"
      footer={(close) => (
        <Button
          type="button"
          variant="outline"
          onClick={close}
          disabled={isPending}
        >
          Закрыть
        </Button>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ─── ЛЕВАЯ КОЛОНКА: СПИСОК ТРЕКОВ ─── */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Добавленные треки
          </p>

          {soundtracks.length === 0 ? (
            <p className="text-sm text-muted italic text-center py-10">
              В саундтреке пока нет треков.
            </p>
          ) : (
            <div className="space-y-2">
              {soundtracks.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {s.title}
                    </p>
                    {s.artist && (
                      <p className="text-xs text-muted truncate">{s.artist}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(s.id)}
                    disabled={isPending}
                    className="w-7 h-7 rounded-md border border-border hover:border-danger/40 hover:text-danger flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── ПРАВАЯ КОЛОНКА: ДОБАВЛЕНИЕ ─── */}
        <div className="bg-surface/30 border border-border/50 rounded-2xl p-5 sticky top-0">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent" /> Добавить трек
          </h3>

          <form
            id="add-soundtrack-form"
            onSubmit={handleAdd}
            className="space-y-4"
            onChange={() => setIsDirty(true)}
          >
            <FormField label="Название трека" required>
              <FormInput
                type="text"
                name="title"
                required
                placeholder="Stay With Me"
              />
            </FormField>

            <FormField label="Исполнитель">
              <FormInput
                type="text"
                name="artist"
                placeholder="Chanyeol, Punch"
              />
            </FormField>

            <FormField label="Тип трека">
              <Select
                value={kind}
                onChangeAction={(val) => {
                  setKind(val);
                  setIsDirty(true);
                }}
                options={[
                  { value: "ost_part", label: "OST Part (сингл)" },
                  { value: "full_ost", label: "Из полного OST" },
                  { value: "bgm", label: "BGM / Фоновая музыка" },
                  { value: "instrumental", label: "Instrumental (минус)" },
                ]}
              />
            </FormField>

            <FormField
              label="Ссылка на трек"
              required
              description="YouTube, Spotify, Яндекс.Музыка, SoundCloud, VK"
            >
              <FormInput
                type="url"
                name="url"
                required
                placeholder="https://..."
              />
            </FormField>

            <FormError error={error} />

            <Button type="submit" disabled={isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isPending ? "Добавление..." : "Добавить трек"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
