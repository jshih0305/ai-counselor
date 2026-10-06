"use client";

import { setTheme, useTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "light",
    label: "淺色模式",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2 M12 19.5v2 M4.6 4.6 6 6 M18 18l1.4 1.4 M2.5 12h2 M19.5 12h2 M4.6 19.4 6 18 M18 6l1.4-1.4" />
      </>
    ),
  },
  {
    value: "system",
    label: "跟隨系統",
    icon: <path d="M3.5 5.5h17v11h-17z M9 20.5h6 M12 16.5v4" />,
  },
  {
    value: "dark",
    label: "深色模式",
    icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  },
];

export default function ThemeToggle() {
  const theme = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="顏色主題"
      className="flex items-center rounded-full border border-line p-0.5"
    >
      {OPTIONS.map((option) => {
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              isActive
                ? "bg-accent-soft text-accent"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
