"use client";

import { useEffect } from "react";

/**
 * Блокирует скролл страницы, пока активно (модалка открыта).
 * Компенсирует ширину полосы прокрутки, чтобы не было «скачка» layout при открытии/закрытии.
 */
export function useLockBodyScroll(active: boolean = true) {
  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [active]);
}