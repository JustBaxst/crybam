"use client";

import { useState, useTransition } from "react";
import { saveCryTag } from "@/app/dramas/[id]/actions";

export function CryTagSelector({
    dramaId,
    initialTag
}: {
    dramaId: number;
    initialTag?: string | null;
}) {
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState(initialTag);

    const handleSelect = (tag: string) => {
        setSelected(tag);
        startTransition(async () => {
            await saveCryTag(dramaId, tag);
        });
    };

    const options = [
        { id: "safe", label: "Безопасно" },
        { id: "bittersweet", label: "Слёзы счастья" },
        { id: "sad", label: "Рыдай" },
    ];

    return (
        <div className={`flex flex-col items-center gap-1.5 w-full ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            {options.map((opt) => {
                const isActive = selected === opt.id;

                return (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`flex items-center justify-center h-7 w-full px-2.5 rounded-md border transition-all text-[11px] font-medium whitespace-nowrap cursor-pointer ${isActive
                            ? "bg-accent/15 text-accent border-accent/40" // Акцентный цвет для выбранного
                            : "bg-surface border-border text-muted hover:text-accent hover:bg-accent/10 hover:border-accent/30" // Hover
                            }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}