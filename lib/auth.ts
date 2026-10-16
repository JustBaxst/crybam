import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";

/**
 * Возвращает текущего пользователя.
 *
 * ⚠️ Сейчас всегда возвращает id=1 — единственного пользователя.
 * Когда подключим NextAuth/Clerk, заменим на чтение сессии.
 * Весь остальной код трогать не придётся.
 */
export async function getCurrentUser() {
  return prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
  });
}

/**
 * Проверяет, что текущий пользователь — админ.
 * Если нет — выбрасывает ошибку.
 *
 * Используется в Server Actions перед опасными операциями.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Доступ запрещён: требуются права администратора");
  }
  return user;
}

/**
 * Проверяет, что текущий пользователь — админ или модератор.
 * Для операций с базой дорам (создание, редактирование).
 */
export async function requireModerator() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    throw new Error("Доступ запрещён: нужны права модератора");
  }
  return user;
}