"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ← Добавили для навигации
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteDramaModal } from "./DeleteDramaModal";

export function DramaActions({ dramaId, dramaTitle }: { dramaId: number; dramaTitle: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter(); // ← Инициализация роутера

  return (
    <div className="flex items-center justify-end relative">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Действия"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="w-40 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Используем onSelect вместо Link для идеальной работы с клавиатуры */}
            <DropdownMenu.Item
              onSelect={() => router.push(`/admin/dramas/${dramaId}`)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors outline-none cursor-pointer data-highlighted:bg-foreground/5"
            >
              <Pencil className="w-4 h-4 text-muted" />
              Редактировать
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-border" />

            <DropdownMenu.Item
              onSelect={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors outline-none cursor-pointer data-highlighted:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
              Удалить
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

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