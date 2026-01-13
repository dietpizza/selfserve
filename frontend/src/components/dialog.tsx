import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "./button";
import { cn } from "../utils";

type DialogProps = {
  title: string;
  description?: React.ReactNode;
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="box"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn("fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm")}
          onClick={() => closeOnBackdrop && onCancel()}
          role="presentation"
        >
          {isVisible && (
            <motion.div
              exit={{ scale: 0.9, opacity: 0 }}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md transform rounded-2xl bg-surface-container px-6 py-6 shadow-md text-on-surface"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex flex-col pb-2">
                <p className="text-2xl font-semibold tracking-tight text-on-surface pb-4">{title}</p>
                {description ? <p className="text-sm text-on-surface-variant leading-1">{description}</p> : null}
              </header>
              <footer className="mt-6 flex justify-end gap-2 text-sm font-medium">
                <Button variant="secondary" label={cancelLabel} onClick={onCancel} />
                <Button variant="error" label={confirmLabel} onClick={onConfirm} />
              </footer>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
