"use client";

import { useState, useEffect } from "react";
import { Server, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { checkApiStatus, type ServiceStatus } from "@/app/admin/actions";

export function ApiStatus() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [services, setServices] = useState<ServiceStatus[]>([]);

    const loadStatuses = async (showToast = false) => {
        setIsRefreshing(true);
        try {
            const results = await checkApiStatus();
            setServices(results);

            if (showToast) {
                const hasErrors = results.some((s) => !s.isOnline);
                if (hasErrors) {
                    toast.warning("Некоторые сервисы недоступны!");
                } else {
                    toast.success("Все системы в норме.");
                }
            }
        } catch {
            toast.error("Не удалось проверить статус API.");
        } finally {
            setIsRefreshing(false);
        }
    };

    // Проверяем при первой загрузке (без тоста, чтобы не спамить)
    useEffect(() => {
        loadStatuses(false);
    }, []);

    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-accent" />
                    Статус API
                </h2>

                <div className="flex flex-wrap gap-2">
                    {/* Если данные еще грузятся, показываем скелетон */}
                    {services.length === 0 && isRefreshing ? (
                        <div className="text-sm text-muted animate-pulse">Проверка сервисов...</div>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.name}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${service.isOnline
                                    ? "bg-green-500/10 border-green-500/20 text-green-500"
                                    : "bg-red-500/10 border-red-500/20 text-red-500"
                                    }`}
                                title={service.isOnline ? "Доступен" : "Недоступен"}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full animate-pulse ${service.isOnline ? "bg-green-500" : "bg-red-500"
                                        }`}
                                />
                                {service.name}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button
                onClick={() => loadStatuses(true)}
                disabled={isRefreshing}
                className="mt-6 w-full flex items-center justify-center gap-2 p-2 h-10 rounded-xl bg-background border border-border hover:border-accent/40 transition-colors text-sm text-muted hover:text-foreground disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Проверка..." : "Обновить"}
            </button>
        </div>
    );
}