import { NavLink } from "react-router-dom";

import ScrollableMenu from "./ScrollableMenu";

import type { Language } from "../../type";

type NavbarProps = {
  languages: Language[];
  favoriteLanguages: number[];
};

function Navbar({ languages, favoriteLanguages }: NavbarProps) {
  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 shadow">
      <ScrollableMenu>
        <li className="inline-block" role="none">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-300 transition-colors"
            }
            role="menuitem"
          >
            Home
          </NavLink>
        </li>
        {languages.map((lang) => (
          <li key={lang.id} className="inline-block" role="none">
            <NavLink
              to={`/language/${lang.name.toLowerCase()}`}
              className={({ isActive }) => {
                const isFavorite = favoriteLanguages.includes(lang.id);
                if (isActive) {
                  return "text-yellow-400";
                }

                if (isFavorite) {
                  return "text-purple-700 hover:text-purple-600 transition-colors";
                }

                return "hover:text-yellow-300 transition-colors";
              }}
              role="menuitem"
            >
              {lang.name}
            </NavLink>
          </li>
        ))}
      </ScrollableMenu>
    </nav>
  );
}

export default Navbar;
