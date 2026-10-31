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
        <div className="flex items-center gap-3">
            <div
                className="flex gap-1 cursor-pointer"
                onMouseLeave={() => setHoverValue(0)}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    const isFilled = val <= displayValue;
                    return (
                        <div
                            key={val}
                            onMouseEnter={() => setHoverValue(val)}
                            onClick={() => onChange?.(val)}
                            className={`h-5 w-3.5 rounded-sm transition-all duration-200 border ${isFilled
                                ? "bg-accent border-accent"
                                : "bg-surface border-border hover:border-accent/50"
                                }`}
                        />
                    );
                })}
            </div>

            <span className="text-xs font-semibold tabular-nums text-foreground w-12">
                {displayValue > 0 ? `${displayValue} / 10` : ""}
            </span>
        </div>
    );
}