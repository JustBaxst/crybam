"use client";

import { useState, useTransition } from "react";
import { Save, FileText, AlertCircle } from "lucide-react";
import { updateTitles } from "./actions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-elements";
import { toast } from "sonner";

export function TitlesEditor({
  dramaId,
  currentTitles,
  onCloseAction,
}: {
  dramaId: number;
  currentTitles: string[];
  onCloseAction: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState(currentTitles.join("\n"));

  // Проверяем, изменил ли пользователь данные
  const isDirty = text !== currentTitles.join("\n");

  const handleSubmit = () => {
    setError(null);

    const formData = new FormData();
    formData.set("dramaId", String(dramaId));
    formData.set("titles", text);

    startTransition(async () => {
      const result = await updateTitles(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Названия обновлены");
        onCloseAction();
      }
    });
  };

  return (
    <Modal
      isOpen={true}
      onCloseAction={onCloseAction}
      title="Альтернативные названия"
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
          label="Названия (каждое с новой строки)"
          description="Каждое новое название пиши с новой строки (Enter). Запятые внутри названия сохраняются."
        >
          <FormTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={"It's Okay to Not Be Okay\n사이코지만 괜찮아"}
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
