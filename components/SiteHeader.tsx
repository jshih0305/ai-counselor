import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/#features", label: "特色" },
  { href: "/#how-it-works", label: "如何運作" },
  { href: "/#faq", label: "常見問題" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-serif text-lg font-bold tracking-wide text-ink">
            心嶼
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/counsel"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          開始諮詢
        </Link>
      </div>
    </header>
  );
}
