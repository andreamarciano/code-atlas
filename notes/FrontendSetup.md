# Vite Starter - React + TypeScript + Tailwind CSS

This is a starter project created with **Vite**, using **React** and **TypeScript**.

## 📚 Table of Contents

- [Project Setup](#setup)
- [Installing Dependencies](#dependencies)
- [Running the Development Server](#running)
- [Installing React Router](#reactrouter)
- [Installing Tailwind CSS](#tailwind)
- [Project Structure Overview](#structure)
- [Continue with the Backend Setup](#backend)

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

## 📦 Installing React Router {#reactrouter}

To enable **client-side routing** in your React app (e.g. navigating between pages like `/`, `/about`, `/languages` without full page reloads), install **React Router DOM**:

```bash
npm install react-router-dom
```

Since this project uses TypeScript, also install the type definitions:

```bash
npm install -D @types/react-router-dom
```

React Router allows you to define routes and nested layouts. For example, you can:

- Navigate between views using `<NavLink />`
- Create route-based pages with `createBrowserRouter`
- Handle 404 pages and dynamic segments (like `/languages/:id`)

You’ll use this library to wire up components like `Navbar`, `App`, and individual pages in your project.

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
│   ├── /components
│   ├── /pages
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

## Continue with the Backend Setup {#backend}

Set up the backend (Node.js, Express, Prisma, PostgreSQL) in the next part:

📄 [Go to BackendSetup.md](./BackendSetup.md)
