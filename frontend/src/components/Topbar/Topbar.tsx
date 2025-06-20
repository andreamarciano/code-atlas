import { useState, type FormEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUser, ChevronDown, LogOut, Settings } from "lucide-react";

import { useUser } from "../../utils/UserContext";

import Searchbar from "./Searchbar";
import SignIn from "./SignIn";

function Topbar() {
  /* Fetch Language */
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

  /* Auth User */
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="bg-neutral-900 px-6 py-3 shadow flex items-center justify-between">
      <div className="text-lg font-bold text-white">Code Atlas</div>

      <Searchbar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {user ? (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 text-white hover:bg-neutral-800 rounded-2xl cursor-pointer"
          >
            <CircleUser />
            <span className="text-sm text-yellow-400">{user.username}</span>
            <ChevronDown size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden border border-neutral-600">
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors cursor-pointer">
                <CircleUser size={18} />
                Profile
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors cursor-pointer">
                <Settings size={18} />
                Settings
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LogOut size={18} className="-rotate-180" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default Topbar;
