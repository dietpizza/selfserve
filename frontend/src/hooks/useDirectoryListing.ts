import axios from "axios";
import { useEffect, useState } from "react";
import type { FileMetadata } from "../types";
import { useEventListener } from "usehooks-ts";

export function useDirectoryListing(path: string) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // @ts-expect-error
  useEventListener("visibilitychange", getFiles);

  async function getFiles() {
    if (document.visibilityState === "hidden") return;

    setIsLoading(true);
    try {
      const data = await axios.get(`/api/list/${encodeURIComponent(path)}`);
      setFiles(data.data);
    } catch (e) {
      setError("Failed to fetch directory listing");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getFiles();
  }, [path]);

  return {
    files: files || [],
    loading: isLoading,
    error: error,
    refetch: getFiles,
  };
}
