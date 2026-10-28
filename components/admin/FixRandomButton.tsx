"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Wrench, ArrowRight } from "lucide-react";
import { fixRandomDrama } from "@/app/admin/actions";
import { toast } from "sonner";

export function FixRandomButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            const result = await fixRandomDrama();
            if (result?.error) {
                toast.info(result.error);
            } else if (result?.dramaId) {
                router.push(`/admin/dramas/${result.dramaId}`);
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="w-full flex items-center justify-between p-3 h-10 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group font-medium"
        >
            {/* Возвращаем иконку слева и делаем стиль как у Plus */}
            <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                {isPending ? "Ищем..." : "Исправить случайную"}
            </span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
        </button>
    );
}