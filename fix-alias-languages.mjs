import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const detectLanguage = (text) => {
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/[а-яА-Я]/.test(text)) return "ru";
  if (/[\u4e00-\u9fa5]/.test(text)) return "zh"; 
  if (/[\u3040-\u30ff]/.test(text)) return "ja";
  if (/[a-zA-Z]/.test(text)) return "en";
  return "unknown";
};

async function main() {
  const aliases = await prisma.personAlias.findMany();
  for (const alias of aliases) {
    const lang = detectLanguage(alias.name);
    if (alias.language !== lang) {
      await prisma.personAlias.update({
        where: { id: alias.id },
        data: { language: lang },
      });
    }
  }
  console.log(`✔ Обновлено языков: ${aliases.length}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());