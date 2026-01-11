import React, { useState, useMemo } from "react";
import { deleteFile, useDirectoryListing } from "./utils";
import { Gallery } from "./components";

import type { FileMetadata } from "./types";

export const ListingPage: React.FC = () => {
  const { files, refetch, loading, error } = useDirectoryListing("/");

  const images = useMemo(() => {
    return files.filter((f) => f.mimetype.startsWith("image/"));
  }, [files]);

  async function onDeleteImage(image: FileMetadata) {
    const isDeleteConfirmed = confirm("Delete this image bitch?");
    console.info("Is delete confirmed:", isDeleteConfirmed, image);
    if (isDeleteConfirmed) {
      await deleteFile(image.relative_path);
      refetch();
    }
  }

  return (
    <div className="bg-slate-800 w-screen max-h-screen min-w-lg md:max-w-3xl no-scrollbar flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-2">
        <Gallery images={images || []} onDeleteImage={onDeleteImage} />
      </div>
    </div>
  );
};
