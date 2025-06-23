import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../types/auth";

const router = Router();

/* FAVORITES */

// Adds a language to a user's favorites
router.post("/favorites", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { languageId } = req.body;

  try {
    const favorite = await prisma.favoriteLanguage.create({
      data: { userId, languageId },
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(409).json({ error: "Already favorited or invalid data" });
  }
});

// Returns all of a user's preferred languages
router.get("/favorites", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;

  const favorites = await prisma.favoriteLanguage.findMany({
    where: { userId },
    include: { language: true },
  });

  res.json(favorites.map((fav) => fav.language));
});

// Removes a language from favorites
router.delete("/favorites", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { languageId } = req.body;

  try {
    await prisma.favoriteLanguage.deleteMany({
      where: { userId, languageId },
    });

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Remove all favorites
router.delete("/favorites/all", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;

  try {
    await prisma.favoriteLanguage.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: "Removed all favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove all favorites" });
  }
});

/* NOTES */

// Save or update a user note about a language
router.post("/notes", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { languageId, content } = req.body;

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
router.get("/notes", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const languageId = parseInt(req.query.languageId as string);

  const note = await prisma.note.findFirst({
    where: { userId, languageId },
  });

  res.json(note || { content: "" });
});

// Retrieve all user notes
router.get("/notes/all", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;

  const notes = await prisma.note.findMany({
    where: { userId },
    include: { language: true },
  });

  res.json(notes);
});

// Remove all notes
router.delete("/notes/all", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;

  try {
    await prisma.note.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: "Removed all notes" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove all notes" });
  }
});

// Remove one note
router.delete("/notes/:languageId", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const languageId = parseInt(req.params.languageId);

  if (!languageId) {
    res.status(400).json({ error: "Missing languageId" });
    return;
  }

  try {
    const note = await prisma.note.findFirst({
      where: { userId, languageId },
    });

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    await prisma.note.delete({
      where: { id: note.id },
    });

    res.status(200).json({ message: "Note removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove note" });
  }
});

export default router;
