"use client";

import { useState, useTransition } from "react";
import { Plus, Crown } from "lucide-react";
import { toggleFavoriteActor } from "@/app/people/[id]/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FavoriteActorButton({
    personId,
    initialIsFavorite
}: {
    personId: number;
    initialIsFavorite: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const handleToggle = () => {
        // Сразу меняем состояние кнопки (оптимистично)
        setIsFavorite(!isFavorite);

        startTransition(async () => {
            const res = await toggleFavoriteActor(personId);
            if (res.success) {
                if (res.isFavorite) {
                    toast.success("Актер добавлен в избранное");
                } else {
                    toast.info("Актер удален из избранного");
                }
            } else {
                setIsFavorite(isFavorite); // Откатываем при ошибке
                toast.error("Не удалось обновить избранное");
            }
        });
    };

    return (
        <Button
            variant="outline"
            onClick={handleToggle}
            disabled={isPending}
            className={`w-full h-10 gap-2 transition-all cursor-pointer ${isFavorite
                ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/40 hover:bg-yellow-400/20 hover:text-yellow-400"
                : "text-muted hover:text-foreground hover:border-accent/40"
                }`}
        >
            {isFavorite ? (
                <Crown className="w-4 h-4 shrink-0" />
            ) : (
                <Plus className="w-4 h-4 shrink-0" />
            )}
            {isFavorite ? "Любимый актер" : "В избранное"}
        </Button>
    );
}