# Code Atlas - Fullstack Project with React, Node.js, Prisma & PostgreSQL

This is a fullstack project showcasing a modern web app stack, built with the following technologies:

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Containerization:** Docker & Docker Compose

---

## Project Overview

**Code Atlas** is a personal technical documentation platform inspired by sites like `W3Schools` and `TutorialRepublic`.  
It provides a scalable, type-safe architecture to create, manage, and serve tutorial content on programming languages and technologies.

### Core Features

- A **dynamic content management system** for tutorials, where content (sections, topics, code snippets) is stored in PostgreSQL and managed via Prisma.  
- Backend API exposing content via REST endpoints built with Express and Prisma.  
- A React frontend consuming backend APIs to render tutorials, code examples, and navigation dynamically.  
- Markdown support for rich text tutorials, including code blocks and formatting.  
- Dockerized backend and database for consistent development and deployment environments.  
- Full TypeScript support for end-to-end type safety.

### Why this project?

It is designed to help practice:

- Modeling and querying relational data with Prisma and PostgreSQL.  
- Building robust RESTful APIs.  
- Integrating a React frontend with a backend API for dynamic data.  
- Using Docker to containerize backend and database for easy setup.

---

## 📦 Getting Started

Clone the repository:

```bash
git clone https://github.com/andreamarciano/code-atlas
cd code-atlas
```

### Install dependencies

Open two terminals:

- Frontend:

```bash
cd frontend
npm install
```

- Backend:

```bash
cd /backend
npm install
```

### Run development servers

Open two terminals:

#### Frontend

```bash
npm run dev
```

#### Backend

##### First-time Setup (or after Dockerfile or Prisma schema changes)

```bash
docker compose up --build
```

- This will:

  - Build the Docker images
  - Apply Prisma migrations (`npx prisma migrate deploy`)
  - Seed the database with initial languages (`ts-node src/seed.ts`)
  - Start the development server (`npm run dev`)
- Everything is automated via the `entrypoint.sh` script inside the container.

##### Regular Development (after initial build)

```bash
docker compose up
```

##### **Stop backend** and database containers

```bash
docker compose down
```

---

## Detailed configuration steps

For detailed initial configuration steps, see:

- [FrontendSetup.md](./notes/FrontendSetup.md)
- [BackendSetup.md](./notes/BackendSetup.md)

---

## 🗂️ Project Structure Overview

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
│   ├── /node_modules
│   ├── /public
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── /notes 
│   ├── BackendSetup.md
│   ├── FrontendSetup.md
│   ├── TestDockerConnection.md
│   └── TestExpressConnection.md
│
└── README.md
```
