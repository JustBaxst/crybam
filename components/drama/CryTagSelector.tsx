"use client";

import { useState, useTransition } from "react";
import { saveCryTag } from "@/app/dramas/[id]/actions";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

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

    return (
        <div className={`flex flex-col gap-1.5 w-full ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            {(Object.keys(CRY_TAGS) as CryTag[]).map((key) => {
                const config = CRY_TAGS[key];
                const isActive = selected === key;
                const Icon = config.Icon;

                return (
                    <button
                        key={key}
                        onClick={() => handleSelect(key)}
                        className={`flex items-center justify-center gap-2 h-8 w-full rounded-md border transition-all text-xs font-medium whitespace-nowrap cursor-pointer ${isActive
                            ? `${config.bg}/15 ${config.color} ${config.border}`
                            : "bg-surface border-border text-muted hover:text-foreground hover:bg-surface/80"
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                    </button>
                );
            })}
        </div>
    );
}