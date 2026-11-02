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
        // Убрали backdrop-blur, поставили bg-black/50 для прозрачности без тормозов
        <div className={`flex items-center justify-between bg-black/50 border border-white/10 rounded-xl p-1 w-full shadow-lg transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`}>

            {STATUS_ACTIONS.map((action) => {
                const isActive = currentStatus === action.value;
                return (
                    <div key={action.value} className="relative group/btn flex justify-center">
                        <button
                            onClick={() => handleSetStatus(action.value)}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${isActive
                                ? "bg-accent text-white shadow-sm scale-105"
                                : "text-white/70 hover:bg-white/20 hover:text-white"
                                }`}
                        >
                            <action.Icon className="w-4 h-4" />
                        </button>

                        {/* Тултип статуса без размытия */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                            <span className="bg-zinc-800/95 text-white text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10 shadow-xl whitespace-nowrap">
                                {action.label}
                            </span>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800/95" />
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

                {/* Тултип удаления без размытия */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                    <span className="bg-red-950/95 text-red-200 text-[10px] font-medium px-2.5 py-1 rounded-md border border-red-500/20 shadow-xl whitespace-nowrap">
                        Удалить
                    </span>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-950/95" />
                </div>
            </div>

        </div>
    );
}