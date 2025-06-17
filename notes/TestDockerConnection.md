# 🔗 Test Frontend ↔ Backend Connection (Prisma + PostgreSQL + Docker)

This guide helps you verify that your frontend (React + Vite) is properly communicating with your backend (Node.js + Express + Prisma) using PostgreSQL inside Docker containers.

## Table of Contents

- [1. Add Prisma Model and Generate Client](#prismamodel)
- [2. Build Docker Containers](#build)
- [3. Run Prisma Migrations](#migration)
- [4. Start Docker Compose](#compose)
- [5. Verify Backend and Frontend Integration](#frontback)
- [6. Query the Database Directly](#querydb)

---

## 1. Add Prisma Model and Generate Client {#prismamodel}

Add the `Language` model to your `prisma/schema.prisma`:

```prisma
model Language {
  id   Int    @id @default(autoincrement())
  name String
}
```

Then generate the Prisma client:

```bash
npx prisma generate
```

---

## 2. Build Docker Containers {#build}

Build your backend and PostgreSQL containers with:

```bash
docker compose build
```

Example output:

```bash
[+] Building 12.5s (12/12) FINISHED docker-desktop-linux
 => [app internal] load build definition from Dockerfile                  0.0s
 => [app internal] load metadata for docker.io/library/node:22-alpine     1.5s
 => [app 3/5] COPY package*.json ./                                       0.2s
 => [app 4/5] RUN npm install                                             9.7s
 => [app 5/5] COPY . .                                                    0.9s
 => [app] exporting to image                                              12.5s
 => => exporting layers                                                    9.3s
 => => naming to docker.io/library/backend-app:latest                     0.0s
[+] Building 1/1
 ✔ app  Built
```

---

## 3. Run Prisma Migrations {#migration}

Run the database migrations inside the Docker container:

```bash
docker compose run app npx prisma migrate dev --name init
```

Example output:

```bash
[+] Creating 3/3
 ✔ Network backend_default         Created                                   0.0s 
 ✔ Volume "backend_postgres-data"  Created                                   0.0s 
 ✔ Container codeatlas-db          Created                                   0.2s 
[+] Running 1/1
 ✔ Container codeatlas-db  Started                                         0.6s 
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "codeatlas", schema "public" at "db:5432"

Applying migration `20250617210047_init`

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 334ms
```

---

## 4. Start Docker Compose {#compose}

Start the backend and database containers:

```bash
docker compose up
```

Example output:

```bash
[+] Running 2/2
 ✔ Container codeatlas-db   Running       0.0s
 ✔ Container codeatlas-app  Created       0.1s
Attaching to codeatlas-app, codeatlas-db

codeatlas-app  |
codeatlas-app  | > code-atlas-backend@1.0.0 dev
codeatlas-app  | > nodemon --watch src --exec ts-node src/index.ts
codeatlas-app  |
codeatlas-app  | [nodemon] 3.1.10
codeatlas-app  | [nodemon] to restart at any time, enter `rs`
codeatlas-app  | [nodemon] watching path(s): src/**/*
codeatlas-app  | [nodemon] starting `ts-node src/index.ts`
codeatlas-app  | Backend running at http://localhost:4000

v View in Docker Desktop   o View Config   w Enable Watch
```

---

## 5. Verify Backend and Frontend Integration {#frontback}

- Make sure your backend server is running on the configured port (e.g., `http://localhost:4000`).
- Add the necessary Express routes in your backend's `index.ts` to expose the `/api/languages` endpoints (GET and POST).

```ts
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

```

- In your React frontend `App.tsx`, implement the fetch calls and UI to add and list languages:

```tsx
import { useState } from "react";

type Language = {
  id: number;
  name: string;
};

function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLanguages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/languages");
      const data = await res.json();
      setLanguages(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load languages.");
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Server error");
      setName("");
      await fetchLanguages(); // Refresh list
    } catch (err) {
      console.error("Post error:", err);
      setError("Failed to add language.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Languages DB Test</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a language"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addLanguage}>
          Add
        </button>
      </div>

      <button onClick={fetchLanguages}>
        Load Languages
      </button>

      {loading && <p>⏳ Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {languages.map((lang) => (
          <li key={lang.id}>{lang.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

Start your frontend server:

```bash
cd frontend
npm run dev
```

---

## 6. Query the Database Directly {#querydb}

After inserting data via the frontend, you can connect directly to the PostgreSQL container to verify the records:

```bash
docker exec -it codeatlas-db psql -U postgres -d codeatlas
```

Once inside the psql shell, run:

```sql
SELECT * FROM "Language";
```

Example output:

```text
 id |    name
----+------------
  1 | javascript
  2 | html
(2 rows)
```
