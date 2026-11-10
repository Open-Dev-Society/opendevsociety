"use client";

import { useSyncExternalStore } from "react";

const KEY = "ods.handle";
const EVENT = "ods:handle";

/** GitHub username: 1–39 chars, alphanumerics and hyphens, no leading hyphen. */
export const HANDLE_RE = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

export const isValidHandle = (h: string) => HANDLE_RE.test(h);

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  // "storage" covers other tabs, EVENT covers this tab (Wall and Bench share one handle).
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function write(h: string | null) {
  try {
    if (h) localStorage.setItem(KEY, h);
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked: the handle just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

/** The claimed GitHub handle (null until claimed), kept in localStorage["ods.handle"]. Null on the server. */
export function useHandle(): [string | null, (h: string | null) => void] {
  const handle = useSyncExternalStore(subscribe, read, () => null);
  return [handle, write];
}
