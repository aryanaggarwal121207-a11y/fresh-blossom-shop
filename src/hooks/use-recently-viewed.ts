import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "stfresh_recently_viewed";
const MAX = 8;

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    } catch {
      setIds([]);
    }
  }, []);

  const track = useCallback((productId: string) => {
    setIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { ids, track };
}