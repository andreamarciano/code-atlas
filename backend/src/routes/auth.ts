import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";

const router = Router();
const jwtSecret = process.env.JWT_SECRET!;

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    birthDate,
    newsletter,
  } = req.body;

  /* Check Data */

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" }); // Bad Request
    return;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  // Check if email is already taken
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    res.status(409).json({ error: "Email already registered" }); // Conflict
    return;
  }

  // Birhdate
  if (!birthDate) {
    res.status(400).json({ error: "Birth date is required" });
    return;
  }
  const date = new Date(birthDate);
  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const maxBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  if (date < minBirthDate || date > maxBirthDate) {
    res
      .status(400)
      .json({ error: "You must be between 18 and 100 years old." });
    return;
  }

  // Username
  if (username.length < 3) {
    res.status(400).json({ error: "Username must be at least 3 characters" });
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

  // Password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      error:
        "Password must be at least 8 characters and contain uppercase, lowercase, and a number, and a special character (!@#$%^&*)",
    });
    return;
  }

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save new user to the db
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      newsletter: Boolean(newsletter),
    },
  });

  // Generate token
  const token = jwt.sign({ id: newUser.id, username }, jwtSecret, {
    expiresIn: "24h",
  });

  res.status(201).json({
    username: newUser.username,
    token,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    birthDate: newUser.birthDate,
    newsletter: newUser.newsletter,
  }); // Created
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
