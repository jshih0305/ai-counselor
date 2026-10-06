"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { openApiKeySettings, useApiKey } from "@/lib/apiKey";
import { API_KEY_HEADER } from "@/lib/apiKeyHeader";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type SummaryResult = {
  summary: string;
  coreIssue: string;
  insights: string[];
  suggestions: string[];
  encouragement: string;
};

const DEFAULT_ROUNDS = 3;
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 10;
const ROUND_OPTIONS = Array.from(
  { length: MAX_ROUNDS - MIN_ROUNDS + 1 },
  (_, i) => MIN_ROUNDS + i
);

const STARTER_PROMPTS = [
  "最近工作壓力很大，覺得自己怎麼做都不夠好",
  "和伴侶常常吵架，我不知道問題出在哪裡",
  "對未來很迷惘，不知道自己真正想要什麼",
  "很在意別人的眼光，總是不敢拒絕別人",
];

class CounselorApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

export default function CounselorClient() {
  const apiKey = useApiKey();
  const [totalRounds, setTotalRounds] = useState(DEFAULT_ROUNDS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const respondedRounds = messages.filter((m) => m.role === "assistant").length;
  const isStarted = messages.length > 0;
  const isDone = summary !== null;

  useEffect(() => {
    if (isStarted) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading, summary, isStarted]);

  async function callCounselorApi(nextMessages: ChatMessage[], key: string) {
    const res = await fetch("/api/counselor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [API_KEY_HEADER]: key,
      },
      body: JSON.stringify({ messages: nextMessages, totalRounds }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new CounselorApiError(data.error || "發生未知錯誤", data.code);
    }
    return data as
      | { type: "reply"; message: string; round: number }
      | { type: "summary"; result: SummaryResult };
  }

  async function send() {
    if (!input.trim() || isLoading) return;
    if (!apiKey) {
      openApiKeySettings();
      return;
    }
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    try {
      const data = await callCounselorApi(nextMessages, apiKey);
      if (data.type === "reply") {
        setMessages([
          ...nextMessages,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setSummary(data.result);
      }
    } catch (e) {
      // 還原輸入，讓使用者可以重新送出
      setMessages(messages);
      setInput(nextMessages[nextMessages.length - 1].content);
      setError(e instanceof Error ? e.message : "發生未知錯誤");
      if (
        e instanceof CounselorApiError &&
        (e.code === "missing_api_key" || e.code === "invalid_api_key")
      ) {
        openApiKeySettings();
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl / ⌘ + Enter 送出；避開中文輸入法選字中的 Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  function restart() {
    setMessages([]);
    setInput("");
    setSummary(null);
    setError(null);
  }

  const isLastAnswer = respondedRounds >= totalRounds;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 md:py-14">
      {!isStarted ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium tracking-[0.25em] text-clay">
              開始諮詢
            </span>
            <h1 className="font-serif text-3xl leading-snug font-bold text-ink sm:text-4xl">
              今天，想聊些什麼？
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              用你自己的話說說最近的困擾，不需要整理得很完整。諮詢師會先承接你的感受，再陪你找出卡住的地方。
            </p>
          </div>

          {!apiKey && (
            <div className="flex flex-col gap-3 rounded-2xl border border-clay/40 bg-paper-raised px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-ink">
                  開始之前，請先設定你的 OpenAI API Key
                </span>
                <span className="text-xs leading-relaxed text-ink-muted">
                  金鑰只會儲存在你的瀏覽器中，諮詢時才會隨請求傳送。
                </span>
              </div>
              <button
                type="button"
                onClick={openApiKeySettings}
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
              >
                設定 API Key
              </button>
            </div>
          )}

          {error && <ErrorBanner message={error} />}

          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-paper-raised p-5 shadow-[0_24px_48px_-32px_rgba(29,38,33,0.35)] sm:p-7">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例如：最近工作壓力很大，每天都很焦慮，覺得自己怎麼做都不夠好..."
              rows={6}
              disabled={isLoading}
              className="w-full resize-none bg-transparent text-base leading-relaxed text-ink outline-none placeholder:text-ink-muted/60 disabled:opacity-60"
            />

            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium text-ink">
                  想要問答幾輪？
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {ROUND_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTotalRounds(n)}
                      aria-pressed={totalRounds === n}
                      className={`h-9 w-9 rounded-full text-sm tabular-nums transition-colors ${
                        totalRounds === n
                          ? "bg-accent font-medium text-accent-ink"
                          : "border border-line text-ink-muted hover:border-accent hover:text-accent"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                onClick={send}
                disabled={!input.trim() || isLoading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? "準備中..." : "開始諮詢 →"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6">
          <ProgressHeader
            respondedRounds={respondedRounds}
            totalRounds={totalRounds}
            isDone={isDone}
          />

          <div className="flex flex-col gap-5">
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <div key={i} className="flex items-start gap-3">
                  <Logo className="mt-1 h-8 w-8 shrink-0" />
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-line bg-paper-raised px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap text-ink">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-accent px-5 py-3.5 text-[15px] leading-relaxed whitespace-pre-wrap text-accent-ink">
                    {m.content}
                  </div>
                </div>
              )
            )}

            {isLoading && (
              <div className="flex items-start gap-3">
                <Logo className="mt-1 h-8 w-8 shrink-0" />
                <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-line bg-paper-raised px-5 py-4 text-sm text-ink-muted">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                  </span>
                  {isLastAnswer ? "正在整理你的諮詢總結..." : "諮詢師正在思考..."}
                </div>
              </div>
            )}
          </div>

          {error && <ErrorBanner message={error} />}

          {!isDone && (
            <div className="sticky bottom-4 mt-auto flex flex-col gap-3 rounded-3xl border border-line bg-paper-raised/95 p-4 shadow-[0_24px_48px_-28px_rgba(29,38,33,0.4)] backdrop-blur sm:p-5">
              <div className="text-xs font-medium text-ink-muted">
                {isLastAnswer
                  ? "這是最後一次回覆，送出後諮詢師將給出總結"
                  : "回應諮詢師的問題，或說說你此刻的感受"}
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="寫下你的回應..."
                rows={3}
                disabled={isLoading}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-muted/60 disabled:opacity-60"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="hidden text-xs text-ink-muted/70 sm:inline">
                  Ctrl / ⌘ + Enter 送出
                </span>
                <button
                  onClick={send}
                  disabled={!input.trim() || isLoading}
                  className="ml-auto rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? "送出中..." : isLastAnswer ? "送出並查看總結" : "送出"}
                </button>
              </div>
            </div>
          )}

          {summary && <SummaryCard summary={summary} onRestart={restart} />}

          <div ref={bottomRef} />
        </div>
      )}

      <p className="mt-10 text-center text-xs leading-relaxed text-ink-muted">
        AI 諮詢師無法取代專業心理師或醫師。若你有傷害自己的念頭或處於危險中，
        <br className="hidden sm:block" />
        請撥打安心專線 1925（24 小時）、生命線 1995，或緊急電話 119 / 110。
      </p>
    </div>
  );
}

function ProgressHeader({
  respondedRounds,
  totalRounds,
  isDone,
}: {
  respondedRounds: number;
  totalRounds: number;
  isDone: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-xl font-bold text-ink">
          {isDone ? "諮詢完成" : "諮詢進行中"}
        </h1>
        <span className="text-xs text-ink-muted tabular-nums">
          {isDone
            ? `共 ${totalRounds} 輪對話`
            : `第 ${Math.max(respondedRounds, 1)} / ${totalRounds} 輪`}
        </span>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: totalRounds }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < respondedRounds
                ? "w-6 bg-accent"
                : "w-3 bg-line"
            }`}
          />
        ))}
        <span
          className={`ml-1 h-2.5 w-2.5 rounded-full ${
            isDone ? "bg-clay" : "border border-line"
          }`}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  summary,
  onRestart,
}: {
  summary: SummaryResult;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col gap-7 rounded-3xl border border-line bg-paper-raised p-6 sm:p-9">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-[0.25em] text-clay">
          諮詢總結
        </span>
        <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
          這次，我們看見了什麼
        </h2>
      </div>

      {summary.summary && (
        <p className="text-[15px] leading-relaxed text-ink-muted">
          {summary.summary}
        </p>
      )}

      {summary.coreIssue && (
        <div className="rounded-2xl border-l-4 border-clay bg-paper px-5 py-4">
          <div className="text-xs font-medium tracking-wider text-clay">
            你可能卡住的地方
          </div>
          <p className="mt-2 font-serif text-lg leading-relaxed font-medium text-ink">
            {summary.coreIssue}
          </p>
        </div>
      )}

      {summary.insights.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-ink">重要覺察</h3>
          <ul className="flex flex-col gap-2">
            {summary.insights.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-relaxed text-ink-muted"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.suggestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-ink">給你的建議</h3>
          <ol className="flex flex-col gap-3">
            {summary.suggestions.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-xl border border-line bg-paper px-4 py-3.5 text-[15px] leading-relaxed text-ink"
              >
                <span className="font-serif text-lg font-bold text-accent tabular-nums">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}

      {summary.encouragement && (
        <p className="rounded-2xl bg-accent px-6 py-5 font-serif text-base leading-relaxed text-accent-ink">
          {summary.encouragement}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRestart}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          開始新的諮詢
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          回到首頁
        </Link>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}
