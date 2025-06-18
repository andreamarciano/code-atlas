import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 shadow">
      <ul className="flex space-x-6 font-semibold">
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
      </ul>
    </nav>
  );
}

export default Navbar;
