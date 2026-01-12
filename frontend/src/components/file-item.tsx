import React from "react";
import { cn, getIconForMimetype, humanFileSize } from "../utils";
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
      className={cn(
        `flex items-center py-3 px-4 hover:bg-surface-container cursor-pointer select-none`,
        highlight && "bg-secondary-container"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
    >
      <img src={getIconForMimetype(meta.mimetype)} className="w-8 h-8 inline-block mr-4" />
      <div className="flex flex-1 flex-col justify-start min-w-0">
        <span className="text-md truncate font-medium text-on-surface font-mono">{filename}</span>
        <span className="text-xs text-on-surface-variant truncate">{infoString}</span>
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
