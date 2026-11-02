import Link from "next/link";
import { Star, Eye } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";
import { StatusDropdown } from "@/app/dramas/[id]/StatusDropdown";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CatalogCardProps = {
  dramaId: number;
  title: string;
  year: number | null;
  country: string | null;
  posterUrl: string | null;
  ratingKinopoisk: number | null;
  ratingIMDB: number | null;
  genres: string[];
  episodes: number | null;
  synopsis: string | null;
  dominantCryTag?: CryTag | null;
  entry?: {
    status: string;
    progress: number | null;
    rewatchCount: number;
  } | null;
};

export function CatalogCard({
  dramaId, title, year, country, posterUrl, ratingKinopoisk, ratingIMDB,
  genres, episodes, synopsis, dominantCryTag, entry
}: CatalogCardProps) {
  const rating = ratingKinopoisk ?? ratingIMDB ?? null;
  const metaString = [year, country, episodes ? `${episodes} сер.` : null].filter(Boolean).join(" · ");
  const cryTagConfig = dominantCryTag ? CRY_TAGS[dominantCryTag] : null;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:border-accent/50">

      {/* ─── ПОСТЕР И HOVER-ОВЕРЛЕЙ ─── */}
      <div className="relative aspect-2/3 bg-accent-soft overflow-hidden rounded-t-xl">

        <Link href={`/dramas/${dramaId}`} className="absolute inset-0 z-10">
          <PosterImage posterUrl={posterUrl} title={title} year={year} className="absolute inset-0" />
        </Link>

        {/* Верхние пилюли (Рейтинг и CryTag) */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20 pointer-events-none">

          {/* Рейтинг */}
          <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-border bg-background/80 backdrop-blur-sm text-xs font-semibold">
            <Star className={`w-3.5 h-3.5 shrink-0 ${rating ? "fill-current text-yellow-400" : "text-muted"}`} />
            <span className={`${rating ? "text-foreground" : "text-muted"} translate-y-0`}>
              {rating != null ? rating.toFixed(1) : "—"}
            </span>
          </div>

          {/* CryTag */}
          {cryTagConfig ? (
            <div className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-full border ${cryTagConfig.border} ${cryTagConfig.bg}/15 backdrop-blur-sm text-xs font-semibold ${cryTagConfig.color}`}>
              <cryTagConfig.Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="-translate-y-px">{cryTagConfig.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-border bg-background/80 backdrop-blur-sm text-xs font-semibold text-muted">
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="-translate-y-px">Сбор данных</span>
            </div>
          )}
        </div>

        {/* Hover-оверлей */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hidden md:flex flex-col justify-between p-4">
          <div className="mt-8">
            <p className="text-white/90 text-xs leading-relaxed line-clamp-4">
              {synopsis || "Описание пока отсутствует..."}
            </p>
          </div>
          <div className="w-full">
            <StatusDropdown dramaId={dramaId} entry={entry || null} episodes={episodes} />
          </div>
        </div>
      </div>

      {/* ─── ИНФОРМАЦИЯ ─── */}
      <div className="p-3 flex flex-col flex-1 rounded-b-xl">
        <Link href={`/dramas/${dramaId}`} className="hover:text-accent transition-colors">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.4em]">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-muted mt-1">{metaString}</p>

        <div className="mt-auto pt-2 flex flex-wrap gap-1">
          {genres.slice(0, 3).map((g) => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}