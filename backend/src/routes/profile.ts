import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../types/auth";

const router = Router();

// DELETE USER
router.delete("/", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: "User and related data deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// CHANGE EMAIL
router.put("/email", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { email } = req.body;

  try {
    // Format control
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    // Check if the New email is the same as the Old email
    const oldEmail = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (oldEmail?.email === email) {
      res
        .status(400)
        .json({ error: "New email cannot be the same as old email" });
      return;
    }

    // Check if email is already taken
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Update email
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email },
    });
    res.json({ email: updated.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update email" });
  }
});

// MODIFY NEWSLETTER
router.put("/newsletter", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { newsletter } = req.body;

  try {
    if (typeof newsletter !== "boolean") {
      res.status(400).json({ error: "Invalid newsletter value" });
      return;
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { newsletter },
    });

    res.json({ newsletter: updated.newsletter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update newsletter", err });
  }
});

export default router;
