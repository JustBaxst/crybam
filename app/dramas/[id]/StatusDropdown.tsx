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

    // Показываем прогресс только если смотрим (или пересматриваем)
    const isWatching = entry?.status === "watching";
    const isRewatching = isWatching && (entry?.rewatchCount || 0) > 0;

    return (
        <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center">
                {!entry ? (
                    <div className="flex items-center gap-2">
                        {/* Кнопка добавления */}
                        <button
                            onClick={() => setStatus("planned")}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            Добавить в дневник
                        </button>

                        {/* Стрелочка для выбора другого статуса */}

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    disabled={isPending}
                                    className="p-2 rounded-lg bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 transition-colors disabled:opacity-50"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    align="start"
                                    className="w-40 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1"
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
                    // Если запись есть — показываем текущий статус
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-sm font-medium hover:bg-accent/15 transition-colors disabled:opacity-50"
                            >
                                {currentStatusObj && <currentStatusObj.Icon className="w-4 h-4" />}
                                {currentStatusObj?.label || entry.status}
                                <ChevronDown className="w-4 h-4 opacity-70" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="start"
                                className="w-40 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1"
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
            </div>

            {/* Блок прогресса (Серии / +) */}
            {isWatching && totalEpisodes > 0 && (
                <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="font-medium">
                        {isRewatching ? "Пересматриваю" : "Серии"} · {progress} / {totalEpisodes}
                    </span>
                    <button
                        onClick={handleIncrement}
                        disabled={isPending || progress >= totalEpisodes}
                        className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors disabled:opacity-50"
                        title="Отметить просмотренную серию"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}