import type { FileMetadata } from "../types";

export function getSpotlightSource(file: FileMetadata) {
  return { src: `/files/${encodeURIComponent(file.filename)}` };
}
