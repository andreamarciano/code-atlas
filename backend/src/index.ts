import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import langRoutes from "./routes/languages";
import authRoutes from "./routes/auth";
import userDataRoutes from "./routes/userData";

import { verifyToken } from "./middleware/verifyToken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* Middleware */
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(express.json());

/* API */
app.use("/api/languages", langRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userDataRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
