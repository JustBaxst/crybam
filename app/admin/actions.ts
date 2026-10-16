"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeTitle } from "@/lib/drama-utils";

export async function createDrama(formData: FormData) {
  const str = (name: string) =>
    String(formData.get(name) ?? "").trim() || null;
  const num = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const title = str("title");
  if (!title) {
    return { error: "Название обязательно" };
  }

  const drama = await prisma.drama.create({
    data: {
      title,
      titleLower: normalizeTitle(title),
      year: num("year"),
      country: str("country"),
      episodes: num("episodes"),
      seasons: num("seasons"),
      episodeDuration: num("episodeDuration"),
    },
  });

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");

  redirect(`/admin/dramas/${drama.id}`);
}

export async function deleteDrama(formData: FormData) {
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID" };
  }

  await prisma.drama.delete({ where: { id: dramaId } });

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");
  revalidatePath("/library");
}