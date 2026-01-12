import type { FileMetadata } from "../types";

import { getSpotlightSource } from "../utils";
import { FileItem } from "./file-item";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VList, type VListHandle } from "virtua";

type GalleryProps = {
  images: FileMetadata[];
  onDeleteImage: (image: FileMetadata) => void;
};

export function Gallery({ images, onDeleteImage }: GalleryProps) {
  const [currentImage, setCurrentImage] = useState<FileMetadata | null>(null);
  const isInit = useRef(false);
  const ref = useRef<VListHandle>(null);

  // Spotlight is 1-indexed
  function onImageChange(spotIndex: number) {
    setCurrentImage(images[spotIndex - 1]);
    ref.current?.scrollToIndex(spotIndex - 1, { align: "start", offset: -(60 * 4), smooth: false });
  }

  const spotlightSources = useMemo(() => images.map(getSpotlightSource), [images]);

  useEffect(() => {
    if (isInit.current) return;

    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.init();

    isInit.current = true;
  }, []);

  function openSpotlight(listIndex: number) {
    console.info("Opening spotlight at index", listIndex);
    setCurrentImage(images[listIndex]);
    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.show(spotlightSources, {
      index: listIndex + 1,
      onchange: onImageChange,
      autohide: false,
      autofit: false,
    });
  }

  return (
    <div className="bg-surface-container h-screen max-h-screen md:max-w-3xl no-scrollbar">
      <VList ref={ref} className="h-screen max-h-screen no-scrollbar" itemSize={60}>
        {images.map((image, index) => {
          return (
            <FileItem
              key={image.filename}
              meta={image}
              highlight={image.filename === currentImage?.filename}
              onPress={() => openSpotlight(index)}
              onDelete={() => onDeleteImage(image)}
            />
          );
        })}
      </VList>
    </div>
  );
}
