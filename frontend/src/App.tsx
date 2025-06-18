import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import type { Language } from "./type";

function App() {
  // Languages
  const [languages, setLanguages] = useState<Language[]>([]);

  /* Fetch Languages */
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
    <>
      <Topbar />
      <Navbar languages={languages} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
