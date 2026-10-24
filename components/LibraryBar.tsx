import Link from "next/link";
import { Library } from "lucide-react";

type StatusKey = "watched" | "watching" | "planned" | "on_hold" | "dropped";

type Props = {
  counts: Record<StatusKey, number>;
};

const STATUSES: {
  key: StatusKey;
  label: string;
  bg: string;
  dot: string;
  text: string;
}[] = [
    { key: "watched", label: "Просмотрено", bg: "bg-accent/85", dot: "bg-accent/85", text: "text-accent" },
    { key: "watching", label: "Смотрю", bg: "bg-accent/70", dot: "bg-accent/70", text: "text-accent/80" },
    { key: "planned", label: "В планах", bg: "bg-accent/45", dot: "bg-accent/45", text: "text-accent/70" },
    { key: "on_hold", label: "Отложено", bg: "bg-accent/25", dot: "bg-accent/25", text: "text-accent/60" },
    { key: "dropped", label: "Брошено", bg: "bg-accent/12", dot: "bg-accent/12", text: "text-accent/50" },
  ];

export function LibraryBar({ counts }: Props) {
  const total = STATUSES.reduce((sum, s) => sum + (counts[s.key] ?? 0), 0);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Library className="w-5 h-5 text-accent" />
          Список дорам
        </h2>
        <Link href="/library" className="text-sm text-accent hover:underline">
          все →
        </Link>
      </div>

      {total > 0 ? (
        <div className="h-9 rounded-lg overflow-hidden flex bg-border/30">
          {STATUSES.map((s, i) => {
            const value = counts[s.key] ?? 0;
            if (value === 0) return null;
            const percent = (value / total) * 100;
            return (
              <div
                key={s.key}
                style={{ width: `${percent}%` }}
                className={`${s.bg} flex items-center justify-center text-xs font-semibold text-white transition-all hover:brightness-110`}
                title={`${s.label}: ${value}`}
              >
                {i < 3 && percent >= 8 && <span className="px-1">{value}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-9 rounded-lg bg-border/30 flex items-center justify-center text-xs text-muted">
          Пока ничего нет
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm">
        {STATUSES.map((s) => (
          <Link
            key={s.key}
            href={`/library?status=${s.key}`}
            className="flex items-center gap-1.5 group"
          >
            <span className={`w-2 h-2 rounded-full ${s.dot} transition-transform group-hover:scale-125`} />
            <span className="text-muted group-hover:text-foreground transition-colors">
              {s.label}
            </span>
            <span className={`font-semibold ${s.text} group-hover:underline`}>
              {counts[s.key] ?? 0}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}