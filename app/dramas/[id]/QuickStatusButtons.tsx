"use client";

import { useTransition } from "react";
import { PlayCircle, Clock, Eye } from "lucide-react";
import { quickSetStatus } from "./actions";

const STATUSES = [
  { value: "watching", label: "Смотрю", Icon: PlayCircle },
  { value: "planned", label: "В планах", Icon: Clock },
  { value: "watched", label: "Просмотрено", Icon: Eye },
];

export function QuickStatusButtons({
  dramaId,
  currentStatus,
  compact = false,
}: {
  dramaId: number;
  currentStatus: string | null;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const setStatus = (status: string) => {
    const formData = new FormData();
    formData.set("dramaId", String(dramaId));
    formData.set("status", status);

    startTransition(async () => {
      await quickSetStatus(formData);
    });
  };

  const btnCls = compact
    ? "px-3 py-1.5 text-xs gap-1.5"
    : "px-5 py-2.5 text-sm gap-2";
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {STATUSES.map((s) => {
        const isActive = currentStatus === s.value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatus(s.value)}
            disabled={isPending}
            className={`inline-flex items-center rounded-lg font-medium transition-colors disabled:opacity-50 ${btnCls} ${
              isActive
                ? "bg-accent text-white"
                : "border border-border bg-surface hover:border-accent/40"
            }`}
          >
            <s.Icon className={iconSize} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}