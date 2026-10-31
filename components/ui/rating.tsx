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

    // Показываем либо наведенное значение, либо сохраненное
    const displayValue = hoverValue || initialValue || 0;

    return (
        <div className="flex items-center gap-3">
            <div
                className="flex gap-1.5 cursor-pointer"
                onMouseLeave={() => setHoverValue(0)}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    // Полоска закрашена, если она меньше или равна текущему значению
                    const isFilled = val <= displayValue;
                    return (
                        <div
                            key={val}
                            onMouseEnter={() => setHoverValue(val)}
                            onClick={() => onChange?.(val)}
                            className={`h-2.5 w-6 rounded-sm transition-all duration-200 ${isFilled ? "bg-accent" : "bg-border/50"
                                }`}
                        />
                    );
                })}
            </div>

            {/* Показывает цифру (например, 8.4) */}
            <span className="text-sm font-bold text-accent w-8">
                {displayValue > 0 ? (hoverValue || initialValue) : ""}
            </span>
        </div>
    );
}