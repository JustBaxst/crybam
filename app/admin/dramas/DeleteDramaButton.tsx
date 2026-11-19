"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteDrama } from "../actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export function DeleteDramaButton({
  dramaId,
  dramaTitle,
}: {
  dramaId: number;
  dramaTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("dramaId", String(dramaId));

      const res = await deleteDrama(formData);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Дорама «${dramaTitle}» удалена`);
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-md border border-border hover:border-danger/40 hover:text-danger flex items-center justify-center transition-colors"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <ConfirmDialog
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={handleDelete}
        title="Удалить дораму?"
        description={`«${dramaTitle}» будет скрыта из базы, каталога и поиска. Вы уверены?`}
        confirmText="Удалить"
        isPending={isPending}
      />
    </>
  );
}
