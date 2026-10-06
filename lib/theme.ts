"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/themeStorageKey";

export type ThemePreference = "light" | "dark" | "system";

const CHANGE_EVENT = "theme-preference-change";

function readTheme(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

// 沒有 data-theme 時，CSS 會跟隨系統的 prefers-color-scheme
function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function setTheme(theme: ThemePreference) {
  try {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // 無法寫入時仍套用到目前頁面
  }
  applyTheme(theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  // 其他分頁改了主題時，同步套用到這個分頁
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme(readTheme());
      callback();
    }
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  return useSyncExternalStore(subscribe, readTheme, () => "system" as const);
}
