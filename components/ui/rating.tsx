"use client";

import { useState } from "react";

export function Rating({
    initialValue = 0,
    onChange
}: {
    initialValue?: number | null;
    onChange?: (val: number) => void;
}) {
    const [hoverValue, setHoverValue] = useState(0);
    const displayValue = hoverValue || initialValue || 0;

    return (
        <div className="flex items-center gap-3 w-full">
            {/* CSS Grid гарантирует, что 10 полосок ровно заполнят доступное место */}
            <div
                className="grid grid-cols-10 gap-1 cursor-pointer flex-1"
                onMouseLeave={() => setHoverValue(0)}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    const handleInteraction = (e: React.MouseEvent<HTMLDivElement>, isHover: boolean) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const isLeftHalf = clickX < rect.width / 2;
                        const newValue = isLeftHalf ? val - 0.5 : val;

                        if (isHover) setHoverValue(newValue);
                        else onChange?.(newValue);
                    };

                    return (
                        <div
                            key={val}
                            onMouseMove={(e) => handleInteraction(e, true)}
                            onClick={(e) => handleInteraction(e, false)}
                            className="relative h-7 w-full rounded-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-surface border border-border rounded-sm" />

                            {val <= Math.floor(displayValue) && (
                                <div className="absolute inset-0 bg-accent border border-accent rounded-sm" />
                            )}

                            {val === Math.ceil(displayValue) && displayValue % 1 !== 0 && (
                                <div className="absolute inset-y-0 left-0 w-1/2 bg-accent border-y border-l border-accent rounded-l-sm" />
                            )}
                        </div>
                    );
                })}
            </div>

            <span className="text-sm font-semibold tabular-nums text-foreground whitespace-nowrap min-w-14 text-right shrink-0">
                {displayValue > 0 ? `${displayValue} / 10` : ""}
            </span>
        </div>
    );
}