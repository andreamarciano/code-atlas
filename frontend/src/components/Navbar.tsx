import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import type { Language } from "../type";

function Navbar() {
  // Languages
  const [languages, setLanguages] = useState<Language[]>([]);
  // Scroll
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* Fetch Languages */
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/languages");
        const data = await res.json();
        setLanguages(data);
      } catch (err) {
        console.error("Error fetching languages in Navbar:", err);
      }
    };
    fetchLanguages();
  }, []);

  /* Scroll */

  // Check if scroll arrows should be shown
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    const tolerance = 2;

    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < maxScrollLeft - tolerance);
  };

  // Listen to scroll and resize events
  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [languages]);

  // Animate horizontal scroll in given direction
  const scrollByStep = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return null;

    const step = 15 * (direction === "left" ? -1 : 1);

    let animFrameId: number;

    const scrollStep = () => {
      if (!el) return;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      let newScrollLeft = el.scrollLeft + step;

      if (newScrollLeft < 0) newScrollLeft = 0;
      if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

      el.scrollLeft = newScrollLeft;
      updateScrollButtons();

      if (
        (direction === "left" && newScrollLeft > 0) ||
        (direction === "right" && newScrollLeft < maxScrollLeft)
      ) {
        animFrameId = requestAnimationFrame(scrollStep);
      }
    };

    scrollStep();

    return () => cancelAnimationFrame(animFrameId);
  };

  // Store reference to stop function
  const scrollStopRef = useRef<(() => void) | null>(null);

  // Start/stop scroll on pointer events
  const handlePointerDown = (direction: "left" | "right") => {
    scrollStopRef.current = scrollByStep(direction);
  };
  const handlePointerUp = () => {
    if (scrollStopRef.current) {
      scrollStopRef.current();
      scrollStopRef.current = null;
    }
  };

  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 shadow relative flex items-center">
      {/* Arrow Left */}
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute left-2 z-10 bg-neutral-900 bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition"
        >
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Languages List */}
      <ul
        ref={scrollRef}
        className="flex space-x-8 font-semibold overflow-x-hidden whitespace-nowrap scrollbar-hide"
        role="menubar"
      >
        <li className="inline-block" role="none">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-300 transition-colors"
            }
            role="menuitem"
          >
            Home
          </NavLink>
        </li>
        {languages.map((lang) => (
          <li key={lang.id} className="inline-block" role="none">
            <NavLink
              to={`/language/${lang.name.toLowerCase()}`}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400"
                  : "hover:text-yellow-300 transition-colors"
              }
              role="menuitem"
            >
              {lang.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Arrow Right */}
      {canScrollRight && (
        <button
          aria-label="Scroll right"
          onPointerDown={() => handlePointerDown("right")}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute right-2 z-10 bg-neutral-900 bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition"
        >
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </nav>
  );
}

export default Navbar;
