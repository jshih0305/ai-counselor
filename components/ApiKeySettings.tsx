"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearApiKey,
  maskApiKey,
  onOpenApiKeySettings,
  saveApiKey,
  useApiKey,
} from "@/lib/apiKey";

export default function ApiKeySettings() {
  const apiKey = useApiKey();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState("");
  const [showKey, setShowKey] = useState(false);

  function open() {
    setDraft("");
    setShowKey(false);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  // 其他元件（例如諮詢頁）可以要求打開設定
  useEffect(() => onOpenApiKeySettings(open), []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const key = draft.trim();
    if (!key) return;
    saveApiKey(key);
    close();
  }

  function handleClear() {
    clearApiKey();
    setDraft("");
  }

  const looksInvalid = draft.trim() !== "" && !draft.trim().startsWith("sk-");

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
        aria-label="API Key 設定"
      >
        <span className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="8" cy="15" r="4" />
            <path d="m10.8 12.2 8.7-8.7 M16 7l2.5 2.5 M13.5 9.5 15.5 11.5" />
          </svg>
          <span
            className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${
              apiKey ? "bg-accent" : "bg-clay"
            }`}
          />
        </span>
        <span className="hidden sm:inline">
          {apiKey ? "API Key 已設定" : "設定 API Key"}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-line bg-paper-raised p-0 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium tracking-[0.25em] text-clay">
                設定
              </span>
              <h2 className="font-serif text-2xl font-bold">OpenAI API Key</h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="關閉"
              className="-mt-1 -mr-1 rounded-full p-2 text-xl leading-none text-ink-muted hover:bg-paper hover:text-ink"
            >
              ×
            </button>
          </div>

          <p className="text-sm leading-relaxed text-ink-muted">
            心嶼使用你自己的 OpenAI API Key 呼叫模型，費用由你的 OpenAI
            帳戶支付。可以到{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent-hover"
            >
              OpenAI 後台
            </a>{" "}
            建立一組金鑰。
          </p>

          {apiKey && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-ink-muted">目前使用中</span>
                <span className="font-mono text-sm">{maskApiKey(apiKey)}</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
              >
                清除
              </button>
            </div>
          )}

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              {apiKey ? "更換為新的 API Key" : "輸入你的 API Key"}
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-1 focus-within:border-accent">
              <input
                type={showKey ? "text" : "password"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent py-2.5 font-mono text-sm outline-none placeholder:text-ink-muted/60"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="shrink-0 text-xs text-ink-muted hover:text-ink"
              >
                {showKey ? "隱藏" : "顯示"}
              </button>
            </div>
            {looksInvalid && (
              <span className="text-xs text-clay">
                OpenAI 的 API Key 通常以「sk-」開頭，請確認是否貼上正確。
              </span>
            )}
          </label>

          <p className="rounded-2xl bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-muted">
            金鑰只會儲存在這個瀏覽器的 localStorage
            中，每次諮詢時隨請求傳送給我們的伺服器、再轉送給
            OpenAI，伺服器不會保存。建議不要在公用電腦上使用，並可在 OpenAI
            後台為這組金鑰設定用量上限。
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-paper"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              儲存
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
