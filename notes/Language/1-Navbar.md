# 1 - Navbar: Seeding Languages and Displaying Them in the Navbar

This note explains how we set up a static seed to populate our database with supported programming languages, and how these languages are fetched and displayed in the Navbar component.

## Table of Contents

- [Backend Setup: Seed Static Languages](#seed)
- [Frontend: Fetching Seeded Languages in Navbar](#frontend)

---

## Backend Setup: Seed Static Languages {#seed}

```text
/backend                  
   ├── /prisma
   │   ├── /migrations
   │   └── schema.prisma
   ├── /src
   │   ├── seed.ts   
   │   ├── prismaClient.ts  
   │   └── index.ts             
   ├── entrypoint.sh             
   ├── docker-compose.yaml  
   ├── Dockerfile
   └── package.json
```

### 1. `seed.ts`

We use a seed script to **prepopulate the database** with these languages, so the frontend can fetch and display them immediately.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const initialLanguages = [
    { name: "HTML" },
    ...
  ];

  for (const lang of initialLanguages) {
    await prisma.language.upsert({
      where: { name: lang.name },
      update: {},
      create: lang,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- Contains an array of initial languages (e.g., HTML, CSS, JavaScript, etc.)
- Uses Prisma's `upsert` method to insert or skip if the language already exists (idempotent seed)
- Runs as a standalone script to populate the database

Certo! Ecco una sezione aggiuntiva da integrare nella parte del seed nel tuo documento, in inglese, con una spiegazione discorsiva e chiara:

#### Why We Use a Separate Prisma Client in `seed.ts`

In the `seed.ts` file, we explicitly create a new instance of the `PrismaClient`. This is **separate** from the shared Prisma client used in `prismaClient.ts` (which is imported by the main server). Here's why:

- **Decoupling from the server lifecycle**: The seed script is a standalone process. It doesn't run as part of the server request cycle, so it shouldn't reuse the same client instance that's tied to a long-lived Express server.

- **Avoid accidental side effects**: By creating a dedicated `PrismaClient`, we avoid interference with other parts of the backend that might be using the shared client, especially if this script is run manually or inside a container during setup.

- **Explicit resource management**: We call `prisma.$disconnect()` at the end of the script to ensure all DB connections are closed properly. This is important because:

  - It prevents hanging processes (especially in CI/CD or Docker).
  - It avoids warnings or memory leaks from unclosed connections.

### 2. `package.json`

- Add a new script to run the seed

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/index.ts",
  "seed": "ts-node src/seed.ts"
},
```

### 3. `entrypoint.sh`

Shell script to run inside the Docker container to automate migrations, seeding, and starting the server:

```sh
#!/bin/sh

echo "Applying Prisma DB migrations..."
npx prisma migrate deploy

echo "Seeding initial data..."
npx ts-node src/seed.ts

echo "Starting development server..."
npm run dev
```

### 4. `Dockerfile`

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Make entrypoint.sh executable
RUN chmod +x entrypoint.sh

EXPOSE 4000

# Automate migration + seed + server
ENTRYPOINT ["./entrypoint.sh"]
```

### 5. Docker Compose

Running `docker compose up --build` will:

- Build the container
- Apply migrations
- Seed data
- Start the server

---

## Frontend: Fetching Seeded Languages in Navbar {#frontend}

Once the backend is seeded with supported languages, the frontend can fetch this list and display it in the Navbar dynamically.

Since the Navbar (like Topbar and Footer) is shared across pages, we render it inside the `App` layout component, which wraps all routes.

### main.tsx

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout
    children: [
      { index: true, element: <Home /> },
      { path: "language/:name", element: <LanguagePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

### App.tsx

```tsx
import { Outlet } from "react-router-dom";
import type { Language } from "./type";

function App() {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/languages");
        const data = await res.json();
        setLanguages(data);
      } catch (err) {
        console.error("Error fetching languages in Navbar:", err);
      }
    };
    fetchLanguages();
  }, []);

  return (
    <>
      <Topbar />
      <Navbar languages={languages} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
```

### Navbar.tsx

```tsx
import { NavLink } from "react-router-dom";
import type { Language } from "../type";

type NavbarProps = {
  languages: Language[];
};

function Navbar({ languages }: NavbarProps) {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">
            Home
          </NavLink>
        </li>
        {languages.map((lang) => (
          <li key={lang.id}>
            <NavLink to={`/language/${lang.name.toLowerCase()}`}>
              {lang.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### LanguagePage.tsx

```tsx
import { useParams } from "react-router-dom";

function LanguagePage() {
  const { name } = useParams<{ name: string }>();

  return (
    <div>
      <h2>Language: {name}</h2>
    </div>
  );
}
```
