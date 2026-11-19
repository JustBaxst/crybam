"use client";

import { useEffect } from "react";

// Глобальный счетчик открытых модалок
let lockCount = 0;

export function useLockBodyScroll(active = true) {
  useEffect(() => {
    if (!active) return;

    lockCount++;
    if (lockCount === 1) {
      // Блокируем скролл только если это первая открытая модалка
      document.body.style.overflow = "hidden";
    }

    return () => {
      lockCount--;
      if (lockCount === 0) {
        // Разблокируем, когда закрылась последняя
        document.body.style.overflow = "";
      }
    };
  }, [active]);
}
