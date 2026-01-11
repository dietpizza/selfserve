import type { FileMetadata } from "../types";

import { getSpotlightSource } from "../utils";
import { FileItem } from "./file-item";
import { useEffect, useMemo, useRef, useState } from "react";
import { VList } from "virtua";

type GalleryProps = {
  images: FileMetadata[];
  onDeleteImage: (image: FileMetadata) => void;
};

export function Gallery({ images, onDeleteImage }: GalleryProps) {
  const [currentImage, setCurrentImage] = useState<FileMetadata | null>(null);
  const isInit = useRef(false);

  // Spotlight is 1-indexed
  function onImageChange(spotIndex: number) {
    setCurrentImage(images[spotIndex - 1]);
  }

  const spotlightSources = useMemo(() => images.map(getSpotlightSource), [images]);

  useEffect(() => {
    if (isInit.current) return;

    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.init();
    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.addControl("delete", function (event) {
      const isDeleteConfirmed = confirm("Delete this image?");
      if (isDeleteConfirmed) {
        // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
        onDeleteImage(images[Spotlight.currentIndex()]);
      }
    });

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
    <div className="h-screen w-screen max-h-screen md:max-w-3xl no-scrollbar">
      <VList className="h-screen max-h-screen w-screen no-scrollbar" itemSize={60}>
        {images.map((image, index) => {
          return (
            <FileItem
              key={image.filename}
              onPress={() => openSpotlight(index)}
              meta={image}
              highlight={image.filename === currentImage?.filename}
            />
          );
        })}
      </VList>
    </div>
  );
}
