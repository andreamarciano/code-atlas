import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const [showMenu, setShowMenu] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

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
            <>
              <h2 className="text-white text-lg font-semibold mb-1">Sign in</h2>
              <p className="text-neutral-400 text-sm mb-4">
                Get access to more learning features
              </p>
              <p className="text-neutral-400 text-sm mb-4">
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthMode("register")}
                  className="text-indigo-400 hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>
              <input
                type="text"
                placeholder="Username"
                className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition cursor-pointer">
                Sign In
              </button>
            </>
          ) : (
            <>
              <h2 className="text-white text-lg font-semibold mb-1">
                Create your account
              </h2>
              <p className="text-neutral-400 text-sm mb-4">
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-indigo-400 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
              <input
                type="text"
                placeholder="Username"
                className="w-full mb-3 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              <p className="text-neutral-500 text-xs mb-4">
                By signing up you agree to our{" "}
                <span className="text-indigo-400">Terms of Service</span> and{" "}
                <span className="text-indigo-400">Privacy Policy</span>.
              </p>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition cursor-pointer">
                Create account
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
