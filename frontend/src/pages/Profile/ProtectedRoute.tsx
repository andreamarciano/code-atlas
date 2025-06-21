import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (!user) {
    // Not Logged In → Home
    return <Navigate to="/" replace />;
  }

  // Logged In → Profile
  return <Outlet />;
}
