/**
 * Smart Client-Side Caching Layer
 * Provides memory caching + persistent localStorage caching with TTL & stale-while-revalidate.
 */

class SmartCache {
  constructor() {
    this.memoryCache = new Map();
  }

  /**
   * Get cached data or execute fetcher with stale-while-revalidate support
   * @param {string} key - Unique cache key
   * @param {Function} fetcher - Async function returning { data, ... }
   * @param {Object} options - Cache options
   * @param {number} options.ttlMs - Time to live in milliseconds (default: 5 minutes)
   * @param {boolean} options.persist - Whether to persist to localStorage (default: true)
   * @param {boolean} options.forceRefresh - Force fetch fresh data (default: false)
   */
  async getOrFetch(key, fetcher, options = {}) {
    const {
      ttlMs = 5 * 60 * 1000, // 5 mins default
      persist = true,
      forceRefresh = false
    } = options;

    const now = Date.now();

    // Check Memory Cache first
    if (!forceRefresh && this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (now - entry.timestamp < ttlMs) {
        return { data: entry.data, fromCache: true, source: 'memory' };
      }
    }

    // Check LocalStorage Cache
    if (!forceRefresh && persist) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const isFresh = now - parsed.timestamp < ttlMs;

          // Put into memory cache
          this.memoryCache.set(key, parsed);

          if (isFresh) {
            return { data: parsed.data, fromCache: true, source: 'localStorage' };
          }

          // Stale-While-Revalidate: Return stale immediately while revalidating in background
          this.revalidateInBackground(key, fetcher, { persist, ttlMs });
          return { data: parsed.data, fromCache: true, stale: true, source: 'localStorage-stale' };
        }
      } catch (err) {
        console.warn('[SmartCache] Failed to parse localStorage cache for key:', key, err);
      }
    }

    // Fetch Fresh Data
    return await this.fetchAndStore(key, fetcher, { persist, ttlMs });
  }

  async fetchAndStore(key, fetcher, { persist, ttlMs }) {
    try {
      const result = await fetcher();
      if (result && result.data !== undefined) {
        this.set(key, result.data, { persist, ttlMs });
      }
      return { ...result, fromCache: false };
    } catch (err) {
      console.error('[SmartCache] Fetch failed for key:', key, err);
      // Fallback to memory or localStorage even if stale
      const fallback = this.get(key);
      if (fallback) {
        return { data: fallback, fromCache: true, fallback: true, error: err.message };
      }
      throw err;
    }
  }

  revalidateInBackground(key, fetcher, options) {
    setTimeout(async () => {
      try {
        const result = await fetcher();
        if (result && result.data !== undefined) {
          this.set(key, result.data, options);
          console.log('[SmartCache] Background revalidation completed for:', key);
        }
      } catch (err) {
        console.warn('[SmartCache] Background revalidation failed for:', key, err);
      }
    }, 50);
  }

  /**
   * Directly set data in cache
   */
  set(key, data, options = {}) {
    const { persist = true } = options;
    const entry = {
      data,
      timestamp: Date.now()
    };
    this.memoryCache.set(key, entry);

    if (persist) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (err) {
        console.warn('[SmartCache] localStorage quota exceeded or unavailable:', err);
      }
    }
  }

  /**
   * Get value from cache without fetching
   */
  get(key) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key).data;
    }
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.memoryCache.set(key, parsed);
        return parsed.data;
      }
    } catch (_) {}
    return null;
  }

  /**
   * Invalidate specific key or prefix
   */
  invalidate(keyOrPrefix) {
    // Invalidate memory cache
    for (const k of this.memoryCache.keys()) {
      if (k === keyOrPrefix || k.startsWith(`${keyOrPrefix}_`)) {
        this.memoryCache.delete(k);
      }
    }

    // Invalidate localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k === `cache_${keyOrPrefix}` || k.startsWith(`cache_${keyOrPrefix}_`))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (_) {}

    console.log('[SmartCache] 🧹 Invalidated cache for:', keyOrPrefix);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.memoryCache.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('cache_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (_) {}
    console.log('[SmartCache] 🧹 All cache cleared.');
  }
}

export const cache = new SmartCache();
