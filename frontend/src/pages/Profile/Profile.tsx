import { useState, useEffect } from "react";
import { useUser } from "../../utils/UserContext";

import ProfileNavbar from "./ProfileNavbar";
import ProfileSidebar from "./ProfileSidebar";
import PersonalDataSection from "./PersonalDataSection";
import AccountSection from "./AccountSection";
import FavoriteSection from "./FavoriteSection";
import NoteSection from "./NoteSection";

import type { Favorite, Note } from "../../type";
type SectionType = "personal" | "account" | "favorites" | "notes";

export default function Profile() {
  const { user } = useUser();

  const [section, setSection] = useState<SectionType>("personal");

  // User Data
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  // User Actions
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newsletterStatus, setNewsletterStatus] = useState(
    user?.newsletter ?? false
  );
  const [emailMessage, setEmailMessage] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  /* Fetch User Data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Favorites
        const favRes = await fetch("http://localhost:4000/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favData = await favRes.json();
        setFavorites(favData);

        // Fetch Notes
        const notesRes = await fetch(
          "http://localhost:4000/api/user/notes/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const notesData = await notesRes.json();
        setNotes(notesData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, []);

  /* Delete User Data */

  const deleteAllNotes = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete all notes?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:4000/api/user/notes/all", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes([]);
    } catch (err) {
      console.error("Error deleting all notes: ", err);
    }
  };

  const removeAllFavorites = async () => {
    const confirm = window.confirm("Are you sure you to remove all favorites?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:4000/api/user/favorites/all", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites([]);
    } catch (err) {
      console.error("Error removing all favorites: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Navbar */}
      <ProfileNavbar favorites={favorites} />

      {/* Sidebar */}
      <ProfileSidebar currentSection={section} onSelect={setSection} />

      <main className="flex-1 pt-24 p-6 space-y-6">
        {/* Personal Data */}
        {section === "personal" && (
          <PersonalDataSection
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            emailMessage={emailMessage}
            setEmailMessage={setEmailMessage}
            newsletterStatus={newsletterStatus}
            setNewsletterStatus={setNewsletterStatus}
            newsletterMessage={newsletterMessage}
            setNewsletterMessage={setNewsletterMessage}
          />
        )}

        {/* Account */}
        {section === "account" && <AccountSection />}

        {/* Favorite */}
        {section === "favorites" && (
          <FavoriteSection
            favorites={favorites}
            onRemoveAll={removeAllFavorites}
          />
        )}

        {/* Notes */}
        {section === "notes" && (
          <NoteSection notes={notes} onDeleteAll={deleteAllNotes} />
        )}
      </main>
    </div>
  );
}
