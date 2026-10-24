import { Globe } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

export function AliasBadge({ aliases }: { aliases: string[] }) { // ← Теперь это массив строк
  if (!aliases || aliases.length === 0) {
    return <span className="text-muted/30">—</span>;
  }

  return (
    <Tooltip
      content={
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {aliases.map((name, i) => (
            <span key={i} className="text-xs">• {name}</span>
          ))}
        </div>
      }
    >
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border text-xs text-muted hover:text-foreground transition-colors cursor-help">
        <Globe className="w-3.5 h-3.5 text-accent" />
        <span className="font-semibold">{aliases.length}</span>
      </div>
    </Tooltip>
  );
}