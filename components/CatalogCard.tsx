import Link from "next/link";
import { Star, Calendar, MapPin } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";

type CatalogCardProps = {
  dramaId: number;
  title: string;
  year: number | null;
  country: string | null;
  posterUrl: string | null;
  ratingKinopoisk: number | null;
  ratingIMDB: number | null;
  genres: string[];
};

export function CatalogCard({
  dramaId,
  title,
  year,
  country,
  posterUrl,
  ratingKinopoisk,
  ratingIMDB,
  genres,
}: CatalogCardProps) {
  // Показываем лучший из доступных рейтингов
  const rating = ratingKinopoisk ?? ratingIMDB ?? null;

  return (
    <Link
      href={`/dramas/${dramaId}`}
      className="rounded-xl overflow-hidden border border-border bg-surface hover:border-accent/50 transition-colors duration-200 flex flex-col"
    >
            {/* Постер */}
      <div className="relative aspect-2/3 bg-accent-soft">
        <PosterImage posterUrl={posterUrl ?? null} title={title} year={year} />

        {rating != null && (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border bg-background/80 font-medium">
            <Star className="w-3.5 h-3.5 fill-current text-yellow-400 shrink-0" />
            <span className="text-foreground leading-none">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.4em]">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted">
          {year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {year}
            </span>
          )}
          {country && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {country}
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border">
            {genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[10px] px-1.5 py-0.5 rounded-full border border-border text-muted"
              >
                {g}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="text-[10px] text-muted px-1.5 py-0.5">
                +{genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}