import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins if you need
import _zoom from "lightgallery/plugins/zoom";
import _autoplay from "lightgallery/plugins/autoplay";
import _pager from "lightgallery/plugins/pager";

import type { FileMetadata } from "../types";
import { FileItem } from "./file-item";
import { useState } from "react";

type GalleryProps = {
  images: FileMetadata[];
};

export function Gallery({ images }: GalleryProps) {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  return (
    <div className="App">
      <LightGallery onInit={onInit} speed={500} plugins={[_zoom]}>
        {images.map((image, index) => (
          <a key={image.filename} href={`/files/${encodeURIComponent(image.filename)}`}>
            <FileItem meta={image} highlight={false} />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}
