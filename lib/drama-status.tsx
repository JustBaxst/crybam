import {
  Play,
  Clock,
  CheckCircle,
  PauseCircle,
  XCircle,
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
  watched: { label: "Просмотрено", Icon: CheckCircle },
  on_hold: { label: "Отложено", Icon: PauseCircle },
  dropped: { label: "Брошено", Icon: XCircle },
};

export function getStatusLabel(status: string | null | undefined): string {
  if (!status) return "Без статуса";
  return DRAMA_STATUSES[status as DramaStatus]?.label || status;
}
