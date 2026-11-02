"use client"; // <-- Добавили, так как у нас теперь есть интерактивное состояние

import { useState } from "react";
import Link from "next/link";
import { Star, Eye, ArrowLeft } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";
import { CardStatusToolbar } from "@/components/drama/CardStatusToolbar";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CatalogCardProps = {
  dramaId: number;
  title: string;
  year: number | null;
  country: string | null;
  posterUrl: string | null;
  ratingKinopoisk: number | null;
  ratingIMDB: number | null;
  genres: { id: number; name: string }[];
  themes: string[];
  moods: string[];
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
  genres, themes, moods, episodes, synopsis, dominantCryTag, entry
}: CatalogCardProps) {
  const [showTags, setShowTags] = useState(false); // <-- Состояние для переключения

  const rating = ratingKinopoisk ?? ratingIMDB ?? null;
  const metaString = [year, country, episodes ? `${episodes} сер.` : null].filter(Boolean).join(" · ");
  const cryTagConfig = dominantCryTag ? CRY_TAGS[dominantCryTag] : null;

  const totalTags = genres.length + themes.length + moods.length;
  const hiddenTagsCount = Math.max(0, totalTags - 3);

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:border-accent/50"
      onMouseLeave={() => setShowTags(false)}>

      {/* ─── ПОСТЕР И HOVER-ОВЕРЛЕЙ ─── */}
      <div className="relative aspect-2/3 bg-accent-soft overflow-hidden rounded-t-xl">

        <Link href={`/dramas/${dramaId}`} className="absolute inset-0 z-10">
          <PosterImage posterUrl={posterUrl} title={title} year={year} className="absolute inset-0" />
        </Link>

        {/* Верхние пилюли (исчезают при наведении) */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
          <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-border bg-background/80 text-xs font-semibold">
            <Star className={`w-3.5 h-3.5 shrink-0 ${rating ? "fill-current text-yellow-400" : "text-muted"}`} />
            <span className={`${rating ? "text-foreground" : "text-muted"} translate-y-0`}>
              {rating != null ? rating.toFixed(1) : "—"}
            </span>
          </div>

          {cryTagConfig ? (
            <div className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-full border ${cryTagConfig.border} ${cryTagConfig.bg}/15 text-xs font-semibold ${cryTagConfig.color}`}>
              <cryTagConfig.Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="-translate-y-px">{cryTagConfig.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-border bg-background/80 text-xs font-semibold text-muted">
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="-translate-y-px">Сбор данных</span>
            </div>
          )}
        </div>

        {/* Hover-оверлей */}
        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hidden md:flex flex-col justify-between p-4">

          <div className="w-full flex-1 overflow-hidden pt-4 relative">
            {!showTags ? (
              <p className="text-white/90 text-xs leading-relaxed line-clamp-14">
                {synopsis || "Описание пока отсутствует..."}
              </p>
            ) : (
              <div className="flex flex-col gap-3 text-white/90">
                <button
                  onClick={() => setShowTags(false)}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1 w-fit mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Назад к описанию
                </button>

                {genres.length > 0 && (
                  <div>
                    <span className="text-[10px] text-white/50 uppercase mb-1.5 block">Жанры</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {genres.map(g => (
                        <Link
                          key={g.id}
                          href={`/dramas?genre=${g.id}`}
                          className="text-xs text-white/90 hover:text-accent hover:underline transition-colors cursor-pointer"
                        >
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {moods.length > 0 && (
                  <div>
                    <span className="text-[10px] text-white/50 uppercase mb-1.5 block">Настроение</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {moods.map(m => (
                        <Link
                          key={m}
                          href={`/dramas?mood=${encodeURIComponent(m)}`}
                          className="text-xs text-white/90 hover:text-accent hover:underline transition-colors cursor-pointer"
                        >
                          {m}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {themes.length > 0 && (
                  <div>
                    <span className="text-[10px] text-white/50 uppercase mb-1.5 block">Темы</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {themes.map(t => (
                        <Link
                          key={t}
                          href={`/dramas?theme=${encodeURIComponent(t)}`}
                          className="text-xs text-white/90 hover:text-accent hover:underline transition-colors cursor-pointer"
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full shrink-0">
            <CardStatusToolbar dramaId={dramaId} currentStatus={entry?.status} />
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

        {/* Жанры и Матрешка */}
        <div className="mt-auto pt-2 flex flex-wrap gap-1 items-center">
          {genres.slice(0, 3).map((g) => (
            <span key={g.id} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {g.name}
            </span>
          ))}

          {/* Вместо Popover используем кнопку, которая меняет стейт карточки */}
          {hiddenTagsCount > 0 && (
            <button
              onClick={() => setShowTags(true)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted hover:bg-surface transition-colors cursor-pointer"
            >
              +{hiddenTagsCount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}