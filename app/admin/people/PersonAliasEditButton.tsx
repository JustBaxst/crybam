"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { PersonAliasEditor } from "./PersonAliasEditor";

export function PersonAliasEditButton({
  personId,
  currentAliases,
}: {
  personId: number;
  currentAliases: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 transition-colors text-sm text-muted hover:text-foreground"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Другие имена</span>
      </button>
      {isOpen && (
        <PersonAliasEditor
          personId={personId}
          currentAliases={currentAliases}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}