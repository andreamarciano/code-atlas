import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Trash2 } from "lucide-react";
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
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        Account
      </h2>

      <div className="space-y-4">
        <p className="text-lg">
          <strong>Username:</strong> {user.username}
        </p>

        <div className="flex gap-4 mt-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white cursor-pointer"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}
