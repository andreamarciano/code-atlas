import { useState } from "react";
import { CircleUser, ChevronDown, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../utils/UserContext";

export default function SignedInMenu() {
  /* Auth User */
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 text-white hover:bg-neutral-800 rounded-2xl cursor-pointer"
      >
        <CircleUser />
        <span className="text-sm text-yellow-400">{user?.username}</span>
        <ChevronDown size={16} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden border border-neutral-600">
          <button
            onClick={goToProfile}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors cursor-pointer"
          >
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
  );
}
