"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Tv, Theater, MessagesSquare, Newspaper } from "lucide-react";

const items = [
  { href: "/dramas",    Icon: Tv,             label: "Дорамы",     hint: "Все дорамы в базе" },
  { href: "/people",    Icon: Theater,        label: "Актёры",     hint: "Все актёры в базе" },
  { href: "/community", Icon: MessagesSquare, label: "Сообщества", hint: "Обсуждения и друзья" },
  { href: "/news",      Icon: Newspaper,      label: "Новости",    hint: "Что нового на сайте" },
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
          {items.map(({ href, Icon, label, hint }) => (
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
        </div>
      )}
    </div>
  );
}