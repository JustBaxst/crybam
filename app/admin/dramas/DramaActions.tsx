"use client";

import { useState, useTransition } from "react";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteDrama } from "@/app/admin/actions";
import { toast } from "sonner";

export function DramaActions({
  dramaId,
  dramaTitle,
}: {
  dramaId: number;
  dramaTitle: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
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
        setModalOpen(false);
      }
    });
  };

  return (
    <div className="flex items-center justify-end relative">
      <ActionDropdown
        editHref={`/admin/dramas/${dramaId}`}
        onDeleteClick={() => setModalOpen(true)}
      />

      <ConfirmDialog
        isOpen={modalOpen}
        onCloseAction={() => setModalOpen(false)}
        onConfirmAction={handleDelete}
        title="Удалить дораму?"
        description={`«${dramaTitle}» будет скрыта из базы, каталога и поиска. Вы уверены?`}
        confirmText="Удалить"
        isPending={isPending}
      />
    </div>
  );
}
