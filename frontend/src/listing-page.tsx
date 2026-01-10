import type React from "react";
import { useDirectoryListing } from "./utils";
import { FileItem } from "./components";
import type { FileMetadata } from "./types";
import { useState, useEffect } from "react";
import { ZoomableOverlay } from "./components";

export const ListingPage: React.FC = () => {
  const { files, loading, error } = useDirectoryListing("/");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const onPressFile = (idx: number) => {
    setSelectedFileIndex(idx);
    setIsPreviewVisible(true);
  };

  return (
    <>
      <div className="bg-slate-800 py-2 h-screen w-screen max-h-screen md:max-w-prose no-scrollbar flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-2">
          {files?.map((file, idx) => (
            <FileItem
              key={file.filename}
              highlight={idx === selectedFileIndex}
              meta={file}
              onPress={() => onPressFile(idx)}
            />
          ))}
        </div>
      </div>
      {selectedFileIndex !== -1 && isPreviewVisible && (
        <ZoomableOverlay playlist={files} index={selectedFileIndex} onClose={() => setIsPreviewVisible(false)} />
      )}
    </>
  );
};
