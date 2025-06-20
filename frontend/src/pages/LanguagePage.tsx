import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, StarOff } from "lucide-react";

import type { Language, User } from "../type";

type ContextType = {
  favoriteLanguages: number[];
  setFavoriteLanguages: React.Dispatch<React.SetStateAction<number[]>>;
  user: User | null;
};

function LanguagePage() {
  const { name } = useParams<{ name: string }>();
  const { favoriteLanguages, setFavoriteLanguages, user } =
    useOutletContext<ContextType>();

  const [language, setLanguage] = useState<Language | null>(null);

  // Fetch Language
  useEffect(() => {
    if (!name) return;

    const fetchLanguage = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/languages/${name}`);

        const data = await res.json();
        setLanguage(data);
      } catch (err) {
        console.error("Failed to load language:", err);
      }
    };

    fetchLanguage();
  }, [name]);

  if (!language) return;

  const isFavorite = favoriteLanguages.includes(language.id);

  // ADD/REMOVE Favorite
  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to manage favorites.");
      return;
    }

    try {
      if (isFavorite) {
        // REMOVE Favorite
        await fetch("http://localhost:4000/api/user/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, languageId: language.id }),
        });
        setFavoriteLanguages((prev) => prev.filter((id) => id !== language.id));
      } else {
        // ADD Favorite
        await fetch("http://localhost:4000/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, languageId: language.id }),
        });
        setFavoriteLanguages((prev) => [...prev, language.id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center justify-center gap-1 mb-4">
        <h2 className="text-2xl font-bold">{language.name}</h2>

        {/* Favorite Icon */}
        {user && (
          <button
            onClick={toggleFavorite}
            className={`rounded-full p-2 transition-colors cursor-pointer ${
              isFavorite
                ? "text-purple-600 hover:text-neutral-500"
                : "text-neutral-500 hover:text-purple-600"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <StarOff /> : <Star />}
          </button>
        )}
      </div>

      {/* Notes */}
    </div>
  );
}

export default LanguagePage;
