import { useNavigate } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";

interface FavoriteSectionProps {
  favorites: { id: number; name: string }[];
}

export default function FavoriteSection({ favorites }: FavoriteSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          My Favorite Languages
        </h2>
        {favorites.length > 0 && (
          <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm">
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-gray-400 italic">No favorite languages found.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((lang) => (
            <li key={lang.id}>
              <button
                className="text-blue-400 hover:underline hover:text-blue-300 cursor-pointer"
                onClick={() => navigate(`/language/${lang.name.toLowerCase()}`)}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
