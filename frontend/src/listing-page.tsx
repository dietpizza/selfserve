import type React from "react";
import { useDirectoryListing } from "./utils";
import { Gallery } from "./components";
import { useState, useMemo } from "react";
import type { FileMetadata } from "./types";

export const ListingPage: React.FC = () => {
  const { files, loading, error } = useDirectoryListing("/");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  // const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // const onPressFile = (idx: number) => {
  //   setSelectedFileIndex(idx);
  //   setIsPreviewVisible(true);
  // };

  const images = useMemo(() => {
    return files.filter((f) => f.mimetype.startsWith("image/"));
  }, [files, selectedFileIndex]);

  function onDeleteImage(image: FileMetadata) {
    // TODO: Implement delete functionality
  }

  return (
    <div className="bg-slate-800 h-screen w-screen max-h-screen md:max-w-3xl no-scrollbar flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-2">
        <Gallery images={images || []} onDeleteImage={onDeleteImage} />
      </div>
    </div>
  );
};
