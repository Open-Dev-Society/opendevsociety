export const CACHE_KEYS = {
    STATS: 'ods_stats_cache',
    CONTRIBUTORS: 'ods_contributors_cache'
};

const DEFAULT_TTL = 3600 * 1000; // 1 hour in milliseconds

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

export function saveToCache<T>(key: string, data: T): void {
    try {
        const entry: CacheEntry<T> = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.warn("Failed to save to localStorage", e);
    }
}

export function getFromCache<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const entry: CacheEntry<T> = JSON.parse(item);
        const now = Date.now();

        if (now - entry.timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }

        return entry.data;
    } catch (e) {
        console.warn("Failed to read from localStorage", e);
        return null;
    }
}
