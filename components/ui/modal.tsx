"use client";

import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { ConfirmDialog } from "./confirm-dialog";

/**
 * Универсальная обертка для модальных окон (Формы, редакторы, инфо-блоки).
 * @dontDuplicate Не верстать оверлей, шапку и футер вручную в каждой форме.
 */
export function Modal({
  isOpen,
  onCloseAction,
  title,
  icon,
  children,
  footer,
  variant = "center",
  isDirty = false,
  isPending = false,
  maxWidth = "max-w-3xl",
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode | ((attemptClose: () => void) => ReactNode);
  variant?: "center" | "drawer";
  isDirty?: boolean;
  isPending?: boolean;
  maxWidth?: string;
}) {
  useLockBodyScroll(isOpen);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const attemptClose = () => {
    if (isDirty && !isPending) {
      setShowConfirmClose(true);
    } else {
      onCloseAction();
    }
  };

  const forceClose = () => {
    setShowConfirmClose(false);
    onCloseAction();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !showConfirmClose) {
        e.preventDefault();
        attemptClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showConfirmClose, isDirty, isPending]);

  if (!isOpen) return null;

  const isDrawer = variant === "drawer";
  const containerClasses = isDrawer
    ? "fixed inset-y-0 right-0 w-full max-w-xl bg-surface border-l border-border shadow-2xl flex flex-col z-100 animate-in slide-in-from-right duration-300"
    : `w-full ${maxWidth} max-h-[90vh] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col z-100 animate-in fade-in zoom-in-95 duration-200`;

  const wrapperClasses = isDrawer
    ? "fixed inset-0 z-100 bg-background/60 backdrop-blur-sm"
    : "fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6";

  return (
    <>
      <div className={wrapperClasses}>
        {/* Отдельный слой для фона. Клик срабатывает только если начали и закончили на нем */}
        <div
          className="absolute inset-0"
          onMouseDown={(e) => {
            // Проверяем, что клик был именно по фону, а не по контенту
            if (e.target === e.currentTarget) {
              (e.currentTarget as HTMLElement).dataset.mousedown = "true";
            }
          }}
          onMouseUp={(e) => {
            if (
              e.target === e.currentTarget &&
              (e.currentTarget as HTMLElement).dataset.mousedown === "true"
            ) {
              attemptClose();
            }
            (e.currentTarget as HTMLElement).dataset.mousedown = "false";
          }}
        />

        <div className={`relative ${containerClasses}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {icon && <span className="text-accent">{icon}</span>}
              {title}
            </h2>
            <button
              type="button"
              onClick={attemptClose}
              disabled={isPending}
              className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-end gap-3 bg-surface rounded-b-2xl">
              {typeof footer === "function" ? footer(attemptClose) : footer}
            </div>
          )}
        </div>
      </div>

      {/* Вложенное окно подтверждения */}
      <ConfirmDialog
        isOpen={showConfirmClose}
        onCloseAction={() => setShowConfirmClose(false)}
        onConfirmAction={forceClose}
        title="Несохраненные изменения"
        description="Вы изменили данные в форме, но не сохранили их. Вы уверены, что хотите закрыть окно?"
        confirmText="Выйти без сохранения"
        variant="warning"
      />
    </>
  );
}
