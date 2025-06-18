import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent, MouseEvent } from "react";

function Topbar() {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      // encodeURIComponent: special characters, URL-safe
      const res = await fetch(
        `http://localhost:4000/api/languages/${encodeURIComponent(query)}`
      );

      if (res.ok) {
        const language = await res.json();
        navigate(`/language/${language.name.toLowerCase()}`);
      } else {
        navigate("/not-found");
      }
    } catch (err) {
      console.error("Search failed:", err);
      navigate("/not-found");
    }
  };

  return (
    <div className="bg-neutral-900 px-6 py-3 shadow flex items-center justify-between">
      <div className="text-lg font-bold text-white">Code Atlas</div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-grow max-w-md mx-6 flex items-center space-x-2 relative"
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg hover:bg-neutral-700 transition cursor-pointer"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </button>
      </form>

      <div className="text-sm text-gray-300">🔒 Sign in</div>
    </div>
  );
}

export default Topbar;
