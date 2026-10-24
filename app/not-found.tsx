import Link from "next/link";
import { Hammer, Home, Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-6 border border-yellow-400/20">
        <Hammer className="w-10 h-10 text-yellow-400" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Эта страница ещё в разработке</h1>
      <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
        Мы уже строим её прямо сейчас, чтобы Crybam стал ещё уютнее.
        Загляни сюда чуть позже — обещаем, будет красиво.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
        <Link
          href="/dramas"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors"
        >
          <Film className="w-4 h-4" />
          В каталог дорам
        </Link>
      </div>
    </div>
  );
}