"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";
import { CURRENT_USER_ID } from "@/lib/current-user"; // ← Добавили для логов
import { Gender } from "@prisma/client";
import { getPersonStatus } from "@/lib/check-person-status";
import { detectLanguage } from "@/lib/language-utils";

const parseSocialLinks = (raw: string) => {
  if (!raw) return [];
  return raw.split(/\n/).map((line) => {
    const [platform, url] = line.split("|").map((s) => s.trim());
    return platform && url ? { platform, url } : null;
  }).filter(Boolean) as { platform: string; url: string }[];
};

export async function createPerson(formData: FormData) {
  await requireModerator();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя обязательно" };

  const str = (n: string) => String(formData.get(n) ?? "").trim() || null;
  const date = (n: string) => {
    const raw = String(formData.get(n) ?? "").trim();
    return raw ? new Date(raw) : null;
  };
  const num = (n: string) => {
    const raw = String(formData.get(n) ?? "").trim();
    if (!raw) return null;
    const val = Number(raw);
    return isNaN(val) ? null : val;
  };

  const genderRaw = str("gender") as Gender | null;
  const socialLinks = parseSocialLinks(String(formData.get("socialLinks") ?? ""));

  const person = await prisma.person.create({
    data: {
      name,
      nameLower: name.toLowerCase(),
      photoUrl: str("photoUrl"),
      agency: str("agency"),
      bio: str("bio"),
      birthDate: date("birthDate"),
      nationality: str("nationality"),
      gender: genderRaw,
      height: num("height"),
      birthPlace: str("birthPlace"),
      bloodType: str("bloodType"),
      mbti: str("mbti"),
      zodiacWestern: str("zodiacWestern"),
      zodiacChinese: str("zodiacChinese"),
      socialLinks: {
        create: socialLinks,
      },
    },
  });

  // Логирование создания
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "PERSON_CREATED",
      entityType: "person",
      entityId: person.id,
      entityName: person.name,
      isPublic: true,
    }
  });

  // Проверка: если сразу создали зелёного (маловероятно, но возможно, если заполнили всё)
  const status = await getPersonStatus(person.id);
  if (status === "green") {
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "PERSON_COMPLETED",
        entityType: "person",
        entityId: person.id,
        entityName: person.name,
        isPublic: true,
      }
    });
  }

  revalidatePath("/admin/people");
  redirect(`/admin/people/${person.id}`);
}

export async function updatePerson(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) {
    return { error: "Неверный ID" };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя обязательно" };

  const str = (n: string) => String(formData.get(n) ?? "").trim() || null;
  const date = (n: string) => {
    const raw = String(formData.get(n) ?? "").trim();
    return raw ? new Date(raw) : null;
  };
  const num = (n: string) => {
    const raw = String(formData.get(n) ?? "").trim();
    if (!raw) return null;
    const val = Number(raw);
    return isNaN(val) ? null : val;
  };

  const genderRaw = str("gender") as Gender | null;
  const socialLinks = parseSocialLinks(String(formData.get("socialLinks") ?? ""));

  // Запоминаем статус ДО обновления
  const oldStatus = await getPersonStatus(personId);

  await prisma.$transaction(async (tx) => {
    await tx.person.update({
      where: { id: personId },
      data: {
        name,
        nameLower: name.toLowerCase(),
        photoUrl: str("photoUrl"),
        agency: str("agency"),
        bio: str("bio"),
        birthDate: date("birthDate"),
        nationality: str("nationality"),
        gender: genderRaw,
        height: num("height"),
        birthPlace: str("birthPlace"),
        bloodType: str("bloodType"),
        mbti: str("mbti"),
        zodiacWestern: str("zodiacWestern"),
        zodiacChinese: str("zodiacChinese"),
      },
    });

    await tx.personSocialLink.deleteMany({ where: { personId } });
    if (socialLinks.length > 0) {
      await tx.personSocialLink.createMany({
        data: socialLinks.map((link) => ({
          personId,
          platform: link.platform,
          url: link.url,
        })),
      });
    }
  });

  // Логирование обновления
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "PERSON_UPDATED",
      entityType: "person",
      entityId: personId,
      entityName: name,
      isPublic: true,
    }
  });

  // Проверка на "позеленение"
  const newStatus = await getPersonStatus(personId);
  if (oldStatus !== "green" && newStatus === "green") {
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "PERSON_COMPLETED",
        entityType: "person",
        entityId: personId,
        entityName: name,
        isPublic: true,
      }
    });
  }

  const fromDrama = formData.get("fromDrama");

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath("/admin/people");
  revalidatePath(`/people/${personId}`);

  if (fromDrama) {
    redirect(`/admin/dramas/${fromDrama}`);
  }

  return { success: true };
}

export async function deletePerson(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) {
    return { error: "Неверный ID" };
  }

  const creditsCount = await prisma.credit.count({ where: { personId } });
  if (creditsCount > 0) {
    return { error: "Нельзя удалить. Сначала удалите его роли из дорам." };
  }

  const person = await prisma.person.findUnique({ where: { id: personId }, select: { name: true } });

  // Мягкое удаление
  await prisma.person.update({
    where: { id: personId },
    data: { deletedAt: new Date() }
  });

  // Логирование
  if (person) {
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "PERSON_DELETED",
        entityType: "person",
        entityId: personId,
        entityName: person.name,
        isPublic: true,
      }
    });
  }

  revalidatePath("/admin/people");
  redirect("/admin/people");
}

export async function updatePersonAliases(formData: FormData) {
  await requireModerator();

  const personId = Number(formData.get("personId"));
  if (!Number.isInteger(personId) || personId <= 0) return { error: "Неверный ID" };

  const aliasesRaw = String(formData.get("aliases") ?? "").trim();
  const aliasNames = aliasesRaw ? aliasesRaw.split(/\n/).map((s) => s.trim()).filter(Boolean) : [];

  // Запоминаем статус ДО
  const oldStatus = await getPersonStatus(personId);

  await prisma.$transaction(async (tx) => {
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

  // Проверка на "позеленение" (так как алиасы — критический фактор)
  const newStatus = await getPersonStatus(personId);
  if (oldStatus !== "green" && newStatus === "green") {
    const person = await prisma.person.findUnique({ where: { id: personId }, select: { name: true } });
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "PERSON_COMPLETED",
        entityType: "person",
        entityId: personId,
        entityName: person?.name || "Без имени",
        isPublic: true,
      }
    });
  }

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath(`/people/${personId}`);
  return { success: true };
}