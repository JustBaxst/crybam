"use client";

import { useState, useTransition } from "react";
import { Rating } from "@/components/ui/rating";
import { rateDrama } from "@/app/dramas/[id]/actions";
import { toast } from "sonner";

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
        // Имитация проверки авторизации (в будущем заменим на реальную)
        const isAuthorized = true;
        if (!isAuthorized) {
            toast.info("Войдите, чтобы сохранить оценку");
            return;
        }

        setCurrentRating(val); // Оптимистично обновляем UI

        startTransition(async () => {
            const res = await rateDrama(dramaId, val);
            if (res?.success) {
                toast.success("Оценка сохранена!");
            } else {
                toast.error("Не удалось сохранить оценку");
            }
        });
    };

    return (
        <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
            <Rating initialValue={currentRating} onChange={handleRate} />
        </div>
    );
}