"use client";

import { useState, useTransition } from "react";
import { Save, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField, FormInput } from "@/components/ui/form-elements";

export function TaxonomyEditor({
  dramaId,
  title,
  allItems,
  linkedIds,
  fieldName,
  action,
  prefix = "",
  onClose,
}: {
  dramaId: number;
  title: string;
  allItems: { id: number; name: string }[];
  linkedIds: number[];
  fieldName: "genre" | "mood" | "theme";
  action: (formData: FormData) => Promise<any>;
  prefix?: string;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set(linkedIds));
  const [newItemsText, setNewItemsText] = useState("");

  // Отслеживаем изменения для защиты от закрытия
  const isDirty =
    newItemsText.trim() !== "" ||
    selected.size !== linkedIds.length ||
    Array.from(selected).some((id) => !linkedIds.includes(id));

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("dramaId", String(dramaId));

    // Добавляем отмеченные ID
    selected.forEach((id) => {
      formData.set(`${fieldName}_${id}`, "on");
    });

    // Добавляем новые
    if (newItemsText.trim()) {
      formData.set(`new${title}`, newItemsText); // например, newGenres
    }

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        if (result?.isJustCompleted) {
          toast.success(`Карточка полностью заполнена!`, {
            icon: <Sparkles className="w-4 h-4" />,
          });
        }
        onClose();
      }
    });
  };

  // Динамическое имя поля для новых элементов (newGenres, newMoods, newThemes)
  const newFieldName = `new${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}s`;

  return (
    <Modal
      isOpen={true}
      onCloseAction={onClose}
      title={title}
      isDirty={isDirty}
      isPending={isPending}
      maxWidth="max-w-lg"
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
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </>
      )}
    >
      <div className="space-y-6">
        {allItems.length === 0 ? (
          <p className="text-sm text-muted">
            В базе пока ничего нет — добавь первый элемент ниже.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allItems.map((item) => {
              const isOn = selected.has(item.id);
              return (
                <label
                  key={item.id}
                  className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    isOn
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted hover:border-accent/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => toggle(item.id)}
                    className="sr-only"
                  />
                  {prefix}
                  {item.name}
                </label>
              );
            })}
          </div>
        )}

        <FormField
          label="Добавить новые (через запятую)"
          description={`Например: ${fieldName === "genre" ? "Романтика, Комедия" : fieldName === "mood" ? "Уютно, Весело" : "месть, любовный треугольник"}`}
        >
          <FormInput
            value={newItemsText}
            onChange={(e) => setNewItemsText(e.target.value)}
            placeholder="Введите через запятую..."
          />
        </FormField>

        {error && (
          <p className="text-sm text-danger border border-danger/30 bg-danger/10 rounded-lg px-3 py-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
