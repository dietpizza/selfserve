import type { FileMetadata } from "../types";
import ic_document from "../assets/id_document.svg";
import ic_folder from "../assets/ic_folder.svg";
import { API_URL } from "../const";

function getIconForMimetype(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "../assets/id_photo.svg";
  } else if (mimetype.startsWith("video/")) {
    return "../assets/id_video.svg";
  } else if (mimetype.startsWith("text/")) {
    return "../assets/id_document.svg";
  } else if (mimetype === "directory") {
    return "../assets/id_folder.svg";
  } else {
    return ic_document;
  }
}
type FileItemProps = { meta: FileMetadata; highlight: boolean; onPress: (meta: FileMetadata) => void };

export const FileItem: React.FC<FileItemProps> = ({ meta, highlight, onPress }) => {
  const { filename, size, mtime } = meta;
  const infoString = [new Date(mtime * 1000).toLocaleString(), humanFileSize(size)].join(" · ");

  return (
    <div
      className={`flex items-center py-3 px-3.5 focus:bg-slate-700 hover:bg-slate-700 active:bg-slate-700 cursor-pointer ${
        highlight ? "bg-slate-700" : ""
      }`}
      onClick={() => onPress(meta)}
    >
      <img src={ic_document} className="w-8 h-8 inline-block mr-2" />
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
