"use client";

import { useState, ReactNode } from "react";
import { AliasEditor } from "./AliasEditor";

export function AliasEditButton({
  buttonText,
  icon,
  className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-muted hover:border-accent/40 hover:text-foreground transition-colors",
  ...editorProps
}: {
  buttonText: string;
  icon: ReactNode;
  className?: string;
  title: string;
  description: string;
  placeholder: string;
  entityId: number;
  idField: "dramaId" | "personId" | "characterId";
  fieldName: "titles" | "aliases";
  currentAliases: string[];
  action: (formData: FormData) => Promise<any>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {icon}
        {buttonText}
      </button>

      {open && (
        <AliasEditor {...editorProps} onCloseAction={() => setOpen(false)} />
      )}
    </>
  );
}
