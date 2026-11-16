"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { quickSetStatus, removeEntry } from "@/app/dramas/[id]/actions";
import { DRAMA_STATUSES, type DramaStatus } from "@/lib/drama-status";

export function CardStatusToolbar({
  dramaId,
  currentStatus,
}: {
  dramaId: number;
  currentStatus?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSetStatus = (status: string) => {
    const formData = new FormData();
    formData.set("dramaId", String(dramaId));
    formData.set("status", status);

    startTransition(async () => {
      await quickSetStatus(formData);
      router.refresh();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeEntry(dramaId);
      router.refresh();
    });
  };

  // Берем статусы из нашего словаря, убирая "planned", так как это дефолт
  const statusActions = Object.entries(DRAMA_STATUSES)
    .filter(([key]) => key !== "planned")
    .map(([key, config]) => ({
      value: key,
      label: config.label,
      Icon: config.Icon,
    }));

  return (
    <div
      className={`flex items-center justify-between bg-surface/20 backdrop-blur-md border border-white/10 rounded-xl p-1 w-full shadow-lg transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      {statusActions.map((action) => {
        const isActive = currentStatus === action.value;
        return (
          <div
            key={action.value}
            className="relative group/btn flex justify-center"
          >
            <button
              onClick={() => handleSetStatus(action.value)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer border ${
                isActive
                  ? "bg-accent border-accent text-white shadow-md scale-105"
                  : "bg-surface/20 border-white/10 text-white/70 hover:bg-surface/40 hover:border-accent/40 hover:text-white"
              }`}
            >
              <action.Icon className="w-4 h-4" />
            </button>

            {/* Тултип статуса (заменен zinc на surface) */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
              <span className="bg-surface text-foreground text-[10px] font-medium px-2.5 py-1 rounded-md border border-border shadow-xl whitespace-nowrap">
                {action.label}
              </span>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-surface" />
            </div>
          </div>
        );
      })}

      {/* Разделитель */}
      <div className="w-px h-5 bg-white/20 mx-0.5" />

      <div className="relative group/btn flex justify-center">
        <button
          onClick={handleRemove}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:bg-red-500/30 hover:text-red-100 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Тултип удаления (заменен red-950 на surface с красным акцентом) */}
        <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
          <span className="bg-surface text-red-400 text-[10px] font-medium px-2.5 py-1 rounded-md border border-red-500/30 shadow-xl whitespace-nowrap">
            Удалить
          </span>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-surface" />
        </div>
      </div>
    </div>
  );
}
