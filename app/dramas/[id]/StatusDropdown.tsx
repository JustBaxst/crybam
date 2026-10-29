"use client";

import { useTransition } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus, PlayCircle, Clock, Eye, XCircle, PauseCircle, Check } from "lucide-react";
import { quickSetStatus, incrementProgress } from "./actions";

const STATUSES = [
    { value: "watching", label: "Смотрю", Icon: PlayCircle },
    { value: "planned", label: "В планах", Icon: Clock },
    { value: "watched", label: "Просмотрено", Icon: Eye },
    { value: "on_hold", label: "Отложено", Icon: PauseCircle },
    { value: "dropped", label: "Брошено", Icon: XCircle },
];

type EntryData = {
    status: string;
    progress: number | null;
    rewatchCount: number;
};

export function StatusDropdown({
    dramaId,
    entry,
    episodes,
}: {
    dramaId: number;
    entry: EntryData | null;
    episodes: number | null;
}) {
    const [isPending, startTransition] = useTransition();

    const setStatus = (status: string) => {
        const formData = new FormData();
        formData.set("dramaId", String(dramaId));
        formData.set("status", status);
        startTransition(async () => {
            await quickSetStatus(formData);
        });
    };

    const handleIncrement = () => {
        startTransition(async () => {
            await incrementProgress(dramaId);
        });
    };

    const currentStatusObj = entry ? STATUSES.find(s => s.value === entry.status) : null;
    const progress = entry?.progress || 0;
    const totalEpisodes = episodes || 0;

    const isWatching = entry?.status === "watching";
    const isRewatching = isWatching && (entry?.rewatchCount || 0) > 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            {!entry ? (
                <div className="flex items-center w-full">
                    <button
                        onClick={() => setStatus("planned")}
                        disabled={isPending}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-l-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Добавить
                    </button>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                disabled={isPending}
                                className="px-3 py-2.5 rounded-r-xl bg-accent text-white border-l border-white/20 hover:bg-accent/90 transition-colors disabled:opacity-50"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="center"
                                className="w-44 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1"
                            >
                                {STATUSES.map((s) => (
                                    <DropdownMenu.Item
                                        key={s.value}
                                        onSelect={() => setStatus(s.value)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors outline-none cursor-pointer data-highlighted:bg-foreground/5"
                                    >
                                        <s.Icon className="w-4 h-4 text-muted" />
                                        {s.label}
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            ) : (
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            disabled={isPending}
                            className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-foreground/5 transition-all text-sm font-medium disabled:opacity-50"
                        >
                            <div className="flex items-center gap-2">
                                {currentStatusObj && <currentStatusObj.Icon className="w-4 h-4 text-accent" />}
                                {currentStatusObj?.label || entry.status}
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="center"
                            className="w-44 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1"
                        >
                            {STATUSES.map((s) => (
                                <DropdownMenu.Item
                                    key={s.value}
                                    onSelect={() => setStatus(s.value)}
                                    className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors outline-none cursor-pointer data-highlighted:bg-foreground/5"
                                >
                                    <div className="flex items-center gap-2">
                                        <s.Icon className="w-4 h-4 text-muted" />
                                        {s.label}
                                    </div>
                                    {entry.status === s.value && <Check className="w-4 h-4 text-accent" />}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            )}

            {/* Блок прогресса */}
            {isWatching && totalEpisodes > 0 && (
                <div className="flex items-center justify-between px-1 text-sm text-muted">
                    <span className="font-medium">
                        {isRewatching ? "Пересм." : "Серии:"} {progress} / {totalEpisodes}
                    </span>
                    <button
                        onClick={handleIncrement}
                        disabled={isPending || progress >= totalEpisodes}
                        className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors disabled:opacity-50"
                        title="Отметить просмотренную серию"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}