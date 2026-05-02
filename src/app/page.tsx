"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ThemeValue = "light" | "dark";

const FEATURES = [
  "Editing Markdown should not feel like coding. Lumina keeps the syntax out of your way so you can focus on ideas.",
  "Your files stay plain and portable while the editor feels modern, clear, and consistent every time you open a document.",
  "A calm interface with thoughtful typography makes long writing and revision sessions easier on your eyes and attention.",
  "Fast startup and lightweight performance keep you in flow, even when you are jumping between multiple notes and docs.",
  "It follows your system appearance by default, with explicit light and dark control whenever you want to override it.",
  "Native installers for macOS and Windows make setup simple, so you can write first and configure less.",
];

function getTimeTheme(): ThemeValue {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? "dark" : "light";
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
  const [timeTheme, setTimeTheme] = useState<ThemeValue>(getTimeTheme);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const interval = setInterval(() => setTimeTheme(getTimeTheme()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const theme = timeTheme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-8 md:px-10 md:py-10">
      <header className="flex items-center justify-between py-3">
        <div className="inline-flex items-center gap-2.5">
          <Image src="/lumina-icon.svg" alt="Lumina icon" width={24} height={24} className="h-6 w-6 rounded-md" />
          <span className="text-lg font-semibold" style={{ color: "var(--lumina-ink)" }}>
            Lumina
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm md:flex" style={{ color: "var(--lumina-ink-soft)" }}>
          <a href="#features" className="transition-opacity hover:opacity-70">
            Features
          </a>
          <a href="https://github.com/micahman33/lumina/releases" className="transition-opacity hover:opacity-70">
            Changelog
          </a>
          <a href="https://github.com/micahman33/lumina" className="transition-opacity hover:opacity-70">
            GitHub
          </a>
          <a
            href="#download"
            className="rounded-lg px-4 py-2 font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
            style={{ background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)" }}
          >
            Download
          </a>
        </nav>
      </header>

      <section className="space-y-10 pt-4 md:space-y-12 md:pt-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-8xl" style={{ color: "var(--lumina-ink)" }}>
            Write beautifully.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #2E3EBD 0%, #3B4BD8 45%, #5B6CFF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Stay in flow.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9" style={{ color: "var(--lumina-ink-soft)" }}>
            A lightweight visual editor for Markdown and TXT files built for simplicity and performance so you can focus on the writing itself.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina-1.1.0-arm64.dmg"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)" }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M16.4 13.2c0-2 1.6-3 1.7-3.1-1-.8-2.5-1-3-1-1.3-.1-2.5.7-3.2.7-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1 8.6.7 1 1.6 2.1 2.8 2.1 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.1-2.4 1.1-2.4s-2.6-1-2.6-3.2Zm-2.2-5.4c.6-.8 1-1.8.9-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 0 2-.5 2.8-1.4Z" />
              </svg>
              Download for macOS
            </a>
            <a
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina.Setup.1.1.0.exe"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              style={{ borderColor: "var(--lumina-border)", color: "var(--lumina-ink)" }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M3 4.5 11 3v8H3v-6.5Zm9 6.5V2.9L21 1.5V11h-9Zm-9 2h8v8L3 19.6V13Zm9 0h9v9.5L12 21v-8Z" />
              </svg>
              Download for Windows
            </a>
          </div>
        </div>

        <div className="relative mt-16 pt-4 md:mt-24 md:pt-8">
          <div
            className="pointer-events-none absolute inset-x-[10%] -top-4 h-28 rounded-[999px] blur-3xl md:inset-x-[18%] md:h-36"
            style={{ background: "linear-gradient(180deg, rgba(91,108,255,0.28) 0%, rgba(91,108,255,0.08) 100%)" }}
          />
          <div className="relative">
            <LuminaMock theme={theme} />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="px-1 py-2 md:px-2"
      >
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-5xl" style={{ color: "var(--lumina-ink)" }}>
          Designed to disappear, so the{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #2E3EBD 0%, #3B4BD8 45%, #5B6CFF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            writing
          </span>{" "}
          comes forward.
        </h2>
        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <article key={feature} className="border-t pt-6" style={{ borderColor: "var(--lumina-border)" }}>
              <p className="text-xs" style={{ color: "var(--lumina-ink-faint)" }}>
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.02em]" style={{ color: "var(--lumina-ink)" }}>
                {index === 0 && "Markdown, invisibly"}
                {index === 1 && "Plain & portable"}
                {index === 2 && "Calm, by design"}
                {index === 3 && "Lightweight & fast"}
                {index === 4 && "Light & dark"}
                {index === 5 && "macOS & Windows"}
              </p>
              <p className="mt-2 text-lg leading-8" style={{ color: "var(--lumina-ink-soft)" }}>
                {feature}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="download"
        className="relative overflow-hidden rounded-3xl border px-8 py-10 md:px-12 md:py-12"
        style={{
          borderColor: "var(--lumina-border)",
          background: "linear-gradient(135deg, #11131b 0%, #14182a 45%, #1d2f73 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 55% -10%, rgba(91,108,255,0.9) 0%, rgba(91,108,255,0.12) 40%, transparent 70%)" }} />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h3 className="text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">Ready to write?</h3>
            <p className="mt-3 text-lg text-white/75">Free, open source, and built to disappear. You&apos;ll be writing in 30 seconds.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina-1.1.0-arm64.dmg"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-white/90"
            >
              macOS
            </a>
            <a
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina.Setup.1.1.0.exe"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              Windows
            </a>
          </div>
        </div>
      </section>

      <footer
        className="flex flex-col items-start justify-between gap-4 border-t py-8 text-sm md:flex-row md:items-center"
        style={{ borderColor: "var(--lumina-border)", color: "var(--lumina-ink-faint)" }}
      >
        <p>Lumina is built for distraction-free writing and modern Markdown workflows.</p>
        <p>
          © {currentYear}{" "}
          <a href="https://micahdanielsmith.com" className="underline-offset-2 transition-opacity hover:underline hover:opacity-80" style={{ color: "var(--lumina-ink-soft)" }}>
            MicahDanielSmith
          </a>
        </p>
      </footer>
    </main>
  );
}
