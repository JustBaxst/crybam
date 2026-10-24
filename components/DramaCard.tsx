import Link from "next/link";
import { Star } from "lucide-react";
import { CryBadge } from "@/components/CryBadge";
import { PosterImage } from "@/components/PosterImage";
import type { CryTag } from "@/lib/cry-tags";

type DramaCardProps = {
  dramaId: number;
  title: string;
  year: number;
  country: string;
  rating: number;
  cryTag?: CryTag;
  status?: string;
  impression?: string | null;
  posterUrl?: string | null;
};

export function DramaCard({
  dramaId,
  title,
  year,
  country,
  rating,
  cryTag,
  status,
  impression,
  posterUrl,
}: DramaCardProps) {
  return (
    <Link
      href={`/dramas/${dramaId}`}
      className="group rounded-xl overflow-hidden border border-border bg-surface hover:border-accent/50 transition-colors duration-200 flex flex-col"
    >
      {/* Постер */}
      <div className="relative aspect-2/3 bg-accent-soft overflow-hidden">
        <PosterImage posterUrl={posterUrl ?? null} title={title} year={year} className="absolute inset-0" />

        <div className="absolute top-2 left-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border bg-background/80 font-medium">
          <Star className="w-3.5 h-3.5 fill-current text-yellow-400 shrink-0" />
          <span className="text-foreground leading-none">{rating}</span>
        </div>
      </div>

      {/* Информация */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.4em]">
          {title}
        </h3>

        <p className="text-xs text-muted mt-1">
          {year} · {country}
        </p>

        <div className="mt-auto pt-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap min-h-26px">
            {status && (
              <span className="text-xs px-2 py-1 rounded-full border border-border text-muted leading-none">
                {statusLabel(status)}
              </span>
            )}
            {cryTag && <CryBadge tag={cryTag} size="sm" />}
          </div>

          {impression ? (
            <div className="text-xs px-2 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 leading-snug line-clamp-1">
              {impression}
            </div>
          ) : (
            <div className="min-h-[1.2em]" />
          )}
        </div>
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