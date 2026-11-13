"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ThemeValue = "light" | "dark";

const FEATURES = [
  {
    title: "Markdown, invisibly",
    body: "Editing Markdown should not feel like coding. Lumina keeps the syntax out of your way so you can focus on ideas.",
  },
  {
    title: "Plain & portable",
    body: "Your files stay plain and portable while the editor feels modern, clear, and consistent every time you open a document.",
  },
  {
    title: "JSON & XML, made readable",
    body: "Open a config or data file and it is pretty-printed with syntax colours. Stray commas and unclosed tags are underlined right where they are.",
  },
  {
    title: "CSV as a table",
    body: "Spreadsheet exports open as a clean, editable table. Change cells, add rows, sort a column. Rows you don't touch are saved exactly as they were.",
  },
  {
    title: "Logs & everything else",
    body: "Logs, YAML, source code, files with no extension: if it is text, Lumina opens it in a tidy code view instead of turning you away.",
  },
  {
    title: "Careful with your files",
    body: "Opening a file never changes it. Encodings and line endings are preserved, and Lumina won't overwrite a file another program has changed.",
  },
  {
    title: "Calm, light & dark",
    body: "A quiet interface with thoughtful typography, following your system appearance with light and dark control whenever you want it.",
  },
  {
    title: "Fast, on macOS & Windows",
    body: "Quick to start and light on resources, with native installers for both platforms, so you can write first and configure less.",
  },
];

const FIRST_LAUNCH = [
  {
    platform: "macOS",
    steps: [
      "Open the .dmg and drag Lumina to Applications.",
      "Open Lumina. macOS blocks it the first time. Click Done.",
      "Go to System Settings → Privacy & Security, scroll to Security, and click Open Anyway next to “Lumina was blocked”.",
      "Confirm with your password or Touch ID. Lumina opens normally from then on.",
    ],
    note: "On macOS 14 or earlier you can right-click Lumina and choose Open instead.",
    command: "xattr -dr com.apple.quarantine /Applications/Lumina.app",
    commandLabel: "If macOS says Lumina is “damaged”, run this once in Terminal:",
  },
  {
    platform: "Windows",
    steps: [
      "Run the installer.",
      "If SmartScreen shows “Windows protected your PC”, click More info.",
      "Click Run anyway. Lumina is added to your Start Menu and Desktop.",
    ],
    note: null,
    command: null,
    commandLabel: null,
  },
];

function getTimeTheme(): ThemeValue {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? "dark" : "light";
}

function LuminaEmbed() {
  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--lumina-border)" }}
    >
      <iframe
        src="/editor/web-index.html"
        title="Lumina editor demo"
        className="block w-full border-none"
        style={{ height: 560 }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}

interface LandingPageProps {
  macUrl: string;
  winUrl: string;
}

