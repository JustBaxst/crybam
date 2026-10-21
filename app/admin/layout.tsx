import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Home, Film, Users, UserCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { CommandPalette } from "@/components/CommandPalette";

const navItems = [
  { href: "/admin", label: "Обзор", Icon: Home },
  { href: "/admin/dramas", label: "Дорамы", Icon: Film },
  { href: "/admin/people", label: "Актёры", Icon: Users },
  { href: "/admin/characters", label: "Персонажи", Icon: UserCircle },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      {/* Полоса админ-навигации */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm shrink-0">
            <Shield className="w-4 h-4" />
            Админка
          </div>
          <nav className="flex items-center gap-1 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <item.Icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}