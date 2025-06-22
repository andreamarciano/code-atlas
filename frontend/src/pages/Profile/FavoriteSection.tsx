import { useNavigate } from "react-router-dom";

interface FavoriteSectionProps {
  favorites: { id: number; name: string }[];
}

export default function FavoriteSection({ favorites }: FavoriteSectionProps) {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">⭐ My Favorite Languages</h2>
      <ul className="space-y-2">
        {favorites.length === 0 ? (
          <p>No favorite language.</p>
        ) : (
          favorites.map((lang) => (
            <li key={lang.id}>
              <button
                className="text-blue-400 hover:underline"
                onClick={() => navigate(`/language/${lang.name.toLowerCase()}`)}
              >
                {lang.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
