import type { FileMetadata } from "../types";

import { getSpotlightSource, shuffleList } from "../utils";
import { FileItem } from "./file-item";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VList, type VListHandle } from "virtua";

import art_empty from "../assets/art_empty.svg";
import { AnimatePresence, motion, type Transition } from "motion/react";

function isImageFile(file: FileMetadata) {
  return file.mimetype.startsWith("image/");
}

function isDirectory(file: FileMetadata) {
  return file.mimetype === "directory";
}

type FileListProps = {
  files: FileMetadata[] | null;
  onDeleteFile: (image: FileMetadata) => void;
};

export function FileList({ files, onDeleteFile }: FileListProps) {
  const [lastOpenedFile, setLastOpenedFile] = useState<FileMetadata | null>(null);
  const isInit = useRef(false);
  const ref = useRef<VListHandle>(null);

  // Spotlight is 1-indexed
  function onImageChange(spotIndex: number) {
    const _file = spotlightSources?.[spotIndex - 1]?.file;
    if (_file) setLastOpenedFile(_file);

    ref.current?.scrollToIndex(spotIndex - 1, { align: "center", smooth: false });
  }

  const spotlightSources = useMemo(() => files?.filter(isImageFile).map(getSpotlightSource), [files]);

  useEffect(() => {
    if (isInit.current) return;

    // @ts-expect-error spotlight is a global injected by spotlight.bundle.js
    Spotlight.init();

    isInit.current = true;
  }, []);

  function openSpotlight(file: FileMetadata) {
    const indexInSpotlightSources = spotlightSources?.findIndex((source) => source.file.filename === file.filename);
    if (indexInSpotlightSources !== undefined)
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

  const transition: Transition = {
    duration: 0.75,
  };

  return (
    <div className="flex flex-1 bg-surface-container md:max-w-3xl no-scrollbar overflow-hidden">
      <AnimatePresence presenceAffectsLayout={false}>
        {files?.length == 0 ? (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={transition}
            className="flex flex-col flex-1 justify-center items-center"
          >
            <img src={art_empty} className="w-32 h-32 opacity-75" />
            <span className="mt-8 text-xl text-on-surface-variant text-center px-4">No files found</span>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-1"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={transition}
          >
            <VList ref={ref} className="h-full no-scrollbar">
              {files?.map((file) => {
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
