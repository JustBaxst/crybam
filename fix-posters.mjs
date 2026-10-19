import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Берём все дорамы, у которых есть постер
  const dramas = await prisma.drama.findMany({
    where: { posterUrl: { not: null } },
    select: { id: true, title: true, posterUrl: true },
  });

  let updated = 0;

  console.log(`Найдено дорам с постерами: ${dramas.length}\n`);

  for (const drama of dramas) {
    if (drama.posterUrl && drama.posterUrl.includes("medium_portrait")) {
      // Заменяем маленькую версию на оригинальную
      const highResUrl = drama.posterUrl.replace("medium_portrait", "original_untouched");

      await prisma.drama.update({
        where: { id: drama.id },
        data: { posterUrl: highResUrl },
      });
      
      updated++;
      console.log(`✅ ${drama.title} → заменено на высокое разрешение`);
    }
  }

  console.log(`\n========== ИТОГ ==========`);
  console.log(`  Обновлено постеров: ${updated}`);
  console.log(`==========================`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());