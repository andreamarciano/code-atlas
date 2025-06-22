import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../../utils/UserContext";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

export default function RegisterForm({ onSwitch, onClose }: Props) {
  const { setUser } = useUser();

  // User Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "username" | "password" | null
  >(null);

  // Date Bounds
  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const maxBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const minDate = minBirthDate.toISOString().split("T")[0];
  const maxDate = maxBirthDate.toISOString().split("T")[0];

  const validateForm = () => {
    // Username
    if (username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return false;
    }

    // Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters and contain uppercase, lowercase, and a number, and a special character (!@#$%^&*)"
      );
      return false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return false;
    }

    // BirthDate
    if (!birthDate) {
      alert("Please select a birth date.");
      return false;
    }
    const date = new Date(birthDate);
    if (date < minBirthDate || date > maxBirthDate) {
      alert("You must be between 18 and 100 years old.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
          birthDate,
          newsletter,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert(data.error || "Registration failed");
        return;
      }

      // Save User
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      // Clear Form
      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setNewsletter(false);

      // Close Menu
      onClose();
    } catch (err) {
      console.error("Register error", err);
      alert("Registration error");
    }
  };

  return (
    <>
      <h2 className="text-white text-lg font-semibold mb-1">
        Create your account
      </h2>
      {/* Switch Menu */}
      <p className="text-neutral-400 text-sm mb-4">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-400 hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </p>
      {/* First & Last Name */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-1/2 mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-1/2 mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      {/* Date of birth */}
      <input
        type="date"
        value={birthDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={() => setFocusedField("username")}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {focusedField === "username" && (
        <p className="text-xs text-neutral-400 mb-3">
          Username must be at least 3 characters long.
        </p>
      )}
      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField("password")}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {focusedField === "password" && (
          <p className="text-xs text-neutral-400 mb-4">
            Password must be at least 8 characters, contain uppercase,
            lowercase, a number, and a special character (!@#$%^&*).
          </p>
        )}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-5.5 -translate-y-1/2 text-gray-400 hover:text-white"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {/* Newsletter */}
      <p className="text-neutral-500 text-xs mb-4">
        By signing up you agree to our{" "}
        <span className="text-indigo-400">Terms of Service</span> and{" "}
        <span className="text-indigo-400">Privacy Policy</span>.
      </p>
      <div className="flex items-center space-x-2 text-neutral-300 text-sm mb-4">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={() => setNewsletter(!newsletter)}
          className="form-checkbox h-4 w-4 text-indigo-600"
        />
        <span>Subscribe to newsletter</span>
      </div>
      {/* Register */}
      <button
        onClick={handleRegister}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition cursor-pointer"
      >
        Create account
      </button>
    </>
  );
}
