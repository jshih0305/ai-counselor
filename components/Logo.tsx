export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="9" className="fill-accent" />
      <path
        d="M9 21.5c0-5.8 4.2-10.5 9.5-10.5"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="stroke-accent-ink"
      />
      <circle cx="21.5" cy="20" r="2.6" className="fill-clay" />
    </svg>
  );
}
