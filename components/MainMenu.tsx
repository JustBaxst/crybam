"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Tv, Theater, MessagesSquare, Newspaper, UserCircle } from "lucide-react";
import { MenuLink } from "@/components/MenuLink"; // ← Импортируем наш новый компонент

const items = [
  { href: "/dramas",     Icon: Tv,             label: "Дорамы",     hint: "Все дорамы в базе", isWip: false },
  { href: "/people",     Icon: Theater,        label: "Актёры",     hint: "Все актёры в базе", isWip: false },
  { href: "/characters", Icon: UserCircle,     label: "Персонажи",  hint: "Все персонажи дорам", isWip: false },
  { href: "/community",  Icon: MessagesSquare, label: "Сообщества", hint: "Обсуждения и друзья", isWip: true },
  { href: "/news",       Icon: Newspaper,      label: "Новости",    hint: "Что нового на сайте", isWip: true },
];

export function MainMenu() {
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
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors text-sm">
        <span>Главная</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          {items.map((item) => (
            <MenuLink 
              key={item.href} 
              {...item} 
              onClick={() => setOpen(false)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}