"use client";

import { useState, useTransition } from "react";
import { UserPlus, Trash2, Pencil, Save, Users } from "lucide-react";
import { addCredit, removeCredit, updateCredit } from "./actions";
import { CREDIT_ROLES, getCreditRoleLabel } from "@/lib/credit-roles";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormField, FormInput, FormError } from "@/components/ui/form-elements";
import { toast } from "sonner";

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
  onCloseAction,
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
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [roleType, setRoleType] = useState<string>("actor");
  const [importance, setImportance] = useState<Importance>("lead");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
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
        toast.success("Участник добавлен");
        form.reset();
        setRoleType("actor");
        setImportance("lead");
        setIsDirty(false);
      }
    });
  };

  const handleRemove = (creditId: number) => {
    const formData = new FormData();
    formData.set("creditId", String(creditId));
    formData.set("dramaId", String(dramaId));
    startTransition(async () => {
      await removeCredit(formData);
      toast.success("Участник удален");
    });
  };

  const handleUpdate = (
    creditId: number,
    importanceValue: string,
    characterDescription: string,
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
        toast.success("Данные обновлены");
        setEditingId(null);
        setError(null);
      }
    });
  };

  const grouped = {
    actor: credits.filter((c) => c.roleType === "actor"),
    director: credits.filter((c) => c.roleType === "director"),
    writer: credits.filter((c) => c.roleType === "writer"),
  };

  return (
    <Modal
      isOpen={true}
      onCloseAction={onCloseAction}
      title="Съёмочная группа"
      icon={<Users className="w-5 h-5" />}
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
        {/* ─── ЛЕВАЯ КОЛОНКА: СПИСОК ─── */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {credits.length === 0 ? (
            <p className="text-sm text-muted italic text-center py-10">
              В группе пока никого нет.
            </p>
          ) : (
            (["actor", "director", "writer"] as const).map((type) => {
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
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    {label}
                  </p>
                  <div className="space-y-2">
                    {list.map((c) => (
                      <div key={c.id}>
                        <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors">
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-foreground">
                              {c.personName}
                            </span>
                            {c.characterName && (
                              <span className="text-sm text-accent ml-2">
                                → {c.characterName}
                              </span>
                            )}
                            <div className="text-[11px] text-muted mt-0.5">
                              {importanceLabel(c.importance)}
                            </div>
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
                              className="w-7 h-7 rounded-md border border-border hover:border-danger/40 hover:text-danger flex items-center justify-center transition-colors disabled:opacity-50"
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
            })
          )}
        </div>

        {/* ─── ПРАВАЯ КОЛОНКА: ДОБАВЛЕНИЕ ─── */}
        <div className="bg-surface/30 border border-border/50 rounded-2xl p-5 sticky top-0">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-accent" /> Добавить участника
          </h3>

          <form
            id="add-credit-form"
            onSubmit={handleAdd}
            className="space-y-4"
            onChange={() => setIsDirty(true)}
          >
            <FormField label="Тип роли">
              <Select
                value={roleType}
                onChangeAction={(val) => setRoleType(val)}
                options={CREDIT_ROLES.map((r) => ({
                  value: r.value,
                  label: r.label,
                }))}
              />
            </FormField>

            {roleType === "actor" && (
              <FormField label="Важность роли">
                <div className="flex gap-2">
                  {IMPORTANCE_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setImportance(o.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        importance === o.value
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-border text-muted hover:border-accent/40"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </FormField>
            )}

            <FormField
              label={
                roleType === "actor"
                  ? "Имя актёра"
                  : roleType === "director"
                    ? "Имя режиссёра"
                    : "Имя сценариста"
              }
              required
            >
              <FormInput
                type="text"
                name="personName"
                list="persons-list"
                required
                placeholder="Начни вводить имя"
              />
              <datalist id="persons-list">
                {existingPersons.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </FormField>

            {roleType === "actor" && (
              <>
                <FormField label="Имя персонажа (опционально)">
                  <FormInput
                    type="text"
                    name="characterName"
                    placeholder="Ко Мун-ён"
                  />
                </FormField>
                <FormField label="Описание роли (опционально)">
                  <FormInput
                    type="text"
                    name="characterDescription"
                    placeholder="принц, восьмихвостая лиса..."
                  />
                </FormField>
              </>
            )}

            <FormError error={error} />

            <Button type="submit" disabled={isPending} className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              {isPending ? "Добавление..." : "Добавить"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
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
    credit.characterDescription ?? "",
  );

  return (
    <div className="mt-2 ml-3 mr-3 px-4 py-3 rounded-xl border border-accent/30 bg-accent/5 space-y-3">
      <FormField label="Важность">
        <div className="flex gap-2">
          {IMPORTANCE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setImportance(o.value)}
              className={`px-3 py-1 rounded-lg border text-xs transition-colors ${
                importance === o.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:border-accent/40"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Описание роли">
        <FormInput
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="принц, восьмихвостая лиса..."
          className="py-1.5"
        />
      </FormField>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onSave(credit.id, importance, description)}
          disabled={disabled}
        >
          <Save className="w-3 h-3 mr-1.5" />
          Сохранить
        </Button>
      </div>
    </div>
  );
}

function importanceLabel(value: string) {
  const map: Record<string, string> = {
    lead: "Главная роль",
    support: "Второстепенная роль",
    guest: "Эпизодическая роль",
  };
  return map[value] ?? value;
}
