# Vite Starter - React + TypeScript + Tailwind CSS

This is a starter project created with **Vite**, using **React** and **TypeScript**.

## 📚 Table of Contents

- [Project Setup](#setup)
- [Installing Dependencies](#dependencies)
- [Running the Development Server](#running)
- [Installing Tailwind CSS](#tailwind)
- [Project Structure Overview](#structure)

---

## ⚙️ Project Setup {#setup}

To create this project, the following commands and options were used:

```bash
npm create vite@latest code-atlas --template react-ts
```

- Select **React** as the framework
- Select **TypeScript** as the variant

Optionally, you can update your global npm version:

```bash
npm install -g npm@latest
```

---

## Installing Dependencies {#dependencies}

Inside the project folder, run:

```bash
npm install
```

---

## Running the Development Server {#running}

Start the dev server with:

```bash
npm run dev
```

This will launch the app at `http://localhost:5173` (default Vite port).

---

## Installing Tailwind CSS {#tailwind}

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configure the Vite plugin

Add the `@tailwindcss/vite` plugin to your `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Import Tailwind CSS

Add an `@import` to your `App.css` file:

```css
@import "tailwindcss";
```

---

## 🗂️ Project Structure Overview {#structure}

```text
/frontend
│
├── /node_modules
├── /public
├── /src
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Continue with the Backend Setup

Set up the backend (Node.js, Express, Prisma, PostgreSQL) in the next part:

📄 [Go to BackendSetup.md](./BackendSetup.md)
