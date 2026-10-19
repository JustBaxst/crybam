import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center text-xs text-muted space-y-2">
        <p>© 2026 Crybam. All rights reserved.</p>
        <p>
          <Link href="/about" className="hover:text-foreground transition-colors">О сайте</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</Link>
        </p>
        <p className="text-[10px] opacity-60">
          Data and images provided by TVmaze.
        </p>
      </div>
    </footer>
  );
}