"use client";

import { useState, useTransition } from "react";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deletePerson } from "./actions";
import { toast } from "sonner";

export function PersonActions({
  personId,
  personName,
}: {
  personId: number;
  personName: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
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
        setModalOpen(false);
      }
    });
  };

  return (
    <div className="flex items-center justify-end relative">
      <ActionDropdown
        editHref={`/admin/people/${personId}`}
        onDeleteClick={() => setModalOpen(true)}
      />

      <ConfirmDialog
        isOpen={modalOpen}
        onCloseAction={() => setModalOpen(false)}
        onConfirmAction={handleDelete}
        title="Удалить актера?"
        description={`«${personName}» будет скрыт из базы и каталога. Вы уверены?`}
        confirmText="Удалить"
        isPending={isPending}
      />
    </div>
  );
}
