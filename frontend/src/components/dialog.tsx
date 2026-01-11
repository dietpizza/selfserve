import { type ReactNode, type TransitionEvent, useEffect, useId, useState } from "react";

type DialogProps = {
  title: string;
  description?: ReactNode;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  closeOnBackdrop?: boolean;
};

export function Dialog({
  title,
  description,
  isVisible,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  closeOnBackdrop = true,
}: DialogProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isActive, setIsActive] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    let rafId: number | null = null;

    if (isVisible) {
      setShouldRender(true);
      rafId = window.requestAnimationFrame(() => setIsActive(true));
    } else {
      setIsActive(false);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (isActive || isVisible || !shouldRender) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShouldRender(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [isActive, isVisible, shouldRender]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onCancel]);

  if (!shouldRender) {
    return null;
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (!isActive && event.target === event.currentTarget) {
      setShouldRender(false);
    }
  }

  const overlayState = isActive ? "opacity-100" : "opacity-0";
  const panelState = isActive ? "opacity-100 scale-100" : "opacity-0 scale-95";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${overlayState}`}
      onClick={() => {
        if (closeOnBackdrop) {
          onCancel();
        }
      }}
      onTransitionEnd={handleTransitionEnd}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`w-full max-w-md transform rounded-2xl bg-slate-800 px-6 py-6 shadow-lg text-slate-900 transition duration-200 ease-out ${panelState}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col">
          <p id={titleId} className="text-xl font-semibold tracking-tight text-slate-300">
            {title}
          </p>
          {description ? (
            <p id={descriptionId} className="text-sm text-slate-300 leading-1">
              {description}
            </p>
          ) : null}
        </header>
        <footer className="mt-6 flex justify-end gap-2 text-sm font-medium">
          <div
            className="rounded-full px-5 py-2 text-slate-200 shadow-sm transition bg-slate-700 hover:bg-slate-600 cursor-pointer"
            onClick={onCancel}
          >
            {cancelLabel.toUpperCase()}
          </div>
          <div
            className="rounded-full px-5 py-2 text-slate-200 shadow-sm transition bg-red-800 hover:bg-red-700 cursor-pointer"
            onClick={onConfirm}
          >
            {confirmLabel.toUpperCase()}
          </div>
        </footer>
      </section>
    </div>
  );
}
