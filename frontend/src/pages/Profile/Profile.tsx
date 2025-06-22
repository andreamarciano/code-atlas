import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

type Note = {
  id: number;
  content: string;
  language: {
    id: number;
    name: string;
  };
};

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [section, setSection] = useState<
    "personal" | "account" | "favorites" | "notes"
  >("personal");
  const [favorites, setFavorites] = useState<{ id: number; name: string }[]>(
    []
  );
  const [notes, setNotes] = useState<Note[]>([]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full bg-gray-800 flex items-center justify-between px-6 py-3 shadow-md">
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
      <aside className="w-60 pt-20 p-4 bg-gray-800 flex flex-col gap-4">
        <button onClick={() => setSection("personal")}>📋 Personal Data</button>
        <button onClick={() => setSection("account")}>🔐 Account</button>
        <button onClick={() => setSection("favorites")}>
          ⭐ My Favorite Languages
        </button>
        <button onClick={() => setSection("notes")}>📝 My Notes</button>
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

            <div className="mt-4 space-x-2">
              <button className="px-4 py-2 bg-blue-600 rounded">
                Change Email
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded">
                Manage Newsletter
              </button>
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
