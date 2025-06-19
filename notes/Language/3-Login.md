# 🔐 3 - Login and Register System

This step adds basic user authentication to the Code Atlas backend using **Prisma**, **PostgreSQL**, and **Express**.

## Table of Contents

Backend:

- [Add the `User` model to Prisma schema](#usermodel)
- [Create `auth` routes](#authroutes)
- [Test the endpoints](#test)

Frontend:

---

## Add the `User` model to Prisma schema {#usermodel}

Inside `schema.prisma`:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}
```

Then apply the migration:

> 💡 If you're adding new models to the Prisma schema, see:

- [`1-Navbar.md`](./notes/Language/1-Navbar.md) – detailed steps on how to apply migrations, handle drift, and seed data in Docker.

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

## Test the endpoints {#test}

You can now test the routes using the **REST Client extension** in VS Code:

```http
### Register a user POST /AUTH/REGISTER
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "username": "arzi",
  "password": "123"
}

### Login a user POST /AUTH/LOGIN
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "username": "arzi",
  "password": "123"
}
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
 public | Language           | table | postgres
 public | User               | table | postgres
 public | _prisma_migrations | table | postgres
(3 rows)

codeatlas=# SELECT * from "User";
 id | username | password 
----+----------+----------
  1 | arzi     | 123
  2 | arzi2    | 123
```
