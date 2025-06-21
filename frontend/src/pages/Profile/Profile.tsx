import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

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
    <div className="max-w-lg mx-auto text-white mt-10 space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>

      <div>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>First Name:</strong> {user.firstName || "Not specified"}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName || "Not specified"}
        </p>
        <p>
          <strong>Date of birth:</strong>{" "}
          {user.birthDate
            ? new Date(user.birthDate).toLocaleDateString()
            : "Not specified"}
        </p>
        <p>
          <strong>Newsletter:</strong>{" "}
          {user.newsletter ? "Registered" : "Not registered"}
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Delete Account
      </button>
    </div>
  );
}
