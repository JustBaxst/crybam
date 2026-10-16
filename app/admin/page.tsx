import Link from "next/link";
import { Film, Users, UserCircle, Tag, Award, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [dramas, persons, characters, genres, nominations] = await Promise.all([
    prisma.drama.count(),
    prisma.person.count(),
    prisma.character.count(),
    prisma.genre.count(),
    prisma.nomination.count(),
  ]);

  const stats = [
    { label: "Дорам", value: dramas },
    { label: "Актёров", value: persons },
    { label: "Персонажей", value: characters },
    { label: "Жанров", value: genres },
    { label: "Номинаций", value: nominations },
  ];

  const sections = [
    {
      href: "/admin/dramas",
      Icon: Film,
      title: "Дорамы",
      description: "Управление базой дорам: создание, редактирование, удаление",
      count: dramas,
    },
    {
      href: "/admin/people",
      Icon: Users,
      title: "Актёры",
      description: "Режиссёры, сценаристы, актёры — все персоны",
      count: persons,
    },
    {
      href: "/admin/characters",
      Icon: UserCircle,
      title: "Персонажи",
      description: "Персонажи дорам и связи между ними",
      count: characters,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Обзор</h1>

      {/* Счётчики */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface p-3 text-center"
          >
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Разделы */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="group rounded-2xl border border-border bg-surface p-5 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <sec.Icon className="w-6 h-6 text-accent" />
              <span className="text-xs text-muted">{sec.count} записей</span>
            </div>
            <h2 className="font-semibold mb-1.5 flex items-center gap-2">
              {sec.title}
              <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              {sec.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}