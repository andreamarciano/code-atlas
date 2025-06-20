import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScrollableMenuProps = {
  children: ReactNode;
};

export default function ScrollableMenu({ children }: ScrollableMenuProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if scroll arrows should be shown
  const updateScrollButtons = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    const maxScrollLeft = scrollWidth - clientWidth;
    const tolerance = 2;

    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < maxScrollLeft - tolerance);
  };

  // Listen to scroll and resize events
  useEffect(() => {
    updateScrollButtons();

    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      element.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [children]);

  // Animate horizontal scroll in given direction
  const scrollByStep = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return null;

    const step = 15 * (direction === "left" ? -1 : 1);
    let animFrameId: number;

    const scrollStep = () => {
      if (!element) return;

      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      let newScrollLeft = element.scrollLeft + step;

      if (newScrollLeft < 0) newScrollLeft = 0;
      if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

      element.scrollLeft = newScrollLeft;
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
    <div className="relative flex items-center">
      {/* Arrow Left */}
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute left-2 z-10 bg-neutral-900 bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition"
        >
          <ChevronLeft size={24} className="text-yellow-400" />
        </button>
      )}

      {/* Languages List */}
      <ul
        ref={scrollRef}
        className="flex space-x-8 font-semibold overflow-x-hidden whitespace-nowrap scrollbar-hide"
        role="menubar"
      >
        {children}
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
          <ChevronRight size={24} className="text-yellow-400" />
        </button>
      )}
    </div>
  );
}
