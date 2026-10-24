"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteDramaModal } from "./DeleteDramaModal";

export function DramaActions({ dramaId, dramaTitle }: { dramaId: number; dramaTitle: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2 relative">
      {/* Кнопка Редактировать (карандаш) */}
      <Link
        href={`/admin/dramas/${dramaId}`}
        className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors"
        title="Редактировать"
      >
        <Pencil className="w-3.5 h-3.5" />
      </Link>

      {/* Выпадающее меню (...) */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50">
              <Link
                href={`/admin/dramas/${dramaId}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors"
              >
                <Pencil className="w-4 h-4 text-muted" />
                Редактировать
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-border"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <DeleteDramaModal
          dramaId={dramaId}
          dramaTitle={dramaTitle}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}