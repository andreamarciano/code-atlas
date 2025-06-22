import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../../utils/UserContext";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

export default function LoginForm({ onSwitch, onClose }: Props) {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert(data.error || "Login failed");
        return;
      }

      // Save User
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      onClose();
    } catch (err) {
      console.error("Login error", err);
      alert("Login error");
    }
  };

  return (
    <>
      <h2 className="text-white text-lg font-semibold mb-1">Sign in</h2>
      <p className="text-neutral-400 text-sm mb-4">
        Get access to more learning features
      </p>
      {/* Switch Menu */}
      <p className="text-neutral-400 text-sm mb-4">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-400 hover:underline cursor-pointer"
        >
          Register
        </button>
      </p>
      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-5.5 -translate-y-1/2 text-gray-400 hover:text-white"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {/* Login */}
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition cursor-pointer"
      >
        Sign In
      </button>
    </>
  );
}
