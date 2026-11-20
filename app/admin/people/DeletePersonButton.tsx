"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePerson } from "../actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

/**
 * Кнопка удаления актера с универсальным подтверждением.
 * @dontDuplicate Не использовать старые DeletePersonModal.
 */
export function DeletePersonButton({
  personId,
  personName,
}: {
  personId: number;
  personName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("personId", String(personId));

      const res = await deletePerson(formData);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Актер «${personName}» удален`);
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-md border border-border hover:border-danger/40 hover:text-danger flex items-center justify-center transition-colors cursor-pointer"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <ConfirmDialog
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={handleDelete}
        title="Удалить актера?"
        description={`«${personName}» будет скрыт из базы и каталога. Вы уверены?`}
        confirmText="Удалить"
        isPending={isPending}
      />
    </>
  );
}
