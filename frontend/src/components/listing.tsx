import type { FileMetadata } from "../types";

import { getSpotlightSource, shuffleList } from "../utils";
import { FileItem } from "./file-item";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VList, type VListHandle } from "virtua";

function isImageFile(file: FileMetadata) {
  return file.mimetype.startsWith("image/");
}

function isDirectory(file: FileMetadata) {
  return file.mimetype === "directory";
}

type FileListProps = {
  files: FileMetadata[];
  onDeleteFile: (image: FileMetadata) => void;
};

export function FileList({ files, onDeleteFile }: FileListProps) {
  const [currentImage, setCurrentImage] = useState<FileMetadata | null>(null);
  const isInit = useRef(false);
  const ref = useRef<VListHandle>(null);

  // Spotlight is 1-indexed
  function onImageChange(spotIndex: number) {
    setCurrentImage(files[spotIndex - 1]);
    ref.current?.scrollToIndex(spotIndex - 1, { align: "center", smooth: false });
  }

  const spotlightSources = useMemo(() => files.filter(isImageFile).map(getSpotlightSource), [files]);

  useEffect(() => {
    if (isInit.current) return;

    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.init();

    isInit.current = true;
  }, []);

  function openSpotlight(listIndex: number) {
    const indexInSpotlightSources = spotlightSources.findIndex(
      (source) => source.file.filename === files[listIndex].filename
    );
    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.show(spotlightSources, {
      index: indexInSpotlightSources + 1,
      onchange: onImageChange,
      autohide: false,
      autofit: false,
    });
  }

  function slideShow() {
    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.show(shuffleList(spotlightSources), {
      index: 1,
      onchange: onImageChange,
      autohide: false,
      autofit: false,
    });
  }

  function handleFileClick(index: number) {
    const _file = files[index];
    if (isImageFile(_file)) {
      openSpotlight(index);
    }

    if (isDirectory(_file)) {
      const newPath = "/home" + _file.relative_path;
      history.pushState({}, "", newPath);
    }
  }

  return (
    <div className="flex flex-1 bg-surface-container md:max-w-3xl no-scrollbar">
      <VList ref={ref} className="h-full no-scrollbar" itemSize={60}>
        {files.map((image, index) => {
          return (
            <FileItem
              key={image.filename}
              meta={image}
              highlight={image.filename === currentImage?.filename}
              onPress={() => handleFileClick(index)}
              onDelete={() => onDeleteFile(image)}
            />
          );
        })}
      </VList>
    </div>
  );
}
