"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditEntryForm } from "./EditEntryForm";

type EntryData = {
  status: string;
  rating: number | null;
  cryTag: string | null;
  impression: string | null;
  review: string | null;
  quote: string | null;
  notes: string | null;
  progress: number | null;
  rewatchCount: number;
  startedAt: Date | null;
  watchedAt: Date | null;
};

export function EditEntryButton({
  dramaId,
  entry,
}: {
  dramaId: number;
  entry: EntryData | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-sm font-medium hover:bg-accent/15 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        {entry ? "Редактировать" : "Добавить в дневник"}
      </button>

      {open && (
        <EditEntryForm
          dramaId={dramaId}
          entry={entry}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}