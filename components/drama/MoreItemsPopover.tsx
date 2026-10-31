"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MoreItemsPopover({
    hiddenItems,
    title
}: {
    hiddenItems: string[];
    title?: string;
}) {
    if (hiddenItems.length === 0) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="text-accent hover:underline text-xs font-semibold cursor-pointer">
                    +{hiddenItems.length}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-surface border border-border rounded-xl shadow-lg" align="start">
                {title && (
                    <h4 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">
                        {title}
                    </h4>
                )}
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
                    {hiddenItems.map((item, i) => (
                        <span key={i} className="text-sm text-foreground">{item}</span>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}