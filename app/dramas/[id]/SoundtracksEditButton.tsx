"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { SoundtracksEditor } from "./SoundtracksEditor";

export function SoundtracksEditButton({
  dramaId,
  soundtracks,
}: {
  dramaId: number;
  soundtracks: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-muted hover:border-accent/40 hover:text-foreground">
        <Pencil className="w-3 h-3" />
        Изменить
      </button>
      {open && (
        <SoundtracksEditor dramaId={dramaId} soundtracks={soundtracks} onClose={() => setOpen(false)} />
      )}
    </>
  );
}