export function LandingPage({ macUrl, winUrl }: LandingPageProps) {
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
          <Image
            src="/lumina-icon.svg"
            alt="Lumina icon"
            width={24}
            height={24}
            className="h-6 w-6 rounded-md"
          />
          <span
            className="text-lg font-semibold"
            style={{ color: "var(--lumina-ink)" }}
          >
            Lumina
          </span>
        </div>
        <nav
          className="hidden items-center gap-8 text-sm md:flex"
          style={{ color: "var(--lumina-ink-soft)" }}
        >
          <a href="#features" className="transition-opacity hover:opacity-70">
            Features
          </a>
          <a
            href="https://github.com/micahman33/lumina/releases"
            className="transition-opacity hover:opacity-70"
          >
            Changelog
          </a>
          <a
            href="https://github.com/micahman33/lumina"
            className="transition-opacity hover:opacity-70"
          >
            GitHub
          </a>
          <a
            href="#download"
            className="rounded-lg px-4 py-2 font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)",
            }}
          >
            Download
          </a>
        </nav>
      </header>

      <section className="space-y-10 pt-4 md:space-y-12 md:pt-8">
        <div className="text-center">
          <h1
            className="text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-8xl"
            style={{ color: "var(--lumina-ink)" }}
          >
            Write beautifully.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #2E3EBD 0%, #3B4BD8 45%, #5B6CFF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Stay in flow.
            </span>
          </h1>
          <p
            className="mx-auto mt-8 max-w-3xl text-xl leading-9"
            style={{ color: "var(--lumina-ink-soft)" }}
          >
            A lightweight visual editor for Markdown and text, built for
            simplicity and performance. It opens your JSON, XML, CSV and log
            files beautifully too.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={macUrl}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(180deg, #5B6CFF 0%, #3B4BD8 100%)",
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M16.4 13.2c0-2 1.6-3 1.7-3.1-1-.8-2.5-1-3-1-1.3-.1-2.5.7-3.2.7-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1 8.6.7 1 1.6 2.1 2.8 2.1 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.1-2.4 1.1-2.4s-2.6-1-2.6-3.2Zm-2.2-5.4c.6-.8 1-1.8.9-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 0 2-.5 2.8-1.4Z" />
              </svg>
              Download for macOS
            </a>
            <a
              href={winUrl}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              style={{
                borderColor: "var(--lumina-border)",
                color: "var(--lumina-ink)",
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M3 4.5 11 3v8H3v-6.5Zm9 6.5V2.9L21 1.5V11h-9Zm-9 2h8v8L3 19.6V13Zm9 0h9v9.5L12 21v-8Z" />
              </svg>
              Download for Windows
            </a>
          </div>
          <p
            className="mt-5 text-sm"
            style={{ color: "var(--lumina-ink-faint)" }}
          >
            Free and open source. Lumina isn&apos;t code-signed yet, so the
            first launch takes{" "}
            <a
              href="#first-launch"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "var(--lumina-ink-soft)" }}
            >
              one extra step
            </a>
            .
          </p>
        </div>

        <div className="relative mt-16 pt-4 md:mt-24 md:pt-8">
          <div
            className="pointer-events-none absolute inset-x-[10%] -top-4 h-28 rounded-[999px] blur-3xl md:inset-x-[18%] md:h-36"
            style={{
              background:
                "linear-gradient(180deg, rgba(91,108,255,0.28) 0%, rgba(91,108,255,0.08) 100%)",
            }}
          />
          <div className="relative hidden md:block">
            <LuminaEmbed />
          </div>
          {/* Mobile fallback */}
          <div
            className="relative block md:hidden w-full overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--lumina-border)", height: 320 }}
          >
            <div
              className="flex h-full items-center justify-center text-sm"
              style={{ color: "var(--lumina-ink-faint)" }}
            >
              Download Lumina to experience the editor.
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-1 py-2 md:px-2">
        <h2
          className="mx-auto max-w-3xl text-center text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-5xl"
          style={{ color: "var(--lumina-ink)" }}
        >
          Designed to disappear, so the{" "}
          <span
            style={{
              background:
                "linear-gradient(90deg, #2E3EBD 0%, #3B4BD8 45%, #5B6CFF 100%)",
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
            <article
              key={feature.title}
              className="border-t pt-6"
              style={{ borderColor: "var(--lumina-border)" }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--lumina-ink-faint)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <p
                className="mt-2 text-2xl font-semibold tracking-[-0.02em]"
                style={{ color: "var(--lumina-ink)" }}
              >
                {feature.title}
              </p>
              <p
                className="mt-2 text-lg leading-8"
                style={{ color: "var(--lumina-ink-soft)" }}
              >
                {feature.body}
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
          background:
            "linear-gradient(135deg, #11131b 0%, #14182a 45%, #1d2f73 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 55% -10%, rgba(91,108,255,0.9) 0%, rgba(91,108,255,0.12) 40%, transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h3 className="text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">
              Ready to write?
            </h3>
            <p className="mt-3 text-lg text-white/75">
              Free, open source, and built to disappear. You&apos;ll be writing
              in 30 seconds.
            </p>
            <a
              href="#first-launch"
              className="mt-3 inline-block text-sm text-white/60 underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              First launch on macOS or Windows: what to expect
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={macUrl}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-white/90"
            >
              macOS
            </a>
            <a
              href={winUrl}
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              Windows
            </a>
          </div>
        </div>
      </section>

      <section id="first-launch" className="scroll-mt-8 px-1 md:px-2">
        <h2
          className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
          style={{ color: "var(--lumina-ink)" }}
        >
          Opening Lumina for the first time
        </h2>
        <p
          className="mt-3 max-w-3xl text-lg leading-8"
          style={{ color: "var(--lumina-ink-soft)" }}
        >
          Lumina is free and open source, and isn&apos;t signed with a paid
          Apple or Microsoft certificate yet. Your computer will warn you the
          first time you open it. That is expected, and you only do this once.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {FIRST_LAUNCH.map((item) => (
            <article
              key={item.platform}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--lumina-border)",
                background: "var(--lumina-chrome)",
              }}
            >
              <h3
                className="text-xl font-semibold tracking-[-0.02em]"
                style={{ color: "var(--lumina-ink)" }}
              >
                {item.platform}
              </h3>
              <ol
                className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7"
                style={{ color: "var(--lumina-ink-soft)" }}
              >
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {item.note && (
                <p
                  className="mt-4 text-sm leading-6"
                  style={{ color: "var(--lumina-ink-faint)" }}
                >
                  {item.note}
                </p>
              )}
              {item.command && (
                <>
                  <p
                    className="mt-4 text-sm leading-6"
                    style={{ color: "var(--lumina-ink-soft)" }}
                  >
                    {item.commandLabel}
                  </p>
                  <pre
                    className="mt-2 overflow-x-auto rounded-lg border px-3 py-2 text-xs"
                    style={{
                      borderColor: "var(--lumina-border)",
                      background: "var(--lumina-bg)",
                      color: "var(--lumina-ink)",
                    }}
                  >
                    <code>{item.command}</code>
                  </pre>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer
        className="flex flex-col items-start justify-between gap-4 border-t py-8 text-sm md:flex-row md:items-center"
        style={{
          borderColor: "var(--lumina-border)",
          color: "var(--lumina-ink-faint)",
        }}
      >
        <p>
          Lumina is built for distraction-free writing, and for every plain
          text file you open along the way.
        </p>
        <p>
          © {currentYear}{" "}
          <a
            href="https://micahdanielsmith.com"
            className="underline-offset-2 transition-opacity hover:underline hover:opacity-80"
            style={{ color: "var(--lumina-ink-soft)" }}
          >
            MicahDanielSmith
          </a>
        </p>
      </footer>
    </main>
  );
}
