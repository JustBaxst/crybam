"use client";

import { useState } from "react";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { DeleteDramaModal } from "./DeleteDramaModal";

export function DramaActions({
  dramaId,
  dramaTitle
}: {
  dramaId: number;
  dramaTitle: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-end relative">
      <ActionDropdown
        editHref={`/admin/dramas/${dramaId}`}
        onDeleteClick={() => setModalOpen(true)}
      />

      {modalOpen && (
        <DeleteDramaModal
          dramaId={dramaId}
          dramaTitle={dramaTitle}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}