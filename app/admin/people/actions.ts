"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";

const detectLanguage = (text: string) => {
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko"; // Корейский
  if (/[а-яА-Я]/.test(text)) return "ru";       // Русский
  if (/[\u4e00-\u9fa5]/.test(text)) return "zh"; // Китайский (ханьцзы)
  if (/[\u3040-\u30ff]/.test(text)) return "ja"; // Японский
  if (/[a-zA-Z]/.test(text)) return "en";       // Английский
  return "unknown";
};

export async function createPerson(formData: FormData) {
  await requireModerator();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя обязательно" };

  const nameNative = String(formData.get("nameNative") ?? "").trim() || null;
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const agency = String(formData.get("agency") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim();
  const birthDate = birthDateRaw ? new Date(birthDateRaw) : null;

  const aliasesRaw = String(formData.get("aliases") ?? "").trim();
  const aliasNames = aliasesRaw.split(/\n/).map(s => s.trim()).filter(Boolean);

  const person = await prisma.person.create({
    data: {
      name,
      nameLower: name.toLowerCase(),
      nameNative,
      birthDate,
      photoUrl,
      agency,
      bio,
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

  const aliasesRaw = String(formData.get("aliases") ?? "").trim();
  const aliasNames = aliasesRaw ? aliasesRaw.split(/\n/).map(s => s.trim()).filter(Boolean) : [];

  // Используем транзакцию, чтобы обновить всё разом (и не оставить базу в кривом состоянии)
  await prisma.$transaction(async (tx) => {
    await prisma.person.update({
    where: { id: personId },
    data: {
      name,
      nameLower: name.toLowerCase(),
      nameNative: str("nameNative"),
      photoUrl: str("photoUrl"),
      agency: str("agency"),
      bio: str("bio"),
      birthDate: date("birthDate"),
    },
  });

    // Удаляем старые алиасы и создаём новые
    await tx.personAlias.deleteMany({ where: { personId } });
    if (aliasNames.length > 0) {
      await tx.personAlias.createMany({
        data: aliasNames.map((alias) => ({
          personId,
          name: alias,
          nameLower: alias.toLowerCase(),
          language: detectLanguage(alias),
        })),
      });
    }
  });

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath("/admin/people");
  revalidatePath("/dramas");
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

export async function updatePersonAliases(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) return { error: "Неверный ID" };

  const aliasesRaw = String(formData.get("aliases") ?? "").trim();
  const aliasNames = aliasesRaw ? aliasesRaw.split(/\n/).map((s) => s.trim()).filter(Boolean) : [];

  await prisma.$transaction(async (tx) => {
    await tx.personAlias.deleteMany({ where: { personId } });
    if (aliasNames.length > 0) {
      await tx.personAlias.createMany({
        data: aliasNames.map((alias) => ({
          personId,
          name: alias,
          nameLower: alias.toLowerCase(),
          language: detectLanguage(alias), // ← не забудь, что detectLanguage уже есть в файле
        })),
      });
    }
  });

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath(`/people/${personId}`);
  return { success: true };
}