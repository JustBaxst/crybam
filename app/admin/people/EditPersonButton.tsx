"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditPersonForm } from "./EditPersonForm";

export function EditPersonButton({ person }: { person: any }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:border-accent/40 hover:text-foreground transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" /> Редактировать
      </button>
      {open && (
        <EditPersonForm person={person} onCloseAction={() => setOpen(false)} />
      )}
    </>
  );
}
