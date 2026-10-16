"use client";

import Link from "next/link";
import { useState } from "react";
import { Clapperboard, Menu } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { MainMenu } from "@/components/MainMenu";
import { UserMenu } from "@/components/UserMenu";
import { AppearanceMenu } from "@/components/AppearanceMenu";

const mobileNavItems = [
  { href: "/",                  label: "Дашборд" },
  { href: "/dramas",            label: "Дорамы" },
  { href: "/people",            label: "Актёры" },
  { href: "/community",         label: "Сообщества" },
  { href: "/news",              label: "Новости" },
  { href: "/library",           label: "Библиотека" },
  { href: "/heart",             label: "Особое место" },
  { href: "/nominations",       label: "Номинации" },
  { href: "/me/actors",         label: "Любимые актёры" },
  { href: "/me/characters",     label: "Любимые персонажи" },
  { href: "/stats",             label: "Статистика" },
  { href: "/graph",             label: "Граф связей" },
  { href: "/settings",          label: "Настройки" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-accent shrink-0">
          <Clapperboard className="w-5 h-5" />
          <span className="hidden sm:inline">DramaTracker</span>
        </Link>

        <div className="hidden md:block">
          <MainMenu />
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-lg border border-border hover:border-accent/40 transition-colors flex items-center justify-center"
              aria-label="Меню"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <UserMenu />
            <AppearanceMenu />
          </div>

          <div className="md:hidden">
            <AppearanceMenu />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3">
            <SearchBar />
          </div>
          <nav className="px-2 pb-4">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm hover:bg-foreground/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}