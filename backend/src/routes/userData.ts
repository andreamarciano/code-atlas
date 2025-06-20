import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

/* FAVORITES */

// Adds a language to a user's favorites
router.post("/favorites", async (req: Request, res: Response) => {
  const { userId, languageId } = req.body;

  try {
    const favorite = await prisma.favoriteLanguage.create({
      data: { userId, languageId },
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(409).json({ error: "Already favorited or invalid data" });
  }
});

// Removes a language from favorites
router.delete("/favorites", async (req: Request, res: Response) => {
  const { userId, languageId } = req.body;

  try {
    await prisma.favoriteLanguage.deleteMany({
      where: { userId, languageId },
    });

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Returns all of a user's preferred languages
router.get("/favorites/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  const favorites = await prisma.favoriteLanguage.findMany({
    where: { userId },
    include: { language: true },
  });

  res.json(favorites.map((fav) => fav.language));
});

/* NOTES */

// Save or update a user note about a language
router.post("/notes", async (req, res) => {
  const { userId, languageId, content } = req.body;

  const existing = await prisma.note.findFirst({
    where: { userId, languageId },
  });

  if (existing) {
    const updated = await prisma.note.update({
      where: { id: existing.id },
      data: { content },
    });
    res.json(updated);
  } else {
    const created = await prisma.note.create({
      data: { userId, languageId, content },
    });
    res.status(201).json(created);
  }
});

// Retrieve an existing note
router.get("/notes", async (req, res) => {
  const userId = parseInt(req.query.userId as string);
  const languageId = parseInt(req.query.languageId as string);

  const note = await prisma.note.findFirst({
    where: { userId, languageId },
  });

  res.json(note || { content: "" });
});

export default router;
