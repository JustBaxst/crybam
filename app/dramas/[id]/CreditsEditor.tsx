"use client";

import { useState, useTransition } from "react";
import { X, UserPlus, Trash2, Pencil, Save } from "lucide-react";
import { addCredit, removeCredit, updateCredit } from "./actions";

type RoleType = "actor" | "director" | "writer";
type Importance = "lead" | "support" | "guest";

const IMPORTANCE_OPTIONS: { value: Importance; label: string }[] = [
  { value: "lead", label: "Главная" },
  { value: "support", label: "Второстепенная" },
  { value: "guest", label: "Эпизод" },
];

export function CreditsEditor({
  dramaId,
  credits,
  existingPersons,
  onClose,
}: {
  dramaId: number;
  credits: {
    id: number;
    roleType: string;
    personName: string;
    characterName: string | null;
    characterDescription: string | null;
    importance: string;
  }[];
  existingPersons: string[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [roleType, setRoleType] = useState<RoleType>("actor");
  const [importance, setImportance] = useState<Importance>("lead");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("dramaId", String(dramaId));
    formData.set("roleType", roleType);
    formData.set("importance", importance);

    startTransition(async () => {
      const result = await addCredit(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        form.reset();
        setError(null);
      }
    });
  };

  const handleRemove = (creditId: number) => {
    const formData = new FormData();
    formData.set("creditId", String(creditId));
    formData.set("dramaId", String(dramaId));
    startTransition(async () => {
      await removeCredit(formData);
    });
  };

  const handleUpdate = (
    creditId: number,
    importanceValue: string,
    characterDescription: string
  ) => {
    const formData = new FormData();
    formData.set("creditId", String(creditId));
    formData.set("dramaId", String(dramaId));
    formData.set("importance", importanceValue);
    formData.set("characterDescription", characterDescription);

    startTransition(async () => {
      const result = await updateCredit(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setEditingId(null);
        setError(null);
      }
    });
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm";
  const labelCls = "block text-xs font-medium text-muted mb-1.5";

  const grouped = {
    actor: credits.filter((c) => c.roleType === "actor"),
    director: credits.filter((c) => c.roleType === "director"),
    writer: credits.filter((c) => c.roleType === "writer"),
  };

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Съёмочная группа</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {credits.length > 0 && (
          <div className="p-6 border-b border-border space-y-4 max-h-[45vh] overflow-y-auto">
            {(["actor", "director", "writer"] as const).map((type) => {
              const list = grouped[type];
              if (list.length === 0) return null;
              const label =
                type === "actor"
                  ? "Актёры"
                  : type === "director"
                    ? "Режиссёры"
                    : "Сценаристы";
              return (
                <div key={type}>
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  <div className="space-y-1.5">
                    {list.map((c) => (
                      <div key={c.id}>
                        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-background">
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium">
                              {c.personName}
                            </span>
                            {c.characterName && (
                              <span className="text-sm text-accent ml-2">
                                → {c.characterName}
                              </span>
                            )}
                            <span className="text-xs text-muted ml-2">
                              ({importanceLabel(c.importance)})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingId(editingId === c.id ? null : c.id)
                              }
                              disabled={isPending}
                              className="w-7 h-7 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors disabled:opacity-50"
                              title="Редактировать"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(c.id)}
                              disabled={isPending}
                              className="w-7 h-7 rounded-md border border-border hover:border-red-500/40 hover:text-red-400 flex items-center justify-center transition-colors disabled:opacity-50"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline-форма редактирования */}
                        {editingId === c.id && (
                          <InlineEdit
                            credit={c}
                            onSave={handleUpdate}
                            onCancel={() => setEditingId(null)}
                            disabled={isPending}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Тип</label>
            <div className="flex gap-2">
              {(
                [
                  { value: "actor", label: "Актёр" },
                  { value: "director", label: "Режиссёр" },
                  { value: "writer", label: "Сценарист" },
                ] as const
              ).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setRoleType(o.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${roleType === o.value
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted hover:border-accent/40"
                    }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {roleType === "actor" && (
            <div>
              <label className={labelCls}>Важность роли</label>
              <div className="flex gap-2">
                {IMPORTANCE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setImportance(o.value)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${importance === o.value
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-border text-muted hover:border-accent/40"
                      }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>
              {roleType === "actor"
                ? "Имя актёра"
                : roleType === "director"
                  ? "Имя режиссёра"
                  : "Имя сценариста"}
            </label>
            <input
              type="text"
              name="personName"
              list="persons-list"
              required
              placeholder="Начни вводить имя"
              className={inputCls}
            />
            <datalist id="persons-list">
              {existingPersons.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          {roleType === "actor" && (
            <>
              <div>
                <label className={labelCls}>Имя персонажа (опционально)</label>
                <input
                  type="text"
                  name="characterName"
                  placeholder="Ко Мун-ён"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Описание роли (опционально)</label>
                <input
                  type="text"
                  name="characterDescription"
                  placeholder="принц, восьмихвостая лиса..."
                  className={inputCls}
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:border-accent/40 transition-colors"
            >
              Закрыть
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {isPending ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InlineEdit({
  credit,
  onSave,
  onCancel,
  disabled,
}: {
  credit: {
    id: number;
    importance: string;
    characterDescription: string | null;
  };
  onSave: (id: number, importance: string, description: string) => void;
  onCancel: () => void;
  disabled: boolean;
}) {
  const [importance, setImportance] = useState(credit.importance);
  const [description, setDescription] = useState(
    credit.characterDescription ?? ""
  );

  return (
    <div className="mt-2 ml-3 mr-3 px-4 py-3 rounded-lg border border-accent/30 bg-accent/5 space-y-3">
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Важность
        </label>
        <div className="flex gap-2">
          {IMPORTANCE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setImportance(o.value)}
              className={`px-3 py-1 rounded-lg border text-xs transition-colors ${importance === o.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:border-accent/40"
                }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Описание роли
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="принц, восьмихвостая лиса..."
          className="w-full px-3 py-1.5 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-border text-xs hover:border-accent/40 transition-colors"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={() => onSave(credit.id, importance, description)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-3 h-3" />
          Сохранить
        </button>
      </div>
    </div>
  );
}

function importanceLabel(value: string) {
  const map: Record<string, string> = {
    lead: "главная",
    support: "второстепенная",
    guest: "эпизод",
  };
  return map[value] ?? value;
}