# 🔐 3 - Login and Register System

This step adds basic user authentication to the Code Atlas backend using **Prisma**, **PostgreSQL**, and **Express**.

## Table of Contents

Backend:

- [Add the `User` model to Prisma schema](#usermodel)
- [Create `auth` routes](#authroutes)
- [Create `userData` routes](#userroutes)
- [Test the endpoints](#test)

Frontend:

---

## Add the `User` model to Prisma schema {#usermodel}

Inside `schema.prisma`:

```prisma
model Language {
  id       Int                @id @default(autoincrement())
  name     String             @unique
  favorite FavoriteLanguage[]
  Note     Note[]
}

model User {
  id       Int                @id @default(autoincrement())
  username String             @unique
  password String
  favorite FavoriteLanguage[]
  Note     Note[]
}

// Many-to-many
model FavoriteLanguage {
  id         Int      @id @default(autoincrement())
  userId     Int
  languageId Int
  user       User     @relation(fields: [userId], references: [id])
  language   Language @relation(fields: [languageId], references: [id])

  @@unique([userId, languageId])
}

// One-to-many
model Note {
  id         Int      @id @default(autoincrement())
  content    String
  userId     Int
  languageId Int
  user       User     @relation(fields: [userId], references: [id])
  language   Language @relation(fields: [languageId], references: [id])
}
```

Then apply the migration:

> 💡 If you're adding new models to the Prisma schema, see:

- [`1-Navbar.md`](./1-Navbar.md) – detailed steps on how to apply migrations, handle drift, and seed data in Docker.

---

## Create `auth` routes {#authroutes}

Create a new route file: `backend/src/routes/auth.ts`.

This will handle both `register` and `login`.

```ts
import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  // Check if username is already taken
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  // Save new user
  const newUser = await prisma.user.create({
    data: { username, password },
  });

  res.status(201).json({ message: "User registered", userId: newUser.id });
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
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.status(201).json({ message: "Login successful", userId: user.id });
});
```

Then connect the route in your `index.ts`:

```ts
import authRoutes from "./routes/auth";
app.use("/api/auth", authRoutes);
```

---

## Create `userData` routes {#userroutes}

Create a new route file: `backend/src/routes/userData.ts`.

This will handle both **Favorite Languages** and **Notes**.

```ts
import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

/* FAVORITES */

// Adds a language to a user's favorites
router.post("/favorites", async (req: Request, res: Response) => {
  const { userId, languageId } = req.body;

  try {
    const favorite = await prisma.favoriteLanguage.create({
      data: { userId, languageId },
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(409).json({ error: "Already favorited or invalid data" });
  }
});

// Removes a language from favorites
router.delete("/favorites", async (req: Request, res: Response) => {
  const { userId, languageId } = req.body;

  try {
    await prisma.favoriteLanguage.deleteMany({
      where: { userId, languageId },
    });

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Returns all of a user's preferred languages
router.get("/favorites/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  const favorites = await prisma.favoriteLanguage.findMany({
    where: { userId },
    include: { language: true },
  });

  res.json(favorites.map((fav) => fav.language));
});

/* NOTES */

// Save or update a user note about a language
router.post("/notes", async (req, res) => {
  const { userId, languageId, content } = req.body;

  const existing = await prisma.note.findFirst({
    where: { userId, languageId },
  });

  if (existing) {
    const updated = await prisma.note.update({
      where: { id: existing.id },
      data: { content },
    });
    res.json(updated);
  } else {
    const created = await prisma.note.create({
      data: { userId, languageId, content },
    });
    res.status(201).json(created);
  }
});

// Retrieve an existing note
router.get("/notes", async (req, res) => {
  const userId = parseInt(req.query.userId as string);
  const languageId = parseInt(req.query.languageId as string);

  const note = await prisma.note.findFirst({
    where: { userId, languageId },
  });

  res.json(note || { content: "" });
});
```

Then connect the route in your `index.ts`:

```ts
import userDataRoutes from "./routes/userData";
app.use("/api/user", userDataRoutes);
```

---

## Test the endpoints {#test}

You can now test the routes using the **REST Client extension** in VS Code:

```http
### Register a user - POST /AUTH/REGISTER
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "username": "test",
  "password": "123"
}

### Login a user - POST /AUTH/LOGIN
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "username": "test",
  "password": "123"
}

### Adds a language to a user's favorites - POST /USER/FAVORITES
POST http://localhost:4000/api/user/favorites
Content-Type: application/json

{
  "userId": 1,
  "languageId": 2
}

### Removes a language from favorites - DELETE /USER/FAVORITES
DELETE http://localhost:4000/api/user/favorites
Content-Type: application/json

{
  "userId": 1,
  "languageId": 2
}

### Returns all of a user's preferred languages - GET /USER/FAVORITES/:userId
GET http://localhost:4000/api/user/favorites/1

### Save or update a user note about a language - POST /USER/NOTES
POST http://localhost:4000/api/user/notes
Content-Type: application/json

{
  "userId": 1,
  "languageId": 3,
  "content": "Review this language."
}

### Retrieve an existing note - GET /USER/NOTES?userId=&languageId=
GET http://localhost:4000/api/user/notes?userId=1&languageId=3
```

If everything works correctly, you should get:

- `201 Created` on successful register
- `200 OK` on login, with the user ID in response

We can inspect the database directly using the following command:

```bash
docker exec -it codeatlas-db psql -U postgres -d codeatlas
```

```text
codeatlas=# \dt
               List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | FavoriteLanguage   | table | postgres
 public | Language           | table | postgres
 public | Note               | table | postgres
 public | User               | table | postgres
 public | _prisma_migrations | table | postgres
(5 rows)

codeatlas=# SELECT * FROM "Language";
 id |    name     
----+-------------
  1 | HTML
  2 | CSS
  3 | JavaScript
  4 | TypeScript
  5 | GitHub
  6 | React
  7 | TailwindCSS
  8 | Node
  9 | Express
 10 | SQL
 11 | Prisma
(11 rows)

codeatlas=# SELECT * FROM "User";
 id | username | password 
----+----------+----------
  1 | arzi     | 123
  2 | arzi2    | 123
  3 | joel     | hey
  4 | test     | 123
(4 rows)

<!-- Add Favorite -->
codeatlas=# select * from "FavoriteLanguage";
 id | userId | languageId 
----+--------+------------
  1 |      4 |          2
  2 |      1 |          3
  3 |      1 |          2
(3 rows)

<!-- Delete Favorite -->
codeatlas=# select * from "FavoriteLanguage";
 id | userId | languageId 
----+--------+------------
  1 |      4 |          2
  2 |      1 |          3
(2 rows)

<!-- Add Note -->
codeatlas=# select * from "Note";
 id |              content               | userId | languageId 
----+------------------------------------+--------+------------
  1 | I must remember to close the tags! |      4 |          2
  2 | Review this language.              |      1 |          3
(2 rows)
```
