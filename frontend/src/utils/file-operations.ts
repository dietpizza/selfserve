import axios from "axios";

export async function deleteFile(path: string): Promise<void> {
  console.info("Deleting file at path:", path);
  const data = await axios.post("/api/delete", { path });
  if (data.status !== 200) {
    throw new Error("Failed to delete file");
  }
}
