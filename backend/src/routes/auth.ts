import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" }); // Bad Request
    return;
  }

  // Check if username is already taken
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    res.status(409).json({ error: "Username already taken" }); // Conflict
    return;
  }

  // Save new user
  const newUser = await prisma.user.create({
    data: { username, password },
  });

  res.status(201).json({ message: "User registered", userId: newUser.id }); // Created
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  // Check credentials
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" }); // Unauthorized
    return;
  }

  res.status(201).json({ message: "Login successful", userId: user.id });
});

export default router;
