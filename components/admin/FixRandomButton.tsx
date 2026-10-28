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
            <span>{isPending ? "Ищем..." : "Исправить случайную"}</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
        </button>
    );
}