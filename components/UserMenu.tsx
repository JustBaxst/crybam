"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  User,
  Library,
  Heart,
  Trophy,
  Users,
  UsersRound,
  BarChart3,
  Network,
  Settings,
  LogOut,
} from "lucide-react";

const userSections = [
  { href: "/library",       Icon: Library,    label: "Библиотека",        hint: "Списки дорам" },
  { href: "/heart",         Icon: Heart,      label: "Особое место",      hint: "Дорамы с цитатами" },
  { href: "/nominations",   Icon: Trophy,     label: "Номинации",         hint: "Личные награды" },
  { href: "/me/actors",     Icon: Users,      label: "Любимые актёры",    hint: "Твой топ" },
  { href: "/me/characters", Icon: UsersRound, label: "Любимые персонажи", hint: "Твой топ" },
  { href: "/stats",         Icon: BarChart3,  label: "Статистика",        hint: "Часы, жанры, эмоции" },
  { href: "/graph",         Icon: Network,    label: "Граф связей",       hint: "Визуализация" },
];

type UserMenuProps = {
  user: {
    name: string;
    role: string;
  } | null;
};

export function UserMenu({ user }: UserMenuProps) {  // ← ДОБАВЛЕНО user
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors text-sm">
        <span className="w-7 h-7 rounded-md bg-accent-soft flex items-center justify-center">
          <User className="w-4 h-4 text-accent" />
        </span>
        <span className="hidden md:inline max-w-25 truncate">
          {user?.name ?? "Гость"}  {/* ← ИЗМЕНЕНО: имя из базы */}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          {userSections.map(({ href, Icon, label, hint }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors border-b border-border last:border-b-0"
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
              <div className="min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted mt-0.5">{hint}</div>
              </div>
            </Link>
          ))}

          <div className="border-t border-border">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors text-sm text-muted"
            >
              <Settings className="w-5 h-5 shrink-0" />
              Настройки
            </Link>
            <button
              disabled
              className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-muted cursor-not-allowed border-t border-border"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}