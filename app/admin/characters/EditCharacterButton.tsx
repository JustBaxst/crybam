"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditCharacterForm } from "./EditCharacterForm";

type DramaOption = {
  id: number;
  title: string;
  year: number | null;
};

export function EditCharacterButton({
  character,
  dramas,
}: {
  character: any;
  dramas: DramaOption[];
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
        <EditCharacterForm
          character={character}
          dramas={dramas}
          onCloseAction={() => setOpen(false)}
        />
      )}
    </>
  );
}
