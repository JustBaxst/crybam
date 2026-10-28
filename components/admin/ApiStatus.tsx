"use client";

import { useState } from "react";
import { Server, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Список сервисов (легко добавлять новые)
const SERVICES = ["TVmaze", "YouTube", "Spotify", "Яндекс.Музыка"];

export function ApiStatus() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Имитация запроса к API
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success("Статус всех сервисов обновлен. Все системы в норме.");
        }, 1000);
    };

    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-accent" />
                    Статус API
                </h2>

                {/* Контейнер для плашек (flex-wrap позволит им переноситься на новую строку) */}
                <div className="flex flex-wrap gap-2">
                    {SERVICES.map((service) => (
                        <div
                            key={service}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {service}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="mt-6 w-full flex items-center justify-center gap-2 p-2 h-10 rounded-xl bg-background border border-border hover:border-accent/40 transition-colors text-sm text-muted hover:text-foreground disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Обновление..." : "Обновить"}
            </button>
        </div>
    );
}