"use client";

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
import { MenuLink } from "@/components/MenuLink";
import { SmartLink } from "./SmartLink";

const userSections = [
  { href: "/library",       Icon: Library,    label: "Библиотека",        hint: "Списки дорам", isWip: false },
  { href: "/heart",         Icon: Heart,      label: "Особое место",      hint: "Дорамы с цитатами", isWip: false },
  { href: "/nominations",   Icon: Trophy,     label: "Номинации",         hint: "Личные награды", isWip: true },
  { href: "/me/actors",     Icon: Users,      label: "Любимые актёры",    hint: "Твой топ", isWip: true },
  { href: "/me/characters", Icon: UsersRound, label: "Любимые персонажи", hint: "Твой топ", isWip: true },
  { href: "/stats",         Icon: BarChart3,  label: "Статистика",        hint: "Часы, жанры, эмоции", isWip: true },
  { href: "/graph",         Icon: Network,    label: "Граф связей",       hint: "Визуализация", isWip: true },
];

type UserMenuProps = {
  user: { name: string; role: string } | null;
};

export function UserMenu({ user }: UserMenuProps) {  
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
          {user?.name ?? "Гость"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          {userSections.map((item) => (
            <MenuLink 
              key={item.href} 
              {...item} 
              onClick={() => setOpen(false)} 
            />
          ))}

          <div className="border-t border-border">
            <SmartLink
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors text-sm text-muted"
            >
              <Settings className="w-5 h-5 shrink-0" />
              Настройки
            </SmartLink>
            
            <button
              onClick={() => {
                alert("Авторизация появится в следующем обновлении! 🚀");
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors border-t border-border"
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