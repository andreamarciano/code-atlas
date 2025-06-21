import { useState, type FormEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../utils/UserContext";

import Searchbar from "./Searchbar";
import SignIn from "./SignIn/SignIn";
import SignedInMenu from "./SignIn/SignedInMenu";

function Topbar() {
  /* Search State */
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

  const { user } = useUser();

  return (
    <div className="bg-neutral-900 px-6 py-3 shadow flex items-center justify-between">
      <div className="text-lg font-bold text-white">Code Atlas</div>

      <Searchbar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {user ? <SignedInMenu /> : <SignIn />}
    </div>
  );
}

export default Topbar;
