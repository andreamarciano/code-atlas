# 2 - Searchbar: Language Lookup and Navigation

This note explains how we made the **search bar in the Topbar functional** by connecting it to the backend and enabling navigation to the corresponding language page.

## Table of Contents

- [Backend Refactor: Centralizing Language Routes](#routes)
- [Frontend: Implementing the Search Logic](#frontend)

---

## Backend Refactor: Centralizing Language Routes {#routes}

To better structure our API, we moved all `/languages`-related routes to a dedicated file: `src/routes/languages.ts`.

```text
/backend
  ├── /src
  │   ├── /routes
  │   │    └── languages.ts 
  │   ├── index.ts         
  │   ├── prismaClient.ts
  │   └── seed.ts
```

### `index.ts`

We import and mount the language router:

```ts
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
```

---

### Languages Route

Inside `routes/languages.ts`, we define a new route to fetch a language by its name:

```ts
import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// GET all languages
router.get("/", async (req: Request, res: Response) => {
  const languages = await prisma.language.findMany();

  res.json(languages);
});

// GET one language (search bar)
router.get("/:name", async (req: Request, res: Response) => {
  const { name } = req.params;

  const language = await prisma.language.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (!language) {
    res.status(404).json({ error: "Language not found" });
    return;
  }

  res.json(language);
});
```

- This endpoint performs a **case-insensitive match** on the `name` field.
- Returns the full language object if found, or a `404` if not found.

---

## Frontend: Implementing the Search Logic {#frontend}

In the `Topbar` component, we turned the search input into a form and added an `onSubmit` handler that:

1. Fetches the language by name from the backend.
2. Navigates to `/language/{name}` if it exists.
3. Redirects to `/not-found` otherwise.

### Topbar.tsx

```tsx
import { useNavigate } from "react-router-dom";
import type { FormEvent, MouseEvent } from "react";

function Topbar() {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/languages/${encodeURIComponent(query)}`
      );

      if (res.ok) {
        const language = await res.json();
        navigate(`/language/${language.name.toLowerCase()}`);
      } else {
        navigate("/not-found");
      }
    } catch (err) {
      console.error("Search failed:", err);
      navigate("/not-found");
    }
  };

  return (
      <form onSubmit={handleSearch}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
        >
          <svg></svg>
        </button>
      </form>
  );
}
```
