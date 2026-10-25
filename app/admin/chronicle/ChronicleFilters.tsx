"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type UserOption = { id: number; name: string };

export function ChronicleFilters({ users }: { users: UserOption[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentAction = searchParams.get("action") || "all";
    const currentUserId = searchParams.get("userId") || "all";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const inputCls = "px-3 py-1.5 rounded-lg border border-border bg-surface text-sm outline-none focus:border-accent transition-colors cursor-pointer";

    return (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
            <select
                value={currentAction}
                onChange={(e) => updateFilter("action", e.target.value)}
                className={inputCls}
            >
                <option value="all">Все действия</option>
                <option value="DRAMA_COMPLETED">✨ Завершение карточек</option>
                <option value="DRAMA_CREATED">🎬 Добавление дорам</option>
                <option value="PERSON_CREATED">👤 Добавление актеров</option>
                <option value="CHARACTER_CREATED">🎭 Добавление персонажей</option>
            </select>

            <select
                value={currentUserId}
                onChange={(e) => updateFilter("userId", e.target.value)}
                className={inputCls}
            >
                <option value="all">Все авторы</option>
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>
        </div>
    );
}