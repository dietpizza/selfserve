import { useEffect, useRef } from "react";

export function useLocationChange(callback: (current: string, previous: string) => void) {
  const callbackRef = useRef(callback);
  const pathnameRef = useRef(window.location.pathname);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const checkPathname = () => {
      const current = window.location.pathname;

      if (pathnameRef.current !== current) {
        const previous = pathnameRef.current;
        pathnameRef.current = current;
        callbackRef.current(current, previous);
      }
    };

    // Check on popstate (back/forward)
    window.addEventListener("popstate", checkPathname);

    // Override pushState
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      checkPathname();
    };

    // Override replaceState
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      checkPathname();
    };

    return () => {
      window.removeEventListener("popstate", checkPathname);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
}
