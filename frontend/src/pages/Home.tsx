import { useState } from "react";

type Language = {
  id: number;
  name: string;
};

function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
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

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Languages DB Test</h1>

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

export default Home;
