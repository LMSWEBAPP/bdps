// Lightweight Client-Side In-Flight Request Deduplicator & Memory Cache
const promiseCache = new Map();
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds in-memory TTL

export async function fetchCached(url) {
  if (typeof window === 'undefined') {
    const res = await fetch(url);
    return res.json();
  }

  const now = Date.now();
  const cached = memoryCache.get(url);
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  if (promiseCache.has(url)) {
    return promiseCache.get(url);
  }

  const fetchPromise = fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(data => {
      memoryCache.set(url, { data, timestamp: Date.now() });
      promiseCache.delete(url);
      return data;
    })
    .catch(err => {
      promiseCache.delete(url);
      throw err;
    });

  promiseCache.set(url, fetchPromise);
  return fetchPromise;
}
