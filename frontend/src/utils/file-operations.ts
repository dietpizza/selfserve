import axios from "axios";

export async function deleteFile(path: string): Promise<void> {
  console.info("Deleting file at path:", path);
  const data = await axios.post("/api/delete", { path });
  if (data.status !== 200) {
    throw new Error("Failed to delete file");
  }
}

export function humanFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
