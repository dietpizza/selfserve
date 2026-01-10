import type { FileMetadata } from "../types";

import { getSpotlightSource } from "../utils";
import { FileItem } from "./file-item";
import { useEffect, useMemo, useRef, useState } from "react";

type GalleryProps = {
  images: FileMetadata[];
  onDeleteImage: (image: FileMetadata) => void;
};

export function Gallery({ images, onDeleteImage }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const isInit = useRef(false);

  function onImageChange(index: number) {
    setCurrentIndex(index);
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

  function openSpotlight(index: number) {
    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.show(spotlightSources, {
      preload: true,
      index,
      onchange: onImageChange,
      "zoom-in": false,
      "zoom-out": false,
      autohide: false,
      autofit: false,
    });
  }

  return (
    <div className="App">
      {images.map((image, index) => (
        <a
          key={image.filename}
          onClick={() => openSpotlight(index)}
          href={`/files/${encodeURIComponent(image.filename)}`}
          onClickCapture={() => setCurrentIndex(index)}
        >
          <FileItem meta={image} highlight={index == currentIndex} />
        </a>
      ))}
    </div>
  );
}
