"use client";

import { useState, useTransition } from "react";
import { Save, FileText, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-elements";
import { toast } from "sonner";

export function AliasEditor({
  title,
  description,
  placeholder,
  entityId,
  idField,
  fieldName,
  currentAliases,
  action,
  onCloseAction,
}: {
  title: string;
  description: string;
  placeholder: string;
  entityId: number;
  idField: "dramaId" | "personId" | "characterId";
  fieldName: "titles" | "aliases";
  currentAliases: string[];
  action: (formData: FormData) => Promise<any>;
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState(currentAliases.join("\n"));

  // Проверяем, изменил ли пользователь данные
  const isDirty = text !== currentAliases.join("\n");

  const handleSubmit = () => {
    setError(null);

    const formData = new FormData();
    formData.set(idField, String(entityId));
    formData.set(fieldName, text);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Успешно обновлено");
        onCloseAction();
      }
    });
  };

  return (
    <Modal
      isOpen={true}
      onCloseAction={onCloseAction}
      title={title}
      icon={<FileText className="w-5 h-5" />}
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
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </>
      )}
    >
      <div className="space-y-4">
        <FormField
          label="Значения (каждое с новой строки)"
          description={description}
        >
          <FormTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={placeholder}
            autoFocus
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
