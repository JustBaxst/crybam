"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DeleteDramaModal } from "./DeleteDramaModal";

export function DeleteDramaButton({
  dramaId,
  dramaTitle,
}: {
  dramaId: number;
  dramaTitle: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-md border border-border hover:border-red-500/40 hover:text-red-400 flex items-center justify-center transition-colors"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <DeleteDramaModal
          dramaId={dramaId}
          dramaTitle={dramaTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}