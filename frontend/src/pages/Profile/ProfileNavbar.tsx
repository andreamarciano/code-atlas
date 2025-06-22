import { useNavigate } from "react-router-dom";

interface ProfileNavbarProps {
  favorites: { id: number; name: string }[];
}

export default function ProfileNavbar({ favorites }: ProfileNavbarProps) {
  const navigate = useNavigate();
  return (
    <div className="absolute top-0 left-0 w-full bg-gray-800 flex items-center justify-between px-6 py-3 shadow-xl">
      <div
        className="font-bold text-large p-2 cursor-pointer hover:bg-gray-900 rounded-3xl"
        onClick={() => navigate("/")}
      >
        ← Home
      </div>
      <div className="flex gap-3">
        {favorites.map((lang) => (
          <button
            key={lang.id}
            onClick={() => navigate(`/language/${lang.name.toLowerCase()}`)}
            className="text-sm text-blue-300 hover:underline cursor-pointer"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
