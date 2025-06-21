import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";

const router = Router();
const jwtSecret = process.env.JWT_SECRET!;

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" }); // Bad Request
    return;
  }

  if (username.length < 3) {
    res.status(400).json({ error: "Username must be at least 3 characters" });
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      error:
        "Password must be at least 8 characters and contain uppercase, lowercase, and a number, and a special character (!@#$%^&*)",
    });
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

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save new user to the db
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  // Generate token
  const token = jwt.sign({ id: newUser.id, username }, jwtSecret, {
    expiresIn: "24h",
  });

  res.status(201).json({ username: newUser.username, token }); // Created
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
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" }); // Unauthorized
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Token
  const token = jwt.sign({ id: user.id, username }, jwtSecret, {
    expiresIn: "24h",
  });

  res.status(200).json({ username: user.username, token });
});

export default router;
