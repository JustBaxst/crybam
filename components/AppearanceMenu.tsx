"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Palette, Sun, Moon } from "lucide-react";

const accents = [
  { id: "rose", label: "Розовый", hue: 15 },
  { id: "amber", label: "Янтарный", hue: 75 },
  { id: "lime", label: "Лаймовый", hue: 135 },
  { id: "emerald", label: "Изумрудный", hue: 165 },
  { id: "cyan", label: "Бирюзовый", hue: 200 },
  { id: "blue", label: "Синий", hue: 240 },
  { id: "violet", label: "Фиолетовый", hue: 285 },
  { id: "pink", label: "Малиновый", hue: 330 },
];

export function AppearanceMenu() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("violet");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrent(localStorage.getItem("accent") ?? "violet");
  }, []);

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

  const chooseAccent = (id: string) => {
    setCurrent(id);
    localStorage.setItem("accent", id);
    if (id === "violet") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", id);
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg border border-border" />;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        className="w-9 h-9 rounded-lg border border-border hover:border-accent/40 transition-colors flex items-center justify-center"
        aria-label="Внешний вид"
      >
        <Palette className="w-4.5 h-4.5 text-accent" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
          {/* Тема */}
          <div className="p-3 border-b border-border">
            <div className="text-xs text-muted uppercase tracking-wide mb-2">Тема</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${theme === "light"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-border hover:border-accent/40"
                  }`}
              >
                <Sun className="w-4 h-4" />
                Светлая
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${theme === "dark"
                    ? "border-accent text-accent bg-accent/5"
                    : "border-border hover:border-accent/40"
                  }`}
              >
                <Moon className="w-4 h-4" />
                Тёмная
              </button>
            </div>
          </div>

          {/* Акцент */}
          <div className="p-3">
            <div className="text-xs text-muted uppercase tracking-wide mb-2">Цвет</div>
            <div
              className="grid gap-2.5"
              style={{ gridTemplateColumns: "repeat(4, 32px)" }}
            >
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => chooseAccent(a.id)}
                  style={{
                    background: `oklch(0.68 0.22 ${a.hue})`,
                    width: 32,
                    height: 32,
                  }}
                  className={`rounded-full border-2 transition-transform hover:scale-110 ${current === a.id ? "border-foreground" : "border-transparent"
                    }`}
                  title={a.label}
                  aria-label={a.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}