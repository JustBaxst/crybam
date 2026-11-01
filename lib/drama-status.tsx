import { PlayCircle, Clock, Eye, PauseCircle, XCircle, type LucideIcon } from "lucide-react";

export type DramaStatus = "watching" | "planned" | "watched" | "on_hold" | "dropped";

export const DRAMA_STATUSES: Record<DramaStatus, { label: string; Icon: LucideIcon }> = {
    watching: { label: "Смотрю", Icon: PlayCircle },
    planned: { label: "В планах", Icon: Clock },
    watched: { label: "Просмотрено", Icon: Eye },
    on_hold: { label: "Отложено", Icon: PauseCircle },
    dropped: { label: "Брошено", Icon: XCircle },
};

// Универсальная функция для получения текста статуса
export function getStatusLabel(status: string | null | undefined): string {
    if (!status || !(status in DRAMA_STATUSES)) return status ?? "";
    return DRAMA_STATUSES[status as DramaStatus].label;
}