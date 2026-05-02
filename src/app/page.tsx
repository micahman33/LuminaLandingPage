"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ThemeMode = "auto" | "light" | "dark";
type ThemeValue = "light" | "dark";

const FEATURES = [
  "Editing Markdown should not feel like coding. Lumina keeps the syntax out of your way so you can focus on ideas.",
  "Your files stay plain and portable while the editor feels modern, clear, and consistent every time you open a document.",
  "A calm interface with thoughtful typography makes long writing and revision sessions easier on your eyes and attention.",
  "Fast startup and lightweight performance keep you in flow, even when you are jumping between multiple notes and docs.",
  "It follows your system appearance by default, with explicit light and dark control whenever you want to override it.",
  "Native installers for macOS and Windows make setup simple, so you can write first and configure less.",
];

const MODE_ORDER: ThemeMode[] = ["auto", "light", "dark"];

function getTimeTheme(): ThemeValue {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? "dark" : "light";
}

function cycleThemeMode(mode: ThemeMode): ThemeMode {
  const index = MODE_ORDER.indexOf(mode);
  return MODE_ORDER[(index + 1) % MODE_ORDER.length];
}

function ToolbarIcon({ path, active = false }: { path: string; active?: boolean }) {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      style={{
        color: active ? "var(--lumina-indigo-soft)" : "var(--lumina-ink-soft)",
        background: active ? "var(--lumina-active-tint)" : "transparent",
      }}
      aria-label="Toolbar action"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[15px] w-[15px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </button>
  );
}

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return (
      <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.4 6.4-1.4-1.4M7 7 5.6 5.6m12.8 0L17 7M7 17l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
    );
  }
  if (mode === "dark") {
    return <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />;
  }
  return <path d="M20 16V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8m16 0H4m16 0v2H4v-2" />;
}

