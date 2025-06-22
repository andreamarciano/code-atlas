import { useState } from "react";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function SignIn() {
  const [showMenu, setShowMenu] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-neutral-800 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-neutral-700 transition cursor-pointer"
      >
        🔒 Sign in
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-6 z-50">
          {authMode === "login" ? (
            <LoginForm
              onSwitch={() => setAuthMode("register")}
              onClose={() => setShowMenu(false)}
            />
          ) : (
            <RegisterForm
              onSwitch={() => setAuthMode("login")}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
