import Link from "next/link";
import Logo from "@/components/Logo";

const HOTLINES = [
  { name: "衛福部安心專線", number: "1925", note: "24 小時" },
  { name: "生命線", number: "1995" },
  { name: "張老師專線", number: "1980" },
  { name: "緊急求助", number: "119 / 110" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-serif text-lg font-bold tracking-wide text-ink">
              心嶼
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            給心裡一座安靜的小島。說出困擾，讓 AI 諮詢師陪你看見卡住的地方。
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="font-medium text-ink">產品</div>
          <Link href="/counsel" className="text-ink-muted hover:text-ink">
            開始諮詢
          </Link>
          <Link href="/#features" className="text-ink-muted hover:text-ink">
            特色
          </Link>
          <Link href="/#how-it-works" className="text-ink-muted hover:text-ink">
            如何運作
          </Link>
          <Link href="/#faq" className="text-ink-muted hover:text-ink">
            常見問題
          </Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="font-medium text-ink">需要立即協助？</div>
          <ul className="flex flex-col gap-2">
            {HOTLINES.map((line) => (
              <li
                key={line.name}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-line pb-2 text-ink-muted"
              >
                <span>
                  {line.name}
                  {line.note && (
                    <span className="ml-1.5 text-xs">（{line.note}）</span>
                  )}
                </span>
                <span className="font-medium tabular-nums text-ink">
                  {line.number}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 心嶼. All rights reserved.</span>
          <span>AI 諮詢師無法取代專業心理師或醫師，亦不提供醫療診斷。</span>
        </div>
      </div>
    </footer>
  );
}
