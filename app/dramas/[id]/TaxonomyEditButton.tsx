"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { TaxonomyEditor } from "./TaxonomyEditor";

export function TaxonomyEditButton({
  dramaId,
  title,
  allItems,
  linkedIds,
  fieldName,
  action,
  prefix,
}: {
  dramaId: number;
  title: string;
  allItems: { id: number; name: string }[];
  linkedIds: number[];
  fieldName: "genre" | "mood" | "theme";
  action: (formData: FormData) => Promise<any>;
  prefix?: string;
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
        <TaxonomyEditor
          dramaId={dramaId}
          title={title}
          allItems={allItems}
          linkedIds={linkedIds}
          fieldName={fieldName}
          action={action}
          prefix={prefix}
          onCloseAction={() => setOpen(false)}
        />
      )}
    </>
  );
}
