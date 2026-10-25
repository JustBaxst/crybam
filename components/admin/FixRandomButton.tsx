"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
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
            className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border transition-colors text-sm mt-auto text-accent font-medium disabled:opacity-50"
        >
            <span>{isPending ? "Ищем..." : "Исправить случайную"}</span>
            <Wrench className="w-4 h-4" />
        </button>
    );
}