import "./App.css";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/health");
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error connecting to the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Test Backend Connection</h1>
        <button
          onClick={fetchMessage}
          className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-neutral-900 text-white hover:border-indigo-800 focus:outline-blue-500 transition-colors duration-200 cursor-pointer"
        >
          Check Connection
        </button>
        <div className="mt-4 text-lg">
          {loading ? "⏳ Loading..." : message}
        </div>
      </div>
    </>
  );
}

export default App;
