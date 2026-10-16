"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { CreditsEditor } from "./CreditsEditor";

export function CreditsEditButton({
  dramaId,
  credits,
  existingPersons,
}: {
  dramaId: number;
  credits: {
    id: number;
    roleType: string;
    personName: string;
    characterName: string | null;
    characterDescription: string | null;
    importance: string;
  }[];
  existingPersons: string[];
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
        <CreditsEditor
          dramaId={dramaId}
          credits={credits}
          existingPersons={existingPersons}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}