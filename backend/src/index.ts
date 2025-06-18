import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import langRoutes from "./routes/languages";

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

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
