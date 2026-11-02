"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, Play, Check, Pause, XCircle, Trash2 } from "lucide-react";
import { quickSetStatus, removeEntry } from "@/app/dramas/[id]/actions";

const STATUS_ACTIONS = [
    { value: "planned", label: "В планах", Icon: Clock },
    { value: "watching", label: "Смотрю", Icon: Play },
    { value: "watched", label: "Просмотрено", Icon: Check },
    { value: "on_hold", label: "Отложено", Icon: Pause },
    { value: "dropped", label: "Брошено", Icon: XCircle },
];

export function CardStatusToolbar({
    dramaId,
    currentStatus
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

    return (
        <div className={`flex items-center justify-between bg-surface/90 backdrop-blur-md border border-border/60 rounded-xl p-1 w-full shadow-lg transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`}>

            {STATUS_ACTIONS.map((action) => {
                const isActive = currentStatus === action.value;
                return (
                    <div key={action.value} className="relative group/btn flex justify-center">
                        <button
                            onClick={() => handleSetStatus(action.value)}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${isActive
                                ? "bg-accent text-white shadow-sm scale-105"
                                : "text-muted hover:bg-accent/15 hover:text-accent"
                                }`}
                        >
                            <action.Icon className="w-4 h-4" />
                        </button>

                        {/* Современный тултип */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                            <span className="bg-zinc-800 text-zinc-100 text-[10px] font-medium px-2 py-1 rounded-md border border-white/10 shadow-xl whitespace-nowrap">
                                {action.label}
                            </span>
                            {/* Стрелочка вниз */}
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800" />
                        </div>
                    </div>
                );
            })}

            {/* Разделитель */}
            <div className="w-px h-5 bg-border/80 mx-0.5" />

            <div className="relative group/btn flex justify-center">
                <button
                    onClick={handleRemove}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:bg-red-500/15 hover:text-red-400 transition-all cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                {/* Тултип для удаления */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                    <span className="bg-red-500/90 text-white text-[10px] font-medium px-2 py-1 rounded-md border border-red-400/20 shadow-xl whitespace-nowrap">
                        Удалить
                    </span>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500/90" />
                </div>
            </div>

        </div>
    );
}