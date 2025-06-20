import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";
import Topbar from "./components/Topbar/Topbar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

import { useUser } from "./utils/UserContext";

import type { Language } from "./type";

function App() {
  /* Fetch Languages */
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

  /* Fetch User Favorite Languages */
  const { user } = useUser();
  const [favoriteLanguages, setFavoriteLanguages] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteLanguages([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:4000/api/user/favorites/${user.id}`
        );

        const data = await res.json();
        setFavoriteLanguages(data.map((lang: Language) => lang.id));
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <>
      <Topbar />
      <Navbar languages={languages} favoriteLanguages={favoriteLanguages} />
      <main>
        <Outlet context={{ favoriteLanguages, setFavoriteLanguages, user }} />
      </main>
      <Footer />
    </>
  );
}

export default App;
