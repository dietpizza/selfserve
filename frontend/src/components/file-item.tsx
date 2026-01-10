import type { FileMetadata } from "../types";
import ic_photo from "../assets/ic_photo.svg";
import ic_video from "../assets/ic_video.svg";
import ic_document from "../assets/ic_document.svg";
import ic_folder from "../assets/ic_folder.svg";
import ic_unknown from "../assets/ic_unknown.svg";
import type React from "react";

function getIconForMimetype(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return ic_photo;
  } else if (mimetype.startsWith("video/")) {
    return ic_video;
  } else if (mimetype.startsWith("text/")) {
    return ic_document;
  } else if (mimetype === "directory") {
    return ic_folder;
  } else {
    return ic_unknown;
  }
}

type FileItemProps = { meta: FileMetadata; highlight: boolean; onPress?: () => void };

export const FileItem: React.FC<FileItemProps> = ({ meta, highlight, onPress }) => {
  const { filename, size, mtime } = meta;
  const infoString = [new Date(mtime * 1000).toLocaleString(), humanFileSize(size)].join(" · ");

  return (
    <div
      className={`flex items-center py-3 px-3.5 focus:bg-slate-700 hover:bg-slate-700 active:bg-slate-700 cursor-pointer ${
        highlight ? "bg-slate-700" : ""
      }`}
      onClick={(e) => {
        e.preventDefault();
        onPress?.();
      }}
    >
      <img src={getIconForMimetype(meta.mimetype)} className="w-8 h-8 inline-block mr-2" />
      <div className="flex flex-col flex-1 ">
        <span className="text-md truncate font-medium text-white font-mono">{filename}</span>
        <span className="text-xs text-gray-300">{infoString}</span>
      </div>
    </div>
  );
};

function humanFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
