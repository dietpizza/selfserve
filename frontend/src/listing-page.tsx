import type React from "react";
import { useDirectoryListing } from "./utils";
import { FileItem } from "./components";
import type { FileMetadata } from "./types";
import { useState, useEffect } from "react";
import { ZoomableOverlay } from "./components";
import { API_URL } from "./const";

export const ListingPage: React.FC = () => {
  const { files, loading, error } = useDirectoryListing("/");
  const [lastOpenedFile, setLastOpenedFile] = useState<FileMetadata | null>(null);

  const onPressFile = (meta: FileMetadata) => {
    setLastOpenedFile(meta);
    console.log("Pressed file:", meta);
  };

  return (
    <>
      <div className="bg-slate-800 py-2 h-screen w-screen max-h-screen md:max-w-prose no-scrollbar flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-2">
          {files.map((file) => {
            const isHighlighted = lastOpenedFile?.filename === file.filename && lastOpenedFile?.mtime === file.mtime;
            return <FileItem key={file.filename} highlight={isHighlighted} meta={file} onPress={onPressFile} />;
          })}
        </div>
      </div>
      {lastOpenedFile && (
        <ZoomableOverlay onClose={() => setLastOpenedFile(null)}>
          <img src={`${API_URL}/files/${encodeURIComponent(lastOpenedFile.filename)}`} alt={lastOpenedFile.filename} />
        </ZoomableOverlay>
      )}
    </>
  );
};
