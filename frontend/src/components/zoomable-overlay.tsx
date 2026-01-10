// A simple zoomable image wrapper that supports pinch/scroll zoom and panning.
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  onClose: () => void;
  children?: React.ReactNode;
};

export const ZoomableOverlay: React.FC<Props> = ({ onClose, children }) => {
  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClose();
  };

  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />

      <div className="absolute top-4 right-4 z-50">
        <button
          aria-label="Close"
          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        doubleClick={{ mode: "reset" }}
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
        limitToBounds={true}
        disablePadding={true}
      >
        <TransformComponent wrapperClass="full-height">{children}</TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ZoomableOverlay;
