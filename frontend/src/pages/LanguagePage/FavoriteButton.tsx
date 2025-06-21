import { Star, StarOff } from "lucide-react";

import type { Language, User } from "../../type";

type FavoriteButtonProps = {
  language: Language;
  user: User;
  favoriteLanguages: number[];
  setFavoriteLanguages: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function FavoriteButton({
  language,
  user,
  favoriteLanguages,
  setFavoriteLanguages,
}: FavoriteButtonProps) {
  const isFavorite = favoriteLanguages.includes(language.id);

  // ADD/REMOVE Favorite
  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to manage favorites.");
      return;
    }

    try {
      if (isFavorite) {
        // REMOVE
        await fetch("http://localhost:4000/api/user/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ languageId: language.id }),
        });
        setFavoriteLanguages((prev) => prev.filter((id) => id !== language.id));
      } else {
        // ADD
        await fetch("http://localhost:4000/api/user/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ languageId: language.id }),
        });
        setFavoriteLanguages((prev) => [...prev, language.id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites.");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`rounded-full p-2 transition-colors cursor-pointer ${
        isFavorite
          ? "text-purple-600 hover:text-neutral-500"
          : "text-neutral-500 hover:text-purple-600"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <StarOff /> : <Star />}
    </button>
  );
}
