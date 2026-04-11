import { useState, useCallback } from 'react';

const STORAGE_KEY = 'the-block-watchlist';

function loadWatchlist(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch { /* ignore corrupted data */ }
  return new Set();
}

function saveWatchlist(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Set<string>>(loadWatchlist);

  const toggle = useCallback((id: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveWatchlist(next);
      return next;
    });
  }, []);

  const isWatched = useCallback((id: string) => watchlist.has(id), [watchlist]);

  const count = watchlist.size;

  return { toggle, isWatched, count, watchlist };
}
