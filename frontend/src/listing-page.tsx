import type React from "react";
import { useDirectoryListing } from "./utils";
import { FileItem } from "./components";
import type { FileMetadata } from "./types";
import { useState } from "react";
import { API_URL } from "./const";

export const ListingPage: React.FC = () => {
  const { files, loading, error } = useDirectoryListing("/");
  const [lastOpenedFile, setLastOpenedFile] = useState<FileMetadata | null>(null);

  const onPressFile = (meta: FileMetadata) => {
    setLastOpenedFile(meta);
    console.log("Pressed file:", meta);
  };

  return (
    <div className="bg-slate-800 py-2 h-screen w-screen max-h-screen md:max-w-prose no-scrollbar flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-2">
        {files.map((file) => {
          const isHighlighted = lastOpenedFile?.filename === file.filename && lastOpenedFile?.mtime === file.mtime;
          return <FileItem key={file.filename} highlight={isHighlighted} meta={file} onPress={onPressFile} />;
        })}
      </div>
      {lastOpenedFile && (
        <Overlay onClose={() => setLastOpenedFile(null)}>
          <img
            src={`${API_URL}/files/${encodeURIComponent(lastOpenedFile.filename)}`}
            className="max-w-9/10 max-h-9/10"
          />
        </Overlay>
      )}
    </div>
  );
};

const Overlay: React.FC<{ onClose: () => void; children?: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <>
      <div className="absolute inset-0 flex bg-black opacity-50 items-center justify-center" />
      <div className="absolute inset-0 flex items-center justify-center" onClick={onClose}>
        {children}
      </div>
    </>
  );
};
