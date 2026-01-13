import { useState, useEffect } from "react";

type Props = {
  show: boolean;
  duration?: number;
  children: React.ReactNode;
};

export function AnimatePresence({ show, duration = 400, children }: Props) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);
  if (!shouldRender) return null;

  return (
    <div
      className={`
        transition-all duration-${duration} ease-out
        ${
          show
            ? `animate-in fade-in slide-in-from-bottom-8 opacity-100`
            : "animate-out fade-out slide-out-to-bottom-8 opacity-0 pointer-events-none"
        }
      `}
    >
      {children}
    </div>
  );
}
