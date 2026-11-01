"use client";

import { useState } from "react";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { DeletePersonModal } from "./DeletePersonModal";

export function PersonActions({
  personId,
  personName
}: {
  personId: number;
  personName: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-end relative">
      <ActionDropdown
        editHref={`/admin/people/${personId}`}
        onDeleteClick={() => setModalOpen(true)}
      />

      {modalOpen && (
        <DeletePersonModal
          personId={personId}
          personName={personName}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}