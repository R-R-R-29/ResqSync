/**
 * useOnlineStatus
 *
 * Tracks real-time network and server reachability state.
 *
 * Returns
 * ───────
 *   isOnline            – navigator.onLine (device has any network interface)
 *   isServerReachable   – last health-ping to /api/health succeeded
 *   isSimulatedOffline  – manual "field mode" toggle (overrides isOnline)
 *   setSimulatedOffline – setter that forces the app into offline mode
 *
 * Health ping behaviour
 * ─────────────────────
 *  • Fires immediately on mount.
 *  • Repeats every PING_INTERVAL_MS while isOnline && !isSimulatedOffline.
 *  • Uses AbortController so in-flight fetches are cancelled on unmount or
 *    when the device goes offline, preventing stale state updates.
 *  • A ping that times out (> PING_TIMEOUT_MS) is treated as unreachable.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const PING_INTERVAL_MS = 5_000;   // check every 5 s
const PING_TIMEOUT_MS  = 3_000;   // treat as unreachable if no response in 3 s
const HEALTH_URL       = '/api/health';

export function useOnlineStatus() {
  const [isOnline,           setIsOnline]           = useState(() => navigator.onLine);
  const [isServerReachable,  setIsServerReachable]  = useState(false);
  const [isSimulatedOffline, setSimulatedOffline]   = useState(false);

  // Stable ref to the latest AbortController so we can cancel in-flight pings
  const abortRef    = useRef(null);
  const intervalRef = useRef(null);

  // ─── Health ping ────────────────────────────────────────────────────────────

  const ping = useCallback(async () => {
    // Cancel any in-flight ping before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Timeout via a race between the fetch and a timer
    const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);

    try {
      const res = await fetch(HEALTH_URL, {
        method: 'GET',
        signal: controller.signal,
        // Bypass browser cache so we always measure actual server reachability
        cache:  'no-store',
      });
      clearTimeout(timeoutId);
      setIsServerReachable(res.ok);
    } catch {
      // AbortError (timeout) or network failure both mean unreachable
      clearTimeout(timeoutId);
      setIsServerReachable(false);
    }
  }, []);

  // ─── Periodic ping scheduler ────────────────────────────────────────────────

  const startPinging = useCallback(() => {
    stopPinging();
    ping(); // immediate probe on first call
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);
  }, [ping]);

  const stopPinging = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setIsServerReachable(false);
  }, []);

  // ─── navigator.onLine listeners ─────────────────────────────────────────────

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ─── Start / stop pinging based on effective connectivity ───────────────────

  useEffect(() => {
    const shouldPing = isOnline && !isSimulatedOffline;

    if (shouldPing) {
      startPinging();
    } else {
      stopPinging();
    }

    return () => {
      // Clean up on unmount or when dependencies change mid-cycle
      stopPinging();
    };
  }, [isOnline, isSimulatedOffline, startPinging, stopPinging]);

  // ─── Public API ─────────────────────────────────────────────────────────────

  return {
    /** True when navigator.onLine reports a network interface is available */
    isOnline,
    /** True when the last /api/health ping returned HTTP 200 */
    isServerReachable,
    /**
     * When true the app behaves as if offline even if the device has network.
     * Useful for testing offline flows and for field units that want to defer sync.
     */
    isSimulatedOffline,
    /** Toggle simulated offline mode on / off */
    setSimulatedOffline,
    /** Trigger an immediate out-of-schedule health ping */
    pingNow: ping,
  };
}
