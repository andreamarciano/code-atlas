import { useEffect, useState } from "react";
import { useUser } from "../../utils/UserContext";

export default function MiniNavbar() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorites(data); // o data.languages a seconda della struttura
    };

    if (user) fetchFavs();
  }, [user]);

  return (
    <nav className="bg-gray-800 p-2 text-sm text-white flex gap-4 overflow-x-auto">
      <a href="/" className="underline text-blue-300">
        🏠 Home
      </a>
      {favorites.map((lang) => (
        <a
          key={lang}
          href={`/language/${lang}`}
          className="hover:underline text-blue-400"
        >
          {lang}
        </a>
      ))}
    </nav>
  );
}
