import React from "react";
import { getIconForMimetype } from "../utils";
import ic_delete from "../assets/ic_delete.svg";

import type { FileMetadata } from "../types";

type FileItemProps = {
  meta: FileMetadata;
  highlight: boolean;
  onPress?: () => void;
  onDelete?: () => void;
};

export const FileItem: React.FC<FileItemProps> = ({ meta, highlight, onPress, onDelete }) => {
  const { filename, size, mtime } = meta;
  const infoString = [new Date(mtime * 1000).toLocaleString(), humanFileSize(size)].join(" · ");

  return (
    <div
      style={{ height: "60px" }}
      className={`flex items-center py-3 px-3.5 focus:bg-slate-700 hover:bg-slate-700 active:bg-slate-700 cursor-pointer ${
        highlight ? "bg-slate-700" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
    >
      <img src={getIconForMimetype(meta.mimetype)} className="w-8 h-8 inline-block mr-2" />
      <div className="flex flex-1 flex-col justify-start min-w-0">
        <span className="text-md truncate font-medium text-white font-mono">{filename}</span>
        <span className="text-xs text-gray-300 truncate">{infoString}</span>
      </div>
      <img
        src={ic_delete}
        className="w-6 h-6 inline-block ml-2"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      />
    </div>
  );
};

function humanFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
