import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../types/auth";

const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: "User and related data deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
