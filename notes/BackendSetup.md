# ⚙️ Backend Setup - Node.js, Express, PostgreSQL, Prisma, Docker

## Table of Contents

- [Step 1: Initialize the Backend Project](#step1)
- [Step 2: Install Dependencies](#step2)
- [Step 3: Update `package.json` Scripts](#step3)
- [Step 4: Configure TypeScript](#step4)
- [Step 5: Setup Prisma](#step5)
- [Step 6: Setup Docker](#step6)
- [Step 7: Build and Initialize Database](#step7)
- [Step 8: Start the Backend Server](#step8)
- [Step 9 (optional): Access PostgreSQL CLI](#step9)
- [Step 10: Development Workflow](#step10)
- [Project Structure Overview](#structure)
- [Link to GitHub](#github)
- [Test Frontend-Backend Connection](#testconnection)

## 📦 Step 1: Initialize the Backend Project {#step1}

In the `/backend` folder run:

```bash
npm init -y
```

---

## 📚 Step 2: Install Dependencies {#step2}

### Runtime dependencies

```bash
npm install express dotenv cors @prisma/client pg bcryptjs jsonwebtoken
```

- `express`: Web framework.
- `dotenv`: Load environment variables.
- `cors`: Middleware to enable Cross-Origin requests from the frontend.
- `@prisma/client`: Auto-generated Prisma client.
- `pg`: PostgreSQL client for Node.js.
- `bcryptjs`: Password hashing library.
- `jsonwebtoken`: Create and verify JWT tokens.

### Development dependencies

```bash
npm install -D prisma typescript ts-node nodemon @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
```

- `prisma`: Prisma CLI (schema management, migrations).
- `nodemon`: Auto-restarts on file changes.
- `ts-node`: Runs TypeScript directly.

---

## 📝 Step 3: Update `package.json` scripts {#step3}

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/index.ts"
}
```

---

## 🔧 Step 4: Configure TypeScript {#step4}

Create a `tsconfig.json` file:

```bash
npx tsc --init
```

Update it as follows:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## ⚙️ Step 5: Setup Prisma {#step5}

### 1. Initialize Prisma

```bash
npx prisma init
```

This creates a `prisma/` folder with a `schema.prisma` file, and a `.env` file.

### 2. Edit `schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Define your models below this.

### 3. Generate the Prisma client

```bash
npx prisma generate
```

This generates the TypeScript client you can import and use in your app.

### 4. Create a Prisma Client helper

**`src/prismaClient.ts`**:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

### 5. Set Environment Variables

Edit the `.env` file in the root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codeatlas
PORT=4000
```

---

## 🐳 Step 6: Setup Docker {#step6}

### 1. Dockerfile

Create a `Dockerfile` in your project root with the following contents:

```Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
```

### 2. docker-compose.yaml

Create a `docker-compose.yaml` file in your project root with the following contents:

```yaml
services:
  app:
    build: .
    container_name: codeatlas-app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/codeatlas
      - NODE_ENV=development
      - PORT=4000
    ports:
      - "4000:4000"
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:13-alpine
    container_name: codeatlas-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: codeatlas
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

---

## Step 7: Build and Initialize Database {#step7}

Run from project root:

```bash
docker compose build
```

After defining at least one model in `schema.prisma`, run:

```bash
docker compose run app npx prisma migrate dev --name init
```

This command runs the migration **inside the Docker container**, connecting to the PostgreSQL database defined in your docker-compose.

---

## ▶️ Step 8: Start the Backend Server {#step8}

Start your app and database containers with:

```bash
docker compose up
```

You should see output confirming that PostgreSQL and your Node.js app started successfully.

---

## 🖥️ Step 9 (optional): Access PostgreSQL CLI {#step9}

Open a second terminal and connect to your PostgreSQL database running inside Docker:

```bash
docker exec -it codeatlas-db psql -U postgres -d codeatlas
```

Run queries like:

```sql
\dt
SELECT * FROM "MyTable";
\q  -- quit
```

### 🗄️ Useful PostgreSQL CLI Commands

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `\dt`           | List all tables                     |
| `\d table_name` | Show table schema                   |
| `\l`            | List all databases                  |
| `\c dbname`     | Connect to a different database     |
| `\du`           | List all roles/users                |
| `\conninfo`     | Show current connection information |
| `\q`            | Quit the PostgreSQL CLI             |

---

## 🔄 Step 10: Development Workflow {#step10}

- To **start the server and database**, run:

```bash
docker compose up
```

- To **stop everything**, run:

```bash
docker compose down 
```

### ⚠️ Ctrl+C vs `docker compose down`

  When working with Docker, it's important to understand the difference between **stopping** and **shutting down** containers:

- **Ctrl + C** in the terminal where `docker compose up` is running:

  - This sends a termination signal and **stops** the containers.
  - The containers are still present and can be restarted quickly with `docker compose up`.

- **`docker compose down`**:

  - This **stops and removes** the containers, **networks**, and other resources.
  - It's useful when you want a clean shutdown or to reset the environment.

### Recommendation

- Use **Ctrl + C** during development when you're actively coding and just need to stop the server temporarily.
- Use **`docker compose down`** when you're done working or want to start from a clean state.

---

## 🗂️ Project Structure Overview {#structure}

```text
/code-atlas
│
├── /backend                  # Node.js + Express + Prisma
│   ├── /node_modules
│   ├── /prisma               # Prisma schema and migrations
│   │   ├── /migrations
│   │   └── schema.prisma
│   ├── /src
│   │   ├── prismaClient.ts   # Prisma Client
│   │   └── index.ts          # Entry point
│   ├── .env                  
│   ├── .gitignore
│   ├── docker-compose.yaml   # Docker setup for backend + PostgreSQL
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
│
├── /frontend                 # React + Vite + Tailwind
│   ├── /public
│   ├── /src
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🔗 Link to GitHub {#github}

> Note: This should be done from the root of the entire project. Make sure to exit any subfolders like `/backend` and return to the main project root `/code-atlas`.

```bash
cd ..
git init
git add .
git commit -m "First Commit"
git remote add origin https://github.com/username/repository
git push -u origin main
```

---

## Test Frontend-Backend Connection {#testconnection}

To verify that the backend is running and can communicate with the frontend, follow the steps in the separate guide below:

- [TestExpressConnection.md](TestExpressConnection.md)
  → A minimal test to check if your **Express server is running** and accessible from the frontend.  
  This does **not require Docker or a database**, and helps confirm the basic API connection works.

- [TestDockerConnection.md](TestDockerConnection.md)
  → A full-stack test including **Express + Prisma + PostgreSQL inside Docker**.  
  This verifies that your database is running, migrations are applied, and that the frontend can **read/write data** via the backend.
