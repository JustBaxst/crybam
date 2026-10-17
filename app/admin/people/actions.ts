"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";

export async function createPerson(formData: FormData) {
  await requireModerator();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя обязательно" };

  const person = await prisma.person.create({
    data: {
      name,
      nameNative: String(formData.get("nameNative") ?? "").trim() || null,
      photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
      agency: String(formData.get("agency") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
    },
  });

  revalidatePath("/admin/people");
  redirect(`/admin/people/${person.id}`);
}

export async function updatePerson(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) {
    return { error: "Неверный ID" };
  }

  const str = (name: string) => String(formData.get(name) ?? "").trim() || null;
  const date = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    return raw ? new Date(raw) : null;
  };

  const name = str("name");
  if (!name) return { error: "Имя обязательно" };

  await prisma.person.update({
    where: { id: personId },
    data: {
      name,
      nameNative: str("nameNative"),
      photoUrl: str("photoUrl"),
      agency: str("agency"),
      bio: str("bio"),
      birthDate: date("birthDate"),
    },
  });

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath("/admin/people");
  revalidatePath("/dramas"); // Обновляем и публичную часть
  return { success: true };
}

export async function deletePerson(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) {
    return { error: "Неверный ID" };
  }

  // Проверяем, нет ли у него кредитов
  const creditsCount = await prisma.credit.count({ where: { personId } });
  if (creditsCount > 0) {
    return { error: "Нельзя удалить. Сначала удалите его роли из дорам." };
  }

  await prisma.person.delete({ where: { id: personId } });
  revalidatePath("/admin/people");
  redirect("/admin/people");
}