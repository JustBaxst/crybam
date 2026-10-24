"use client";

import { useState } from "react";

type PosterImageProps = {
  posterUrl: string | null;
  title: string;
  year?: number | null;
  className?: string;
};

export function PosterImage({ posterUrl, title, year, className = "" }: PosterImageProps) {
  const [error, setError] = useState(false);

  // Если ссылки нет или картинка не загрузилась — показываем стильную заглушку
  if (!posterUrl || error) {
    return (
            <div className={`w-full h-full bg-linear-to-br from-accent-soft to-accent/20 flex flex-col items-center justify-center p-2 text-center ${className}`}>
        <span className="text-4xl mb-1">🎬</span>
        <p className="text-xs font-semibold line-clamp-2">{title}</p>
        {year && <p className="text-[10px] text-muted mt-0.5">{year}</p>}
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={title}
      className={`w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03] ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}