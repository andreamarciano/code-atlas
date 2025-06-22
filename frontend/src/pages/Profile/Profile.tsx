import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

import type { Note } from "../../type";
type SectionType = "personal" | "account" | "favorites" | "notes";

export default function Profile() {
  const { user, setUser, logout } = useUser();
  const navigate = useNavigate();

  const sections: [SectionType, string][] = [
    ["personal", "📋 Personal Data"],
    ["account", "🔐 Account"],
    ["favorites", "⭐ My Favorite Languages"],
    ["notes", "📝 My Notes"],
  ];
  const [section, setSection] = useState<SectionType>("personal");

  const [favorites, setFavorites] = useState<{ id: number; name: string }[]>(
    []
  );
  const [notes, setNotes] = useState<Note[]>([]);

  const [newEmail, setNewEmail] = useState(user?.email);
  const [newsletterStatus, setNewsletterStatus] = useState(user?.newsletter);
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

  /* Delete User   */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Deleting error");

      logout(); // reset context
      navigate("/"); // redirect home
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    }
  };

  if (!user) return null; // safety

  /* Email and Newsletter Changes */

  const handleEmailChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setUser({ ...user, email: data.email });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, email: data.email })
      );
      setEmailMessage("Email updated successfully");
    } catch (err) {
      setEmailMessage(`${err}`);
    }
  };

  const handleNewsletterToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/profile/newsletter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsletter: !newsletterStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setNewsletterStatus(data.newsletter);
      setUser({ ...user, newsletter: data.newsletter });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, newsletter: data.newsletter })
      );
      setNewsletterMessage("Newsletter preference updated");
    } catch (err) {
      setNewsletterMessage(`${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full bg-gray-800 flex items-center justify-between px-6 py-3 shadow-xl">
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          ← Home
        </div>
        <div className="flex gap-3">
          {favorites.map((lang) => (
            <button
              key={lang.id}
              onClick={() => navigate(`/language/${lang.name.toLowerCase()}`)}
              className="text-sm text-blue-300 hover:underline"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 pt-20 p-4 bg-gray-800 flex flex-col gap-4 border-r border-gray-700">
        {sections.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`text-left px-3 py-2 rounded cursor-pointer ${
              section === key
                ? "bg-gray-700 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </aside>

      {/* Main Section */}
      <main className="flex-1 pt-24 p-6 space-y-6">
        {section === "personal" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📋 Personal Data</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Newsletter:</strong>{" "}
              {user.newsletter ? "Registered" : "Not registered"}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstName || "Not specified"}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName || "Not specified"}
            </p>
            <p>
              <strong>Date of birth: </strong>
              {new Date(user.birthDate).toLocaleDateString()}
            </p>

            <div className="mt-4 space-y-4 max-w-md">
              <div>
                <label className="block mb-1">Change Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
                <button
                  onClick={handleEmailChange}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded"
                >
                  Update Email
                </button>
                {emailMessage && <p className="text-sm mt-1">{emailMessage}</p>}
              </div>

              <div>
                <label className="block mb-1">Newsletter Subscription</label>
                <p className="mb-1">
                  You are currently{" "}
                  <strong>
                    {newsletterStatus ? "subscribed" : "not subscribed"}
                  </strong>
                </p>
                <button
                  onClick={handleNewsletterToggle}
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  {newsletterStatus ? "Unsubscribe" : "Subscribe"}
                </button>
                {newsletterMessage && (
                  <p className="text-sm mt-1">{newsletterMessage}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {section === "account" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">🔐 Account</h2>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <div className="space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded"
                onClick={logout}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </section>
        )}

        {section === "favorites" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              ⭐ My Favorite Languages
            </h2>
            <ul className="space-y-2">
              {favorites.length === 0 ? (
                <p>No favorite language.</p>
              ) : (
                favorites.map((lang) => (
                  <li key={lang.id}>
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() =>
                        navigate(`/language/${lang.name.toLowerCase()}`)
                      }
                    >
                      {lang.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}

        {section === "notes" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📝 My Notes</h2>
            <ul className="space-y-3">
              {notes.length === 0 ? (
                <p>No notes found.</p>
              ) : (
                notes.map((note) => (
                  <li key={note.id}>
                    <p className="text-sm italic text-gray-300">
                      “{note.content.slice(0, 15)}...” –{" "}
                      <button
                        onClick={() =>
                          navigate(`/language/${note.language.name}`)
                        }
                        className="text-blue-400 hover:underline"
                      >
                        {note.language.name}
                      </button>
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
