import type React from "react";
import { useDirectoryListing } from "./utils";
import { FileItem } from "./components";
import type { FileMetadata } from "./types";
import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger fade-in on mount
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    // start fade-out then unmount after duration
    setVisible(false);
    // match transition duration in Tailwind classes (300ms)
    setTimeout(() => setMounted(false), 300);
    // call parent's onClose after animation ends to clear selected file
    setTimeout(onClose, 300);
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={`absolute inset-0 flex bg-black items-center justify-center transition-opacity duration-300 ${
          visible ? "opacity-50" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-4 right-4 z-50">
          <button
            aria-label="Close"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </>
  );
};
