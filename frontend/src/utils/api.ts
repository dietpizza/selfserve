import axios from "axios";

export async function deleteFile(path: string) {
  const data = await axios.post("/api/delete", { path });
  if (data.status !== 200) {
    throw new Error("Failed to delete file");
  }
  return data.data;
}

export async function getFilesInDirectory(path: string) {
  const data = await axios.get(`/api/list/${encodeURIComponent(path)}`);
  if (data.status !== 200) {
    throw new Error("Failed to get directory listing");
  }
  return data.data;
}
