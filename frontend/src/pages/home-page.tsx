import React, { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, FileList } from "../components";
import { useDirectoryListing, useLocationChange } from "../hooks";
import { deleteFile } from "../utils";

import ic_home from "../assets/ic_home.svg";
import ic_chevron_right from "../assets/ic_chevron_right.svg";

import type { FileMetadata } from "../types";

export const HomePage: React.FC = () => {
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [path, setPath] = useState(["/"]);

  const normalizedPath = useMemo(() => {
    return window.location.pathname.replace("/home", "");
  }, [path]);

  const { files, refetch, loading, error } = useDirectoryListing(normalizedPath);

  const fileToDelete = useRef<FileMetadata | null>(null);

  function onPathChange(newPath: string, _oldPath?: string) {
    console.info("Location changed to", newPath);
    if (newPath === "/" || newPath === "") {
      window.history.replaceState({}, "", "/home");
      return;
    }

    const _path = newPath.split("/").filter((seg) => seg.length > 0);
    setPath(_path);
  }

  useLocationChange(onPathChange);
  useEffect(() => {
    onPathChange(window.location.pathname);
  }, []);

  async function onConfirmDelete() {
    setIsDeleteDialogVisible(false);
    if (fileToDelete.current) {
      await deleteFile(fileToDelete.current.relative_path);
      refetch();
    }
  }

  async function onDeleteImage(image: FileMetadata) {
    fileToDelete.current = image;
    setIsDeleteDialogVisible(true);
  }

  return (
    <div className="flex flex-1 flex-col w-screen md:max-w-3xl no-scrollbar">
      <Breadcrumbs path={path} />
      <FileList files={files} onDeleteFile={onDeleteImage} />
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

const Breadcrumbs: React.FC<{ path: string[] }> = ({ path }) => {
  const segments = path.map((e, idx) => {
    return (
      <div className="flex items-center" key={e}>
        {idx === 0 ? (
          <img src={ic_home} alt="Home" className="w-5 h-5" />
        ) : (
          <>
            <img src={ic_chevron_right} alt=">" className="w-4 h-4 mx-2" />
            <span className="text-sm font-medium text-on-surface-variant">{e}</span>
          </>
        )}
      </div>
    );
  });

  return <div className="flex items-center w-full bg-surface-variant p-3 px-5.5">{segments}</div>;
};
