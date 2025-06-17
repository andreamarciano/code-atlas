# 🔗 Test Frontend ↔ Backend Connection (Express)

This guide helps you verify that your frontend (React + Vite) is properly communicating with your backend (Express).

## Table of Contents

- [1. Start the Backend](#backend)
- [2. Create a Frontend Fetch Example](#frontend)

---

## 1. Start the Backend {#backend}

Make sure your backend is running on a specific port (e.g. `http://localhost:4000`). A minimal `index.ts` should look like this:

```ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // allow requests from frontend

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
```

Start the backend:

```bash
cd backend
npm run dev
```

---

## 2. Create a Frontend Fetch Example {#frontend}

In your `App.tsx`, add the following:

```tsx
import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/health");
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error connecting to the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>Test Backend Connection</h1>
        <button onClick={fetchMessage}>
          Check Connection
        </button>
        <div>
          {loading ? "⏳ Loading..." : message}
        </div>
      </div>
    </>
  );
}

export default App;
```

Start the frontend:

```bash
cd frontend
npm run dev
```
