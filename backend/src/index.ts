import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prismaClient";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/languages", async (req: Request, res: Response) => {
  const languages = await prisma.language.findMany();
  res.json(languages);
});

app.post("/api/languages", async (req: Request, res: Response) => {
  const { name } = req.body;
  const newLanguage = await prisma.language.create({
    data: { name },
  });
  res.json(newLanguage);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
