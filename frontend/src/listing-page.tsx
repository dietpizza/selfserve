import React, { useState, useMemo, useRef } from "react";
import { deleteFile, useDirectoryListing } from "./utils";
import { Dialog, Gallery } from "./components";

import type { FileMetadata } from "./types";

export const ListingPage: React.FC = () => {
  const { files, refetch, loading, error } = useDirectoryListing("/");
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const fileDelete = useRef<FileMetadata | null>(null);

  const images = useMemo(() => {
    return files.filter((f) => f.mimetype.startsWith("image/"));
  }, [files]);

  async function onConfirmDelete() {
    setIsDeleteDialogVisible(false);
    if (fileDelete.current) {
      await deleteFile(fileDelete.current.relative_path);
      refetch();
    }
  }

  async function onDeleteImage(image: FileMetadata) {
    fileDelete.current = image;
    setIsDeleteDialogVisible(true);
  }

  return (
    <div className="w-screen max-h-screen md:max-w-3xl no-scrollbar flex flex-col overflow-y-auto">
      <Gallery images={images || []} onDeleteImage={onDeleteImage} />
      <Dialog
        title={"Delete File?"}
        description={"File will be permanently deleted."}
        isVisible={isDeleteDialogVisible}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsDeleteDialogVisible(false)}
      />
    </div>
  );
};
