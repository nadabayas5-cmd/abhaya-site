import { useState, useEffect, useRef } from 'react';

/**
 * Sliding-window Rate Limiter for Client-Side Actions
 */
class RateLimiter {
  constructor() {
    this.actionHistory = new Map(); // key -> Array of timestamps
  }

  /**
   * Check if action is allowed under rate limits
   * @param {string} actionKey - Action identifier (e.g. 'order_lookup', 'admin_pin', 'catalog_refresh')
   * @param {Object} options
   * @param {number} options.maxRequests - Max requests allowed in window (default: 5)
   * @param {number} options.windowMs - Time window in milliseconds (default: 60000ms / 1 min)
   * @returns {{ allowed: boolean, remainingAttempts: number, retryAfterSec: number }}
   */
  check(actionKey, options = {}) {
    const { maxRequests = 5, windowMs = 60000 } = options;
    const now = Date.now();

    if (!this.actionHistory.has(actionKey)) {
      this.actionHistory.set(actionKey, []);
    }

    const timestamps = this.actionHistory.get(actionKey);

    // Filter out timestamps outside window
    const activeTimestamps = timestamps.filter(t => now - t < windowMs);
    this.actionHistory.set(actionKey, activeTimestamps);

    if (activeTimestamps.length >= maxRequests) {
      const oldestInWindow = activeTimestamps[0];
      const retryAfterMs = Math.max(0, windowMs - (now - oldestInWindow));
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSec,
        retryAfterMs
      };
    }

    // Register this request
    activeTimestamps.push(now);
    return {
      allowed: true,
      remainingAttempts: maxRequests - activeTimestamps.length,
      retryAfterSec: 0,
      retryAfterMs: 0
    };
  }

  /**
   * Reset attempts for a key
   */
  reset(actionKey) {
    this.actionHistory.delete(actionKey);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Custom React Hook: useDebounce
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom React Hook: useThrottledCallback
 */
export function useThrottledCallback(callback, delay = 300) {
  const lastRan = useRef(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return (...args) => {
    const now = Date.now();
    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      callbackRef.current(...args);
    }
  };
}
