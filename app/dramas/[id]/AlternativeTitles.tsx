"use client";

import { Tooltip } from "@/components/Tooltip";
import { toast } from "sonner"; // ← Импортируем тост

type TitleData = {
  id: number;
  title: string;
  language: string | null;
};

export function AlternativeTitles({ 
  titles, 
  label = "Другие названия:" 
}: { 
  titles: TitleData[]; 
  label?: string 
}) {
  if (titles.length === 0) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Вместо зеленой рамки показываем красивый тост
    toast.success(`«${text}» скопировано`); 
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 mt-3 text-sm text-muted">
      <span className="text-xs text-muted/70">{label}</span>
      
      {titles.map((t) => (
        <Tooltip key={t.id} content={t.title}>
          <button
            onClick={() => handleCopy(t.title)}
            className="text-[10px] px-2 py-0.5 rounded border transition-colors uppercase tracking-wider border-border bg-surface hover:border-accent/40 hover:text-accent"
          >
            {t.language && t.language !== "unknown" ? t.language : "??"}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}