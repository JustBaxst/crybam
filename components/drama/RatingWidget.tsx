"use client";

import { useState, useTransition } from "react";
import { Rating } from "@/components/ui/rating";
// Импортируем экшен, который мы создадим на следующем шаге
import { rateDrama } from "@/app/dramas/[id]/actions";

export function RatingWidget({
    dramaId,
    initialRating
}: {
    dramaId: number;
    initialRating?: number | null;
}) {
    const [isPending, startTransition] = useTransition();
    const [currentRating, setCurrentRating] = useState(initialRating);

    const handleRate = (val: number) => {
        // Оптимистичное обновление (сразу показываем на экране)
        setCurrentRating(val);

        // Отправляем на сервер в фоне
        startTransition(async () => {
            await rateDrama(dramaId, val);
        });
    };

    return (
        <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
            <Rating initialValue={currentRating} onChange={handleRate} />
        </div>
    );
}