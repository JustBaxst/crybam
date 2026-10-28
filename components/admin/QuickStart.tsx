import Link from "next/link";
import { Plus, ArrowRight, Zap } from "lucide-react";
import { FixRandomButton } from "./FixRandomButton";

const actionLink = "flex items-center justify-between p-3 h-10 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group";

export function QuickStart() {
    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-accent" />
                Быстрый старт
            </h2>
            <div className="flex flex-col gap-3 flex-1">
                <Link href="/admin/dramas/new" className={actionLink}>
                    <span className="font-medium flex items-center gap-2"><Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" /> Добавить дораму</span>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                </Link>
                <Link href="/admin/people/new" className={actionLink}>
                    <span className="font-medium flex items-center gap-2"><Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" /> Добавить актера</span>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                </Link>
                <Link href="/admin/characters/new" className={actionLink}>
                    <span className="font-medium flex items-center gap-2"><Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" /> Добавить персонажа</span>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                </Link>
                <div className="mt-auto pt-3">
                    <FixRandomButton />
                </div>
            </div>
        </div>
    );
}