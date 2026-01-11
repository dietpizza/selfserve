import ic_photo from "../assets/ic_photo.svg";
import ic_video from "../assets/ic_video.svg";
import ic_document from "../assets/ic_document.svg";
import ic_folder from "../assets/ic_folder.svg";
import ic_unknown from "../assets/ic_unknown.svg";

export function getIconForMimetype(mimetype: string): string {
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