function LuminaMock({ theme }: { theme: ThemeValue }) {
  const isDark = theme === "dark";

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--lumina-border)",
        background: "var(--lumina-bg)",
      }}
    >
      <div
        className="flex h-9 items-center border-b px-4 text-xs"
        style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-titlebar)" }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex items-center gap-2">
          <Image src="/lumina-icon.svg" alt="Lumina icon" className="h-4 w-4 rounded-[3px]" width={16} height={16} />
          <span className="font-medium" style={{ color: "var(--lumina-ink)" }}>
            README.md
          </span>
          <span style={{ color: "var(--lumina-ink-faint)" }}>· Lumina</span>
        </div>
        <div className="w-12" />
      </div>

      <div className="flex min-h-[520px]">
        <aside
          className="hidden w-52 flex-col border-r p-3 md:flex"
          style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-sidebar)" }}
        >
          <div
            className="mb-3 rounded-lg px-3 py-2 text-xs"
            style={{
              color: "var(--lumina-ink-faint)",
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            }}
          >
            Search files
          </div>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-[0.12em]" style={{ color: "var(--lumina-ink-faint)" }}>
            RECENT
          </p>
          <div className="space-y-1">
            {[
              "README.md",
              "ai-product-brief.md",
              "design-review-notes.md",
              "todo-weekly-sprint.md",
              "assignment-outline.md",
              "prompt-library.txt",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-lg px-3 py-2 text-xs"
                style={{
                  color: "var(--lumina-ink)",
                  background: index === 0 ? "var(--lumina-active-tint)" : "transparent",
                  fontWeight: index === 0 ? 600 : 500,
                }}
              >
                {item}
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--lumina-ink-faint)" }}>
                  {index === 0
                    ? "Edited just now"
                    : index === 1
                      ? "14 minutes ago"
                      : index === 2
                        ? "2 hours ago"
                        : index === 3
                          ? "Yesterday"
                          : index === 4
                            ? "3 days ago"
                            : "Last week"}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          <div className="flex h-11 items-center border-b px-3 text-xs" style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-chrome)" }}>
            <div className="flex items-center gap-1">
              <ToolbarIcon path="M3 7v6h6M3 13a9 9 0 0 1 16-4" />
              <ToolbarIcon path="M21 7v6h-6M21 13a9 9 0 0 0-16-4" />
              <ToolbarIcon path="M4 5v14M14 5v14M4 12h10M17 9c0-1 1-2 2.5-2s2.5 1 2.5 2-1 2-2.5 3-2.5 2-2.5 3h5" />
              <ToolbarIcon path="M7 5h6a3.5 3.5 0 0 1 0 7H7zm0 7h7a3.5 3.5 0 0 1 0 7H7z" active />
              <ToolbarIcon path="M14 5h-4M14 19h-4M15 5l-6 14" />
              <div className="hidden items-center gap-1 sm:flex">
                <ToolbarIcon path="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
                <ToolbarIcon path="M3 6h18v12H3zM7 9l-3 3 3 3M17 9l3 3-3 3M14 8l-4 8" />
              </div>
              <div className="hidden items-center gap-1 md:flex">
                <ToolbarIcon path="M10 14a4 4 0 0 1 0-5.66l2-2a4 4 0 0 1 5.66 5.66l-1 1M14 10a4 4 0 0 1 0 5.66l-2 2a4 4 0 0 1-5.66-5.66l1-1" />
                <ToolbarIcon path="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M16 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </div>
            </div>
            <span className="ml-auto truncate pl-3 font-mono text-[11px]" style={{ color: "var(--lumina-ink-faint)" }}>
              46 words · 1 min
            </span>
          </div>

          <div className="flex-1 overflow-hidden px-6 pt-10 md:px-14">
            <div className="mx-auto max-w-2xl">
              <h3 className="text-[34px] font-bold tracking-[-0.8px]" style={{ color: "var(--lumina-ink)" }}>
                Welcome to Lumina
              </h3>
              <p className="mt-2 text-[15px]" style={{ color: "var(--lumina-ink-soft)" }}>
                A lightweight, elegant editor for the documents you actually want to read.
              </p>
              <p className="mt-8 text-base leading-7" style={{ color: "var(--lumina-ink)" }}>
                Open any{" "}
                <code
                  className="rounded px-1 py-0.5 text-[13px]"
                  style={{ background: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)" }}
                >
                  .md
                </code>{" "}
                file and it just works.
                <span
                  className="ml-0.5 inline-block h-[18px] w-[2px] align-[-3px]"
                  style={{ background: "var(--lumina-indigo-soft)", animation: "lumina-caret 1s steps(2) infinite" }}
                />
              </p>
              <blockquote
                className="mt-6 border-l-2 pl-4 text-[15px] italic"
                style={{ borderColor: "var(--lumina-indigo-soft)", color: "var(--lumina-ink-soft)" }}
              >
                The best tool is the one you forget you&apos;re using.
              </blockquote>
            </div>
          </div>

          <div
            className="flex h-7 items-center gap-4 border-t px-4 font-mono text-[11px]"
            style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-chrome)", color: "var(--lumina-ink-faint)" }}
          >
            <span>Markdown</span>
            <span>UTF-8</span>
            <span>Ln 14, Col 8</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Saved
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [timeTheme, setTimeTheme] = useState<ThemeValue>(getTimeTheme);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const interval = setInterval(() => setTimeTheme(getTimeTheme()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const theme = useMemo<ThemeValue>(() => (mode === "auto" ? timeTheme : mode), [mode, timeTheme]);
  const nextTheme = useMemo(() => cycleThemeMode(mode), [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-14 md:px-10 md:py-16">
      <section className="space-y-16 md:space-y-20">
        <div className="relative overflow-hidden rounded-[2rem] border px-6 pb-10 pt-6 md:px-10 md:pb-14 md:pt-8" style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-chrome)" }}>
          <div
            className="pointer-events-none absolute -right-10 -top-10 hidden h-[300px] w-[360px] overflow-hidden rounded-bl-[7rem] rounded-tr-[2rem] md:block"
            style={{ background: "linear-gradient(160deg, #5B6CFF 0%, #3B4BD8 100%)" }}
          >
            <Image
              src="/lumina-icon.svg"
              alt="Lumina visual accent"
              width={220}
              height={220}
              className="absolute -bottom-8 right-8 h-56 w-56 rotate-[10deg] opacity-90"
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="pt-10 md:pt-20">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: "var(--lumina-border)" }}>
              <Image src="/lumina-icon.svg" alt="Lumina icon" className="h-5 w-5 rounded-sm" width={20} height={20} />
              <span style={{ color: "var(--lumina-ink-soft)" }}>Lumina for macOS + Windows</span>
            </div>

            <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.02em] md:text-7xl" style={{ color: "var(--lumina-ink)" }}>
              Write beautifully.
              <br />
              Stay in flow.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9" style={{ color: "var(--lumina-ink-soft)" }}>
              Lumina is a lightweight WYSIWYG editor for Markdown and TXT files focused on simplicity,
              performance, and ease of use.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href="#download"
                className="rounded-lg px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)" }}
              >
                Download now
              </a>
              <a
                href="https://github.com/micahman33/lumina/releases"
                className="rounded-lg border px-5 py-3 text-sm"
                style={{ borderColor: "var(--lumina-border)", color: "var(--lumina-ink-soft)" }}
              >
                View all releases
              </a>
            </div>
            </div>

            <button
              onClick={() => setMode(nextTheme)}
              title={`Theme: ${mode}. Click to switch to ${nextTheme}.`}
              className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: "var(--lumina-border)", color: "var(--lumina-ink-soft)", background: "var(--lumina-chrome)" }}
              aria-label="Toggle theme mode"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <ThemeIcon mode={mode} />
              </svg>
            </button>
          </div>
        </div>

        <div className="pt-4 md:pt-8">
          <LuminaMock theme={theme} />
        </div>
      </section>

      <section className="rounded-2xl border p-8 md:p-10" style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-chrome)" }}>
        <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: "var(--lumina-ink)" }}>
          Why people choose Lumina
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="rounded-md border p-5"
              style={{
                borderColor: "var(--lumina-border)",
                background: "var(--lumina-bg)",
              }}
            >
              <p className="text-[15px] leading-7" style={{ color: "var(--lumina-ink-soft)" }}>
                {feature}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="download"
        className="rounded-2xl border p-8 md:p-10"
        style={{ borderColor: "var(--lumina-border)", background: "var(--lumina-chrome)" }}
      >
        <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: "var(--lumina-ink)" }}>
          Choose your download
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--lumina-ink-faint)" }}>
          Latest stable release binaries are hosted on GitHub Releases.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina-1.1.0-arm64.dmg"
            className="flex items-center justify-between rounded-xl px-5 py-4 text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)" }}
          >
            <span className="flex items-center gap-3 font-semibold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M16.4 13.2c0-2 1.6-3 1.7-3.1-1-.8-2.5-1-3-1-1.3-.1-2.5.7-3.2.7-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1 8.6.7 1 1.6 2.1 2.8 2.1 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.1-2.4 1.1-2.4s-2.6-1-2.6-3.2Zm-2.2-5.4c.6-.8 1-1.8.9-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 0 2-.5 2.8-1.4Z" />
              </svg>
              macOS (Apple Silicon)
            </span>
            <span className="text-sm" style={{ color: "var(--lumina-ink-faint)" }}>
              .dmg
            </span>
          </a>
          <a
            href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina.Setup.1.1.0.exe"
            className="flex items-center justify-between rounded-xl px-5 py-4 text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)" }}
          >
            <span className="flex items-center gap-3 font-semibold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M3 4.5 11 3v8H3v-6.5Zm9 6.5V2.9L21 1.5V11h-9Zm-9 2h8v8L3 19.6V13Zm9 0h9v9.5L12 21v-8Z" />
              </svg>
              Windows (x64)
            </span>
            <span className="text-sm" style={{ color: "var(--lumina-ink-faint)" }}>
              .exe
            </span>
          </a>
        </div>
      </section>

      <footer className="space-y-2 border-t pt-6 text-sm" style={{ borderColor: "var(--lumina-border)", color: "var(--lumina-ink-faint)" }}>
        <p>Lumina is built for distraction-free writing and modern Markdown workflows.</p>
        <p>
          © {currentYear}{" "}
          <a href="https://micahdanielsmith.com" className="underline-offset-2 hover:underline" style={{ color: "var(--lumina-ink-soft)" }}>
            MicahDanielSmith
          </a>
          . All rights reserved.
        </p>
      </footer>
    </main>
  );
}
