import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import type { Language } from "../type";

function Navbar() {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/languages");
        const data = await res.json();
        setLanguages(data);
      } catch (err) {
        console.error("Error fetching languages in Navbar:", err);
      }
    };
    fetchLanguages();
  }, []);

  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 shadow">
      <ul className="flex space-x-8 font-semibold overflow-x-auto">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-300 transition-colors"
            }
          >
            Home
          </NavLink>
        </li>
        {languages.map((lang) => (
          <li key={lang.id}>
            <NavLink
              to={`/language/${lang.name.toLowerCase()}`}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400"
                  : "hover:text-yellow-300 transition-colors"
              }
            >
              {lang.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
