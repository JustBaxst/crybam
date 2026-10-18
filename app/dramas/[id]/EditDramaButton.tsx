"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditDramaForm } from "./EditDramaForm";

type DramaData = {
  title: string;
  year: number | null;
  country: string | null;
  episodes: number | null;
  seasons: number | null;
  episodeDuration: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  airedFrom: Date | null;
  airedTo: Date | null;
  ratingKinopoisk: number | null;
  ratingMDL: number | null;
  ratingIMDB: number | null;
  ratingDouban: number | null;
  dubbingStudios: string | null;
  airStatus: string;
  curatorCryTag: string | null;
};

export function EditDramaButton({
  dramaId,
  drama,
}: {
  dramaId: number;
  drama: DramaData;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:border-accent/40 hover:text-foreground transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Редактировать
      </button>

      {open && (
        <EditDramaForm
          dramaId={dramaId}
          drama={drama}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}