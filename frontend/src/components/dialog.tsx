import { type CSSProperties, type ReactNode, type TransitionEvent, useEffect, useId, useState } from "react";
import { Button } from "./button";
import { AnimatePresence } from "./animate-presence";

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

  // handle esc key to close dialog
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isVisible) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onCancel]);

  // handle back for android chrome
  useEffect(() => {
    function handlePopState() {
      if (isVisible) {
        onCancel();
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isVisible, onCancel]);

  return (
    <AnimatePresence show={isVisible} duration={220}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm"
        // style={overlayStyles}
        onClick={() => {
          if (closeOnBackdrop) {
            onCancel();
          }
        }}
        // onTransitionEnd={handleTransitionEnd}
        role="presentation"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className="w-full max-w-md transform rounded-2xl bg-surface-container px-6 py-6 shadow-md text-on-surface"
          // style={panelStyles}
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
    </AnimatePresence>
  );
}
