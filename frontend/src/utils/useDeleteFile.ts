import axios from "axios";

export function useDeleteFile() {
  async function deleteFile(path: string): Promise<void> {
    const data = await axios.get(`/api/delete`, { params: { path } });
    if (data.status !== 200) {
      throw new Error("Failed to delete file");
    }
  }

  return { deleteFile };
}
