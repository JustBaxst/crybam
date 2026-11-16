import {
  Play,
  Clock,
  Check,
  Pause,
  X,
  RotateCcw,
  LucideIcon,
} from "lucide-react";

export type DramaStatus =
  | "watching"
  | "rewatching"
  | "planned"
  | "watched"
  | "on_hold"
  | "dropped";

export const DRAMA_STATUSES: Record<
  DramaStatus,
  { label: string; Icon: LucideIcon }
> = {
  watching: { label: "Смотрю", Icon: Play },
  rewatching: { label: "Пересматриваю", Icon: RotateCcw },
  planned: { label: "В планах", Icon: Clock },
  watched: { label: "Просмотрено", Icon: Check }, // Чистая галочка
  on_hold: { label: "Отложено", Icon: Pause },
  dropped: { label: "Брошено", Icon: X },
};

export function getStatusLabel(status: string | null | undefined): string {
  if (!status) return "Без статуса";
  return DRAMA_STATUSES[status as DramaStatus]?.label || status;
}
