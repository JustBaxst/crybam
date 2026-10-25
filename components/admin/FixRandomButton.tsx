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
            className="w-full flex items-center justify-between p-3 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 transition-all text-sm group text-accent font-medium disabled:opacity-50"
        >
            <span>{isPending ? "Ищем..." : "Исправить случайную"}</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
        </button>
    );
}