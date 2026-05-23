"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// ── Editor types ────────────────────────────────────────────────────────────

type EditorFile = {
  id: string;
  name: string;
  content: string;
  /** null on initial render to avoid SSR/client hydration mismatch */
  lastEdited: number | null;
  staticLabel: string;
};

const INITIAL_FILES: EditorFile[] = [
  {
    id: "readme",
    name: "README.md",
    content:
      "# Welcome to Lumina\n\nA lightweight, elegant editor for the documents you actually want to read.\n\nOpen any `.md` file and it just works.\n\n> The best tool is the one you forget you’re using.",
    lastEdited: null,
    staticLabel: "Edited just now",
  },
  {
    id: "ai-brief",
    name: "ai-product-brief.md",
    content:
      "# AI Product Brief\n\n## Overview\n\nThis document outlines the product direction for Lumina’s upcoming AI writing features.\n\n## Goals\n\n- Reduce friction in everyday writing workflows\n- Keep the interface distraction-free by default\n- Native Markdown support throughout\n\n## Non-goals\n\nThis is not a replacement for a full IDE. The focus is clear writing, not code.",
    lastEdited: null,
    staticLabel: "14 minutes ago",
  },
  {
    id: "design-notes",
    name: "design-review-notes.md",
    content:
      "# Design Review Notes\n\n## Typography\n\nInter Tight is working well for headings. Consider increasing line-height on body text for longer reading sessions.\n\n## Color system\n\nThe indigo accent at **#5B6CFF** is strong and distinctive. Dark mode contrast passes WCAG AA.\n\n## Feedback\n\n> The sidebar feels too heavy. Can we reduce the visual weight of file list items?",
    lastEdited: null,
    staticLabel: "2 hours ago",
  },
  {
    id: "sprint",
    name: "todo-weekly-sprint.md",
    content:
      "# Weekly Sprint\n\n## To Do\n\n- [ ] Finish onboarding flow\n- [ ] Review accessibility audit\n- [ ] Update changelog\n\n## In Progress\n\n- [ ] Landing page interactive demo\n\n## Done\n\n- [x] Dark mode polish\n- [x] Windows installer signing",
    lastEdited: null,
    staticLabel: "Yesterday",
  },
  {
    id: "outline",
    name: "assignment-outline.md",
    content:
      "# Assignment Outline\n\n## Introduction\n\nBrief overview of the topic and main argument.\n\n## Section 1: Background\n\nContext and historical perspective.\n\n## Section 2: Analysis\n\nCore argument with supporting evidence.\n\n## Conclusion\n\nSummary and next steps.",
    lastEdited: null,
    staticLabel: "3 days ago",
  },
  {
    id: "prompts",
    name: "prompt-library.txt",
    content:
      "Summarize the following in three bullet points:\n\nRewrite this in a more formal tone:\n\nGenerate five headline variations for:\n\nExplain this concept as if I’m a beginner:\n\nList pros and cons of:",
    lastEdited: null,
    staticLabel: "Last week",
  },
];

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 2) return "Edited just now";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return "Last week";
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ── Markdown renderer ────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      '<span style="color:var(--lumina-indigo-soft);text-decoration:underline">$1</span>',
    );
}

function renderMarkdown(md: string): string {
  if (!md.trim()) return "";
  const lines = md.split("\n");
  const parts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("# ")) {
      parts.push(`<h1>${renderInline(line.slice(2))}</h1>`);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      i++; continue;
    }
    if (line.startsWith("### ")) {
      parts.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      i++; continue;
    }
    if (/^---+$/.test(line.trim())) {
      parts.push("<hr>");
      i++; continue;
    }
    if (line.startsWith("> ")) {
      parts.push(`<blockquote>${renderInline(line.slice(2))}</blockquote>`);
      i++; continue;
    }
    // Task list (before regular list)
    if (/^- \[[ x]\] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- \[[ x]\] /.test(lines[i])) {
        const checked = lines[i][3] === "x";
        items.push(
          `<li class="task-item"><span class="task-check">${checked ? "☑" : "☐"}</span> ${renderInline(lines[i].slice(6))}</li>`,
        );
        i++;
      }
      parts.push(`<ul class="task-list">${items.join("")}</ul>`);
      continue;
    }
    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i]) && !/^- \[[ x]\]/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].slice(2))}</li>`);
        i++;
      }
      parts.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+\. /, ""))}</li>`);
        i++;
      }
      parts.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    parts.push(`<p>${renderInline(line)}</p>`);
    i++;
  }
  return parts.join("\n");
}

// ── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarIcon({
  path,
  active = false,
  onClick,
  title,
}: {
  path: string;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      style={{
        color: active ? "var(--lumina-indigo-soft)" : "var(--lumina-ink-soft)",
        background: active ? "var(--lumina-active-tint)" : "transparent",
      }}
      onMouseDown={(e) => {
        e.preventDefault(); // keep textarea focus
        onClick?.();
      }}
      aria-label={title ?? "Toolbar action"}
      title={title}
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

// ── Interactive editor mock ──────────────────────────────────────────────────

function LuminaMock({ theme }: { theme: ThemeValue }) {
  const isDark = theme === "dark";
  const [files, setFiles] = useState<EditorFile[]>(INITIAL_FILES);
  const [activeId, setActiveId] = useState("readme");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find((f) => f.id === activeId) ?? files[0];

  const updateContent = useCallback(
    (content: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeId ? { ...f, content, lastEdited: Date.now() } : f,
        ),
      );
    },
    [activeId],
  );

  const enterEditMode = useCallback(() => {
    setEditMode(true);
    setCursorPos({ line: 1, col: 1 });
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const switchFile = useCallback((id: string) => {
    setActiveId(id);
    setRenamingId(null);
    setEditMode(false);
    setCursorPos({ line: 1, col: 1 });
  }, []);

  const addFile = useCallback(() => {
    const id = `new-${Date.now()}`;
    const newFile: EditorFile = {
      id,
      name: "Untitled.md",
      content: "",
      lastEdited: Date.now(),
      staticLabel: "Edited just now",
    };
    setFiles((prev) => [newFile, ...prev]);
    setActiveId(id);
    setRenamingId(id);
    setRenameValue("Untitled.md");
  }, []);

  const startRename = useCallback((file: EditorFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(file.id);
    setRenameValue(file.name);
  }, []);

  const commitRename = useCallback(() => {
    if (!renamingId) return;
    const trimmed = renameValue.trim();
    if (trimmed) {
      setFiles((prev) =>
        prev.map((f) => (f.id === renamingId ? { ...f, name: trimmed } : f)),
      );
    }
    setRenamingId(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [renamingId, renameValue]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 0);
    }
  }, [renamingId]);

  const updateCursor = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value.slice(0, ta.selectionStart);
    const lines = text.split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  }, []);

  // Wrap selection in inline markers (bold, italic, code)
  const applyInline = useCallback(
    (prefix: string, suffix?: string) => {
      if (!editMode) { enterEditMode(); return; }
      const ta = textareaRef.current;
      if (!ta) return;
      const suf = suffix ?? prefix;
      const { selectionStart: s, selectionEnd: e, value } = ta;
      const selected = value.slice(s, e);
      const next =
        value.slice(0, s) + prefix + selected + suf + value.slice(e);
      updateContent(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(s + prefix.length, e + prefix.length);
      });
    },
    [editMode, enterEditMode, updateContent],
  );

  // Prepend a prefix to the current line (heading, list item, blockquote)
  const applyLinePrefix = useCallback(
    (prefix: string) => {
      if (!editMode) { enterEditMode(); return; }
      const ta = textareaRef.current;
      if (!ta) return;
      const { selectionStart: s, value } = ta;
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const next =
        value.slice(0, lineStart) + prefix + value.slice(lineStart);
      updateContent(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(s + prefix.length, s + prefix.length);
      });
    },
    [editMode, enterEditMode, updateContent],
  );

  // Link: wraps selection as [text](url) or inserts template
  const applyLink = useCallback(() => {
    if (!editMode) { enterEditMode(); return; }
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const selected = value.slice(s, e);
    if (selected) {
      const insert = `[${selected}](https://)`;
      const next = value.slice(0, s) + insert + value.slice(e);
      updateContent(next);
      requestAnimationFrame(() => {
        ta.focus();
        // select the url placeholder
        ta.setSelectionRange(s + selected.length + 3, s + insert.length - 1);
      });
    } else {
      const insert = "[link text](https://)";
      const next = value.slice(0, s) + insert + value.slice(s);
      updateContent(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(s + 1, s + 10);
      });
    }
  }, [editMode, enterEditMode, updateContent]);

  const words = wordCount(activeFile.content);
  const readingMins = Math.max(1, Math.ceil(words / 250));
  const wordStr = words === 1 ? "1 word" : `${words} words`;

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--lumina-border)",
        background: "var(--lumina-bg)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex h-9 items-center border-b px-4 text-xs"
        style={{
          borderColor: "var(--lumina-border)",
          background: "var(--lumina-titlebar)",
        }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex items-center gap-2">
          <Image
            src="/lumina-icon.svg"
            alt="Lumina icon"
            className="h-4 w-4 rounded-[3px]"
            width={16}
            height={16}
          />
          <span className="font-medium" style={{ color: "var(--lumina-ink)" }}>
            {activeFile.name}
          </span>
          <span style={{ color: "var(--lumina-ink-faint)" }}>· Lumina</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Body: sidebar + editor */}
      <div className="flex" style={{ minHeight: 520 }}>
        {/* Sidebar — hidden on mobile */}
        <aside
          className="hidden w-52 shrink-0 flex-col border-r md:flex"
          style={{
            borderColor: "var(--lumina-border)",
            background: "var(--lumina-sidebar)",
          }}
        >
          <div className="flex flex-col gap-0 p-3 pb-0">
            {/* Search box (decorative) */}
            <div
              className="mb-3 rounded-lg px-3 py-2 text-xs"
              style={{
                color: "var(--lumina-ink-faint)",
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
              }}
            >
              Search files
            </div>

            {/* Recent header + new-file button */}
            <div className="mb-2 flex items-center justify-between px-1">
              <p
                className="text-[10px] font-semibold tracking-[0.12em]"
                style={{ color: "var(--lumina-ink-faint)" }}
              >
                RECENT
              </p>
              <button
                onClick={addFile}
                title="New file"
                className="transition-opacity hover:opacity-70"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  color: "var(--lumina-ink-faint)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 11v6M9 14h6" />
                </svg>
              </button>
            </div>
          </div>

          {/* File list */}
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 pb-3">
            {files.map((file) => {
              const active = file.id === activeId;
              const isRenaming = file.id === renamingId;
              const label =
                file.lastEdited !== null
                  ? relativeTime(file.lastEdited)
                  : file.staticLabel;
              return (
                <div
                  key={file.id}
                  className="relative rounded-lg px-3 py-2 text-xs"
                  style={{
                    color: "var(--lumina-ink)",
                    background: active
                      ? "var(--lumina-active-tint)"
                      : "transparent",
                    fontWeight: active ? 600 : 500,
                    cursor: isRenaming ? "default" : "pointer",
                  }}
                  onClick={() => !isRenaming && switchFile(file.id)}
                  onDoubleClick={(e) => startRename(file, e)}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  {active && !isRenaming && (
                    <div
                      style={{
                        position: "absolute",
                        left: 4,
                        top: 10,
                        bottom: 10,
                        width: 3,
                        borderRadius: 2,
                        background: "var(--lumina-indigo-soft)",
                      }}
                    />
                  )}
                  {isRenaming ? (
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitRename();
                        }
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onBlur={commitRename}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: "100%",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--lumina-ink)",
                        background: "var(--lumina-chrome)",
                        border: "1px solid var(--lumina-indigo-soft)",
                        borderRadius: 4,
                        padding: "1px 5px",
                        outline: "none",
                        caretColor: "var(--lumina-indigo-soft)",
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </div>
                      <p
                        className="mt-0.5 text-[11px]"
                        style={{ color: "var(--lumina-ink-faint)" }}
                      >
                        {label}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Editor section */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Toolbar */}
          <div
            className="flex h-11 shrink-0 items-center border-b px-3"
            style={{
              borderColor: "var(--lumina-border)",
              background: "var(--lumina-chrome)",
            }}
          >
            <div className="flex items-center gap-1">
              <ToolbarIcon
                path="M3 7v6h6M3 13a9 9 0 0 1 16-4"
                title="Undo"
              />
              <ToolbarIcon
                path="M21 7v6h-6M21 13a9 9 0 0 0-16-4"
                title="Redo"
              />
              <ToolbarIcon
                path="M4 5v14M14 5v14M4 12h10M17 9c0-1 1-2 2.5-2s2.5 1 2.5 2-1 2-2.5 3-2.5 2-2.5 3h5"
                title="Heading"
                onClick={() => applyLinePrefix("## ")}
              />
              <ToolbarIcon
                path="M7 5h6a3.5 3.5 0 0 1 0 7H7zm0 7h7a3.5 3.5 0 0 1 0 7H7z"
                title="Bold"
                onClick={() => applyInline("**")}
              />
              <ToolbarIcon
                path="M14 5h-4M14 19h-4M15 5l-6 14"
                title="Italic"
                onClick={() => applyInline("*")}
              />
              <div className="hidden items-center gap-1 sm:flex">
                <ToolbarIcon
                  path="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"
                  title="Bullet list"
                  onClick={() => applyLinePrefix("- ")}
                />
                <ToolbarIcon
                  path="M3 6h18v12H3zM7 9l-3 3 3 3M17 9l3 3-3 3M14 8l-4 8"
                  title="Inline code"
                  onClick={() => applyInline("`")}
                />
              </div>
              <div className="hidden items-center gap-1 md:flex">
                <ToolbarIcon
                  path="M10 14a4 4 0 0 1 0-5.66l2-2a4 4 0 0 1 5.66 5.66l-1 1M14 10a4 4 0 0 1 0 5.66l-2 2a4 4 0 0 1-5.66-5.66l1-1"
                  title="Link"
                  onClick={applyLink}
                />
                <ToolbarIcon
                  path="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M16 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                  title="Blockquote"
                  onClick={() => applyLinePrefix("> ")}
                />
              </div>
            </div>
            <span
              className="ml-auto truncate pl-3 font-mono text-[11px]"
              style={{ color: "var(--lumina-ink-faint)" }}
            >
              {wordStr} · {readingMins} min
            </span>
          </div>

          {/* Editor content area */}
          <div className="relative flex-1 overflow-hidden">
            {/* Preview mode — rendered markdown, click to edit */}
            {!editMode && (
              <div
                className="lumina-preview absolute inset-0 overflow-y-auto"
                style={{ padding: "40px 56px", cursor: "text" }}
                onClick={enterEditMode}
                dangerouslySetInnerHTML={{
                  __html:
                    renderMarkdown(activeFile.content) ||
                    `<p style="color:var(--lumina-ink-faint)">Start writing…</p>`,
                }}
              />
            )}

            {/* Edit mode — raw markdown textarea */}
            {editMode && (
              <textarea
                ref={textareaRef}
                value={activeFile.content}
                onChange={(e) => updateContent(e.target.value)}
                onSelect={updateCursor}
                onKeyUp={updateCursor}
                onClick={updateCursor}
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditMode(false);
                }}
                spellCheck={false}
                placeholder="Start writing…"
                className="absolute inset-0 h-full w-full resize-none border-none outline-none"
                style={{
                  background: "var(--lumina-bg)",
                  color: "var(--lumina-ink)",
                  padding: "40px 56px",
                  fontSize: 15,
                  lineHeight: 1.75,
                  fontFamily:
                    "var(--font-inter-tight), -apple-system, BlinkMacSystemFont, sans-serif",
                  caretColor: "var(--lumina-indigo-soft)",
                }}
              />
            )}
          </div>

          {/* Status bar */}
          <div
            className="flex h-7 shrink-0 items-center gap-4 border-t px-4 font-mono text-[11px]"
            style={{
              borderColor: "var(--lumina-border)",
              background: "var(--lumina-chrome)",
              color: "var(--lumina-ink-faint)",
            }}
          >
            <span>Markdown</span>
            <span>UTF-8</span>
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
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

// ── Page ─────────────────────────────────────────────────────────────────────

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
            A lightweight visual editor for Markdown and TXT files built for
            simplicity and performance so you can focus on the writing itself.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina-1.1.0-arm64.dmg"
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
              href="https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina.Setup.1.1.0.exe"
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
        </div>

        <div className="relative mt-16 pt-4 md:mt-24 md:pt-8">
          <div
            className="pointer-events-none absolute inset-x-[10%] -top-4 h-28 rounded-[999px] blur-3xl md:inset-x-[18%] md:h-36"
            style={{
              background:
                "linear-gradient(180deg, rgba(91,108,255,0.28) 0%, rgba(91,108,255,0.08) 100%)",
            }}
          />
          <div className="relative">
            <LuminaMock theme={theme} />
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
              key={feature}
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
                {index === 0 && "Markdown, invisibly"}
                {index === 1 && "Plain & portable"}
                {index === 2 && "Calm, by design"}
                {index === 3 && "Lightweight & fast"}
                {index === 4 && "Light & dark"}
                {index === 5 && "macOS & Windows"}
              </p>
              <p
                className="mt-2 text-lg leading-8"
                style={{ color: "var(--lumina-ink-soft)" }}
              >
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
        style={{
          borderColor: "var(--lumina-border)",
          color: "var(--lumina-ink-faint)",
        }}
      >
        <p>
          Lumina is built for distraction-free writing and modern Markdown
          workflows.
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
