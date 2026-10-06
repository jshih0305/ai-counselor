import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    title: "先承接，再前進",
    body: "每一輪都從具體反映你的情緒與處境開始，不說空泛的安慰話，讓你先感覺被聽見。",
    icon: (
      <path d="M4 12c2.5-4 5.5-6 8-6s5.5 2 8 6c-2.5 4-5.5 6-8 6s-5.5-2-8-6Z M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
  },
  {
    title: "直接挑戰你的想法",
    body: "引用你說過的原話，點出過度概化、非黑即白與未經檢驗的假設。挑戰的是想法，不是你這個人。",
    icon: <path d="M5 19 19 5 M9 5h10v10" />,
  },
  {
    title: "自訂對話深度",
    body: "開始前選擇 1 到 6 輪問答。想快速釐清就短一點，想好好挖深就多聊幾輪。",
    icon: <path d="M4 7h10 M18 7h2 M4 17h2 M10 17h10 M16 4.5v5 M8 14.5v5" />,
  },
  {
    title: "總結與行動建議",
    body: "對話結束後，整理出你可能卡住的核心原因、重要覺察，以及具體可以開始做的小行動。",
    icon: <path d="M6 4h9l3 3v13H6z M9 11h6 M9 15h4" />,
  },
];

const STEPS = [
  {
    title: "說出困擾",
    body: "用你自己的話描述最近的壓力、情緒或卡住的事，不需要整理得很完整。",
  },
  {
    title: "來回對話",
    body: "諮詢師會同理、挑戰並提問，一輪一輪陪你往更深的感受與需求靠近。",
  },
  {
    title: "看見根本原因",
    body: "最後收到一份總結：你卡住的點、對話中的覺察，以及下一步可以怎麼做。",
  },
];

const FAQS = [
  {
    q: "這可以取代心理師嗎？",
    a: "不行。心嶼是幫助你整理想法、自我覺察的工具，無法提供診斷或治療。如果困擾持續影響生活，建議尋求專業心理師或精神科醫師協助。",
  },
  {
    q: "為什麼需要我自己的 OpenAI API Key？",
    a: "心嶼採用 BYOK（自帶金鑰）模式：用你自己的 OpenAI API Key 呼叫模型，費用直接由你的 OpenAI 帳戶支付。金鑰只儲存在你的瀏覽器中，每次諮詢時隨請求轉送給 OpenAI，伺服器不會保存。",
  },
  {
    q: "我的對話內容會被保存嗎？",
    a: "目前對話只存在你的瀏覽器頁面中，重新整理或按下「重新開始」就會清除。對話內容會傳送給 OpenAI 的模型以產生回應。",
  },
  {
    q: "為什麼諮詢師會挑戰我？",
    a: "只被安慰往往很難真正改變。適度地挑戰那些讓你困住的想法，才能幫助你看見問題的根本，而不只是暫時感覺好一點。",
  },
  {
    q: "如果我正處於危機中怎麼辦？",
    a: "請立即撥打衛福部安心專線 1925（24 小時）、生命線 1995、張老師專線 1980，或在緊急危險時撥打 119 / 110。",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent-soft blur-3xl"
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-28 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col items-start gap-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1 text-xs text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                AI 心理諮詢・隨時可以開始
              </span>
              <h1 className="font-serif text-4xl leading-[1.25] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                說出卡住的地方，
                <br />
                <span className="text-accent">找到真正的原因。</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
                心嶼是一位溫暖但敢於直言的 AI
                諮詢師。它先承接你的情緒，再挑戰讓你困住的想法，陪你一步步看見問題的根本。
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/counsel"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
                >
                  立即開始諮詢
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-raised"
                >
                  了解運作方式
                </Link>
              </div>
              <p className="text-xs text-ink-muted">
                不需註冊・使用你自己的 OpenAI API Key・對話不留存於伺服器
              </p>
            </div>

            <ChatPreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeading
              eyebrow="特色"
              title="不只是安慰，而是真正往前走"
              body="結合同理、挑戰與提問，像一位真誠的諮詢師那樣陪你思考。"
            />
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="bg-paper-raised p-7 sm:p-9">
                  <Reveal delay={i * 100} className="flex flex-col gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        {f.icon}
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {f.body}
                    </p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-line bg-paper-raised"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeading eyebrow="如何運作" title="三個步驟，從混亂到清晰" />
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 120} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-5xl font-bold text-clay/80 tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {s.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Philosophy band */}
        <section className="bg-band text-band-ink">
          <Reveal className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 md:py-28">
            <span className="text-xs tracking-[0.3em] text-band-ink/60">
              我們相信
            </span>
            <blockquote className="font-serif text-2xl leading-relaxed font-medium sm:text-3xl md:text-4xl">
              「被理解，是改變的起點；
              <br className="hidden sm:block" />
              被誠實地挑戰，才是改變的開始。」
            </blockquote>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.6fr] md:py-28">
            <SectionHeading eyebrow="常見問題" title="開始之前，你可能想知道" />
            <div className="flex flex-col border-t border-line">
              {FAQS.map((item, i) => (
                <Reveal key={item.q} delay={i * 80}>
                  <details className="group border-b border-line py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span className="text-xl leading-none text-ink-muted transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 pr-8 text-sm leading-relaxed text-ink-muted">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-24 sm:px-6">
          <Reveal>
            <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 overflow-hidden rounded-3xl bg-accent px-8 py-14 text-accent-ink sm:px-14 md:flex-row md:items-center md:justify-between">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-clay/30 blur-2xl"
              />
              <div className="relative flex flex-col gap-3">
                <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                  準備好聊聊了嗎？
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-accent-ink/80 sm:text-base">
                  不用想清楚才開始。把心裡的話說出來，剩下的我們一起整理。
                </p>
              </div>
              <Link
                href="/counsel"
                className="relative shrink-0 rounded-full bg-paper px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                開始諮詢 →
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <Reveal className="flex max-w-2xl flex-col gap-4">
      <span className="text-xs font-medium tracking-[0.25em] text-clay">
        {eyebrow}
      </span>
      <h2 className="font-serif text-3xl leading-snug font-bold text-ink sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="text-base leading-relaxed text-ink-muted">{body}</p>
      )}
    </Reveal>
  );
}

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-line bg-accent-soft"
      />
      <div className="relative flex flex-col gap-4 rounded-3xl border border-line bg-paper-raised p-5 shadow-[0_30px_60px_-30px_rgba(29,38,33,0.35)] sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-ink">諮詢中</span>
          </div>
          <span className="text-xs text-ink-muted tabular-nums">
            第 2 / 3 輪
          </span>
        </div>

        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm leading-relaxed text-accent-ink">
          如果我做錯事，大家就會覺得我很沒用。
        </div>

        <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
          聽得出來，你怕的不是犯錯本身，而是被否定。
          <br />
          <br />
          <span className="font-medium text-clay">我想直接挑戰你一下：</span>
          「大家就會覺得我很沒用」是你內在的預設，不是你真的知道別人怎麼想。
        </div>

        <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-muted">
          <span className="flex-1">回應諮詢師...</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-ink">
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}
