import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  scrollContainer?: HTMLElement | null;
}

export function ScrollToTop({ scrollContainer }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = scrollContainer || window;
    const getScrollTop = () => {
      if (scrollContainer) return scrollContainer.scrollTop;
      return window.scrollY || document.documentElement.scrollTop;
    };

    const onScroll = () => {
      setVisible(getScrollTop() > 300);
    };

    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollContainer]);

  const handleClick = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform"
      aria-label="Scroll to top"
      data-testid="scroll-to-top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
