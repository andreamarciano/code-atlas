import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// GET all languages
router.get("/", async (req: Request, res: Response) => {
  const languages = await prisma.language.findMany();

  res.json(languages);
});

// GET one language (search bar)
router.get("/:name", async (req: Request, res: Response) => {
  const { name } = req.params;

  const language = await prisma.language.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive", // case-insensitive search
      },
    },
  });

  if (!language) {
    res.status(404).json({ error: "Language not found" });
    return;
  }

  res.json(language);
});

export default router;
