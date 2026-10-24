"use client";

import { useRef, useEffect } from "react";

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // Все состояния храним в useRef, чтобы избежать ре-рендеров React при движении мыши
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const hasDragged = useRef(false);

  const stopInertia = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  // Управляем классами напрямую через DOM (это работает моментально)
  const updateClasses = (scrolling: boolean, dragging: boolean) => {
    if (!ref.current) return;

    if (scrolling) ref.current.classList.add("is-scrolling");
    else ref.current.classList.remove("is-scrolling");

    if (dragging) {
      ref.current.classList.add("cursor-grabbing", "select-none");
      ref.current.classList.remove("cursor-grab");
    } else {
      ref.current.classList.remove("cursor-grabbing", "select-none");
      ref.current.classList.add("cursor-grab");
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    hasDragged.current = false;

    startX.current = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft.current = ref.current?.scrollLeft || 0;
    lastX.current = e.pageX;
    velocity.current = 0;

    stopInertia();
    updateClasses(true, true);
  };

  const onMouseLeave = () => {
    if (isDown.current) onMouseUp();
  };

  const onMouseUp = () => {
    isDown.current = false;
    updateClasses(true, false);

    // Инерция
    const applyInertia = () => {
      // 0.5 — порог остановки. 0.96 — коэффициент трения (чем ближе к 1, тем дольше катится)
      if (Math.abs(velocity.current) > 0.5) {
        if (ref.current) {
          ref.current.scrollLeft -= velocity.current;
        }
        velocity.current *= 0.96;
        animationFrame.current = requestAnimationFrame(applyInertia);
      } else {
        updateClasses(false, false);
      }
    };

    if (Math.abs(velocity.current) > 0.5) {
      animationFrame.current = requestAnimationFrame(applyInertia);
    } else {
      updateClasses(false, false);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault(); // Запрещаем браузеру выделять текст при перетаскивании

    const x = e.pageX - (ref.current?.offsetLeft || 0);
    const walk = x - startX.current;

    // Если сдвинули больше чем на 3 пикселя — это свайп, а не клик
    if (Math.abs(walk) > 3) hasDragged.current = true;

    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - walk;
    }

    // Вычисляем скорость для инерции
    velocity.current = e.pageX - lastX.current;
    lastX.current = e.pageX;
  };

  // Блокируем клик, если это был свайп
  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => stopInertia();
  }, []);

  return (
    <div
      ref={ref}
      // Убрали snap-x snap-mandatory — они и вызывали рывки
      // Добавили скрытие нативного скроллбара для Firefox, но оставили для Chrome (через CSS)
      className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar cursor-grab"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}