import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const initialLanguages = [
    { name: "HTML" },
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "TypeScript" },
    { name: "GitHub" },
    { name: "React" },
    { name: "TailwindCSS" },
    { name: "Node" },
    { name: "Express" },
    { name: "SQL" },
    { name: "Prisma" },
  ];

  for (const lang of initialLanguages) {
    // Upsert: Tries to find a language with the same name. If found, no changes are made. If not, a new language is created.
    await prisma.language.upsert({
      where: { name: lang.name },
      update: {},
      create: lang,
    });
  }

  console.log("✅ Seeded initial languages.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
