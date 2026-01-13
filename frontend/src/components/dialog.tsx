import { type CSSProperties, type ReactNode, type TransitionEvent, useEffect, useId, useState } from "react";
import { Button } from "./button";

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
    if (isVisible) {
      setShouldRender(true);
    } else {
      setIsActive(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !shouldRender || isActive) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => setIsActive(true));
    return () => window.cancelAnimationFrame(rafId);
  }, [isActive, isVisible, shouldRender]);

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

  const overlayStyles: CSSProperties = {
    opacity: isActive ? 1 : 0,
    transition: "opacity 220ms ease-out",
  };

  const panelStyles: CSSProperties = {
    opacity: isActive ? 1 : 0,
    transform: isActive ? "scale(1)" : "scale(0.95)",
    transition: "opacity 220ms ease-out, transform 220ms ease-out",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm"
      style={overlayStyles}
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
        className="w-full max-w-md transform rounded-2xl bg-surface-container px-6 py-6 shadow-md text-on-surface"
        style={panelStyles}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col pb-2">
          <p id={titleId} className="text-2xl font-semibold tracking-tight text-on-surface pb-4">
            {title}
          </p>
          {description ? (
            <p id={descriptionId} className="text-sm text-on-surface-variant leading-1">
              {description}
            </p>
          ) : null}
        </header>
        <footer className="mt-6 flex justify-end gap-2 text-sm font-medium">
          <Button variant="secondary" label={cancelLabel} onClick={onCancel} />
          <Button variant="error" label={confirmLabel} onClick={onConfirm} />
        </footer>
      </section>
    </div>
  );
}
