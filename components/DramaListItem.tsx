import Link from "next/link";
import { Star } from "lucide-react";
import { CryBadge } from "@/components/CryBadge";
import { PosterImage } from "@/components/PosterImage"; // ← Добавили импорт
import type { CryTag } from "@/lib/cry-tags";

type DramaListItemProps = {
  dramaId: number;
  title: string;
  year: number;
  country: string;
  rating: number;
  cryTag?: CryTag;
  status?: string;
  posterUrl?: string | null;
};

export function DramaListItem({
  dramaId,
  title,
  year,
  country,
  rating,
  cryTag,
  status,
  posterUrl, // ← Достали из пропсов
}: DramaListItemProps) {
  return (
    <Link
      href={`/dramas/${dramaId}`}
      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors"
    >
      {/* Мини-постер (ДОБАВЛЕНО) */}
      <div className="relative w-10 h-14 rounded-md overflow-hidden bg-accent-soft shrink-0">
        <PosterImage 
          posterUrl={posterUrl ?? null} 
          title={title} 
          year={year} 
          className="absolute inset-0" 
        />
      </div>

      {/* Рейтинг */}
      <div className="flex items-center gap-1 text-sm w-12 shrink-0">
        <Star className="w-4 h-4 fill-current text-yellow-400 shrink-0" />
        <span className="font-semibold text-foreground">{rating}</span>
      </div>

      {/* Название и год */}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm truncate">{title}</div>
        <div className="text-xs text-muted mt-0.5">
          {year} · {country}
        </div>
      </div>

      {/* Статус + cryTag */}
      <div className="flex items-center gap-2 shrink-0">
        {cryTag && <CryBadge tag={cryTag} size="sm" />}
        {status && (
          <span className="hidden sm:inline text-xs px-2 py-1 rounded-full border border-border text-muted leading-none">
            {statusLabel(status)}
          </span>
        )}
      </div>
    </Link>
  );
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    watched: "Просмотрено",
    watching: "Смотрю",
    planned: "В планах",
    on_hold: "Отложено",
    dropped: "Брошено",
  };
  return map[status] ?? status;
}