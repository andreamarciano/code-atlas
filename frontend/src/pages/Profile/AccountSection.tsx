import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export default function AccountSection() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  if (!user) return null;

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

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">🔐 Account</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <div className="space-x-2 mt-4">
        <button className="px-4 py-2 bg-gray-700 rounded" onClick={logout}>
          Logout
        </button>
        <button className="px-4 py-2 bg-red-600 rounded" onClick={handleDelete}>
          Delete Account
        </button>
      </div>
    </section>
  );
}
