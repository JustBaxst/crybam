"use client";

import { useState } from "react";
import { Tooltip } from "@/components/Tooltip";

type TitleData = {
  id: number;
  title: string;
  language: string | null;
};

export function AlternativeTitles({ titles }: { titles: TitleData[] }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (titles.length === 0) return null;

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 500);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 mt-3 text-sm text-muted">
      <span className="text-xs text-muted/70">Другие названия:</span>
      
      {titles.map((t) => (
        <Tooltip key={t.id} content={t.title}>
          <button
            onClick={() => handleCopy(t.id, t.title)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${
              copiedId === t.id
                ? "border-green-500/50 bg-green-500/10 text-green-400"
                : "border-border bg-surface hover:border-accent/40 hover:text-accent"
            }`}
          >
            {copiedId === t.id
              ? "Скопировано"
              : t.language && t.language !== "unknown"
              ? t.language
              : "??"}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}