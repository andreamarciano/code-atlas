import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

import type { Language, User } from "../../type";

import FavoriteButton from "./FavoriteButton";
import NoteEditor from "./NoteEditor";
import UserComments from "./UserComments";

type ContextType = {
  favoriteLanguages: number[];
  setFavoriteLanguages: React.Dispatch<React.SetStateAction<number[]>>;
  user: User | null;
};

function LanguagePage() {
  const { name } = useParams<{ name: string }>();
  const { favoriteLanguages, setFavoriteLanguages, user } =
    useOutletContext<ContextType>();

  const [language, setLanguage] = useState<Language | null>(null);

  // Fetch Language
  useEffect(() => {
    if (!name) return;

    const fetchLanguage = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/languages/${name}`);

        const data = await res.json();
        setLanguage(data);
      } catch (err) {
        console.error("Failed to load language:", err);
      }
    };

    fetchLanguage();
  }, [name]);

  if (!language) return;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center justify-center gap-1 mb-4">
        <h2 className="text-2xl font-bold">{language.name}</h2>

        {/* Favorite Icon */}
        {user && (
          <FavoriteButton
            language={language}
            user={user}
            favoriteLanguages={favoriteLanguages}
            setFavoriteLanguages={setFavoriteLanguages}
          />
        )}
      </div>

      {/* Notes */}
      {user && language && <NoteEditor user={user} languageId={language.id} />}

      <UserComments languageId={language.id} />
    </div>
  );
}

export default LanguagePage;
