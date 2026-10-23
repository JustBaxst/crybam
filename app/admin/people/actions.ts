"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";
import { Gender } from "@prisma/client"; // Импортируем тип Enum из Prisma

const detectLanguage = (text: string) => {
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/[а-яА-Я]/.test(text)) return "ru";
  if (/[\u4e00-\u9fa5]/.test(text)) return "zh";
  if (/[\u3040-\u30ff]/.test(text)) return "ja";
  if (/[a-zA-Z]/.test(text)) return "en";
  return "unknown";
};

// Парсим соцсети из текста (формат: платформа|ссылка)
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
      gender: genderRaw,
      height: num("height"),
      birthPlace: str("birthPlace"),
      socialLinks: {
        create: socialLinks,
      },
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
        gender: genderRaw,
        height: num("height"),
        birthPlace: str("birthPlace"),
      },
    });

    // Обновляем соцсети (удаляем старые, создаем новые)
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

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath("/admin/people");
  revalidatePath(`/people/${personId}`);
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
          language: detectLanguage(alias),
        })),
      });
    }
  });

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath(`/people/${personId}`);
  return { success: true };
}