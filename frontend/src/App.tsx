import "./App.css";
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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Languages DB Test</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 w-full"
          placeholder="Enter a language"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addLanguage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>

      <button
        onClick={fetchLanguages}
        className="mb-4 bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        Load Languages
      </button>

      {loading && <p className="text-gray-500">⏳ Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="list-disc pl-5 space-y-1">
        {languages.map((lang) => (
          <li key={lang.id}>{lang.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
