"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, Play, CheckCircle, Pause, XCircle, Trash2 } from "lucide-react";
import { quickSetStatus, removeEntry } from "@/app/dramas/[id]/actions";
import { Tooltip } from "@/components/Tooltip";

const STATUS_ACTIONS = [
    { value: "planned", label: "В планах", Icon: Clock },
    { value: "watching", label: "Смотрю", Icon: Play },
    { value: "watched", label: "Просмотрено", Icon: CheckCircle },
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
            router.refresh(); // Обновляем данные страницы
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
                    <Tooltip key={action.value} content={action.label}>
                        <button
                            onClick={() => handleSetStatus(action.value)}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isActive
                                    ? "bg-accent text-white shadow-sm scale-105"
                                    : "text-muted hover:bg-accent/15 hover:text-accent"
                                }`}
                        >
                            <action.Icon className="w-4 h-4" />
                        </button>
                    </Tooltip>
                );
            })}

            {/* Разделитель */}
            <div className="w-px h-5 bg-border/80 mx-0.5" />

            <Tooltip content="Удалить из дневника">
                <button
                    onClick={handleRemove}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:bg-red-500/15 hover:text-red-400 transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </Tooltip>
        </div>
    );
}