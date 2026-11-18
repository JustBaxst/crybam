"use client";

import { ReactNode, useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { Button } from "./button";

/**
 * Универсальная обертка для модальных окон.
 * @dontDuplicate Не верстать оверлей, шапку и футер вручную в каждой форме.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = "center",
  isDirty = false,
  isPending = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "center" | "drawer";
  isDirty?: boolean;
  isPending?: boolean;
}) {
  useLockBodyScroll(isOpen);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // ─── ЛОГИКА ЗАКРЫТИЯ ───
  const attemptClose = () => {
    if (isDirty && !isPending) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const forceClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  // ─── ГОРЯЧИЕ КЛАВИШИ ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        if (showConfirmClose) setShowConfirmClose(false);
        else attemptClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showConfirmClose, isDirty, isPending]);

  if (!isOpen) return null;

  // ─── СТИЛИ (Центр vs Панель) ───
  const isDrawer = variant === "drawer";
  const containerClasses = isDrawer
    ? "fixed inset-y-0 right-0 w-full max-w-xl bg-surface border-l border-border shadow-2xl flex flex-col z-100 animate-in slide-in-from-right duration-300"
    : "w-full max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col z-100 animate-in fade-in zoom-in-95 duration-200";

  const wrapperClasses = isDrawer
    ? "fixed inset-0 z-100 bg-background/60 backdrop-blur-sm"
    : "fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6";

  return (
    <div className={wrapperClasses} onClick={attemptClose}>
      <div className={containerClasses} onClick={(e) => e.stopPropagation()}>
        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={attemptClose}
            disabled={isPending}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Тело (скроллится) */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Футер (Кнопки) */}
        {footer && (
          <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-end gap-3 bg-surface rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>

      {/* ─── ВЛОЖЕННЫЙ АЛЕРТ О НЕСОХРАНЕННЫХ ДАННЫХ ─── */}
      {showConfirmClose && (
        <div
          className="fixed inset-0 z-110 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmClose(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-warning mb-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">
                Несохраненные изменения
              </h3>
            </div>
            <p className="text-sm text-muted mb-6">
              Вы изменили данные в форме, но не сохранили их. Вы уверены, что
              хотите закрыть окно?
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmClose(false)}
              >
                Вернуться
              </Button>
              <Button type="button" variant="destructive" onClick={forceClose}>
                Выйти без сохранения
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
