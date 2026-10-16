"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { GenresEditor } from "./GenresEditor";

export function GenresEditButton({
  dramaId,
  allGenres,
  linkedGenreIds,
}: {
  dramaId: number;
  allGenres: { id: number; name: string }[];
  linkedGenreIds: number[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-muted hover:border-accent/40 hover:text-foreground transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Изменить
      </button>

      {open && (
        <GenresEditor
          dramaId={dramaId}
          allGenres={allGenres}
          linkedGenreIds={linkedGenreIds}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}