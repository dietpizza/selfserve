import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../const";
import type { FileMetadata } from "../types";

export function useDirectoryListing(path: string) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getFiles() {
    setIsLoading(true);
    try {
      const data = await axios.get(`${API_URL}/api/list/${encodeURIComponent(path)}`);
      setFiles(data.data);
      console.info("API-Response", data.data);
    } catch (e) {
      setError("Failed to fetch directory listing");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getFiles();
  }, [path]);

  return {
    files: files,
    loading: isLoading,
    error: error,
  };
}
