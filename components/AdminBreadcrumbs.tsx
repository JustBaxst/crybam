import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string; // Если нет href, значит это текущая страница (не кликабельная)
};

export function AdminBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted mb-6 flex-wrap">
      <Link 
        href="/admin" 
        className="flex items-center gap-1 hover:text-accent transition-colors"
        title="В начало админки"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Админка</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-muted/50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-accent transition-colors truncate max-w-50">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-50">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}