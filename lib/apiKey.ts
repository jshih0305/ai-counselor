"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ai-counselor:openai-api-key";
const CHANGE_EVENT = "openai-api-key-change";
const OPEN_SETTINGS_EVENT = "open-api-key-settings";

// localStorage 在無痕模式或被封鎖時可能會丟例外，一律包起來
export function getApiKey(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // 無法寫入時仍通知畫面更新，讓使用者看到結果
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearApiKey() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 忽略
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

// 伺服器端渲染時一律視為尚未設定，避免 hydration 不一致
export function useApiKey() {
  return useSyncExternalStore(subscribe, getApiKey, () => null);
}

export function openApiKeySettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenApiKeySettings(callback: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, callback);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, callback);
}

export function maskApiKey(key: string) {
  if (key.length <= 10) return "•".repeat(key.length);
  return `${key.slice(0, 5)}••••••••${key.slice(-4)}`;
}
