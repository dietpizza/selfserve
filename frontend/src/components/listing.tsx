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
  const [lastOpenedFile, setLastOpenedFile] = useState<FileMetadata | null>(null);
  const isInit = useRef(false);
  const ref = useRef<VListHandle>(null);

  // Spotlight is 1-indexed
  function onImageChange(spotIndex: number) {
    setLastOpenedFile(spotlightSources[spotIndex - 1].file);
    ref.current?.scrollToIndex(spotIndex - 1, { align: "center", smooth: false });
  }

  const spotlightSources = useMemo(() => files.filter(isImageFile).map(getSpotlightSource), [files]);

  useEffect(() => {
    if (isInit.current) return;

    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.init();

    isInit.current = true;
  }, []);

  function openSpotlight(file: FileMetadata) {
    const indexInSpotlightSources = spotlightSources.findIndex((source) => source.file.filename === file.filename);
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

  function handleFileClick(item: FileMetadata) {
    setLastOpenedFile(item);

    if (isImageFile(item)) {
      openSpotlight(item);
    }

    if (isDirectory(item)) {
      const newPath = "/home" + item.relative_path;
      history.pushState({}, "", newPath);
    }
  }

  return (
    <div className="flex flex-1 bg-surface-container md:max-w-3xl no-scrollbar">
      <VList ref={ref} className="h-full no-scrollbar" itemSize={60}>
        {files.map((file) => {
          return (
            <FileItem
              key={file.filename}
              meta={file}
              highlight={file.filename === lastOpenedFile?.filename}
              onPress={() => handleFileClick(file)}
              onDelete={() => onDeleteFile(file)}
            />
          );
        })}
      </VList>
    </div>
  );
}
