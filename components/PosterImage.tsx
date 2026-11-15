"use client";

import { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react"; // Заменили эмодзи на иконку

type PosterImageProps = {
  posterUrl: string | null;
  title: string;
  year?: number | null;
  className?: string;
};

export function PosterImage({ posterUrl, title, year, className = "" }: PosterImageProps) {
  const [error, setError] = useState(false);

  if (!posterUrl || error) {
    return (
      <div className={`w-full h-full bg-linear-to-br from-accent-soft to-accent/20 flex flex-col items-center justify-center p-4 text-center ${className}`}>
        <Film className="w-8 h-8 mb-2 text-muted opacity-50" />
        <p className="text-xs font-semibold line-clamp-3 leading-tight">{title}</p>
        {year && <p className="text-[10px] text-muted mt-1">{year}</p>}
      </div>
    );
  }

  // Если className содержит absolute, используем fill
  const isFill = className.includes("absolute");

  return isFill ? (
    <Image
      src={posterUrl}
      alt={title}
      fill
      className={`object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03] ${className}`}
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ) : (
    <Image
      src={posterUrl}
      alt={title}
      width={400}
      height={600}
      className={`w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03] ${className}`}
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}