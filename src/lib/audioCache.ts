const CACHE_NAME = "endura-audio-v1";

/**
 * Pre-caches a list of audio URLs using the Cache API.
 * Call this when a user opens an exercise to enable offline playback.
 */
export async function preCacheAudioUrls(urls: string[]): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    const existing = await cache.keys();
    const existingUrls = new Set(existing.map((r) => r.url));
    const toCache = urls.filter((u) => !existingUrls.has(u));
    await Promise.all(
      toCache.map((url) =>
        fetch(url)
          .then((res) => {
            if (res.ok) return cache.put(url, res);
          })
          .catch(() => {})
      )
    );
  } catch {
    // Cache API not available or quota exceeded
  }
}

/**
 * Retrieves a cached audio response, or fetches and caches it.
 */
export async function getCachedAudio(url: string): Promise<Response | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    if (cached) return cached;
    const res = await fetch(url);
    if (res.ok) {
      await cache.put(url, res.clone());
      return res;
    }
    return null;
  } catch {
    return null;
  }
}
