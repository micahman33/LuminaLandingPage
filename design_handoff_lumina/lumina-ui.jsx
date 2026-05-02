/* eslint-disable */
// Lumina UI mock — simplified, all-sans, light + dark side-by-side.

const LUMINA_INDIGO = "#3B4BD8";
const LUMINA_INDIGO_SOFT = "#5B6CFF";

// Tiny inline icon set — stroke-based, calm
const Icon = ({ d, size = 16, sw = 1.5, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke={color} strokeWidth={sw}
       strokeLinecap="round" strokeLinejoin="round"
       style={{ display: "block", flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const ICONS = {
  bold:     "M7 5h6a3.5 3.5 0 0 1 0 7H7zm0 7h7a3.5 3.5 0 0 1 0 7H7z",
  italic:   "M14 5h-4M14 19h-4M15 5l-6 14",
  strike:   "M5 12h14M8 7c0-1.5 1.8-3 4-3s4 1.5 4 3M8 17c0 1.5 1.8 3 4 3s4-1.5 4-3",
  code:     "M8 8l-4 4 4 4M16 8l4 4-4 4",
  h1:       "M4 5v14M14 5v14M4 12h10M18 9l2-1v11",
  h2:       "M4 5v14M14 5v14M4 12h10M17 9c0-1 1-2 2.5-2s2.5 1 2.5 2-1 2-2.5 3-2.5 2-2.5 3h5",
  h3:       "M4 5v14M14 5v14M4 12h10M17 8h5l-2.5 4a2.5 2.5 0 1 1-2 4",
  list:     "M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  ordered:  "M10 6h11M10 12h11M10 18h11M4 6h1v.01M4 12h1.5l-1.5 2H5M4 17l1-1v3",
  check:    "M9 6h12M9 12h12M9 18h12M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17",
  quote:    "M6 8h4l-2 8H4zm10 0h4l-2 8h-4z",
  block:    "M3 6h18v12H3zM7 9l-3 3 3 3M17 9l3 3-3 3M14 8l-4 8",
  link:     "M10 14a4 4 0 0 1 0-5.66l2-2a4 4 0 0 1 5.66 5.66l-1 1M14 10a4 4 0 0 1 0 5.66l-2 2a4 4 0 0 1-5.66-5.66l1-1",
  image:    "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M16 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  table:    "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14",
  divider:  "M4 12h16M4 7h2M9 7h2M14 7h2M19 7h-1M4 17h2M9 17h2M14 17h2M19 17h-1",
  undo:     "M3 7v6h6M3 13a9 9 0 0 1 16-4",
  redo:     "M21 7v6h-6M21 13a9 9 0 0 0-16-4",
  search:   "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5.2-5.2",
  more:     "M5 12h.01M12 12h.01M19 12h.01",
  newDoc:   "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 12v6M9 15h6",
  folder:   "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  side:     "M3 5h18v14H3zM9 5v14",
};

// File row in sidebar
function FileRow({ name, time, active, theme }) {
  const dark = theme === "dark";
  const activeBg = dark
    ? "rgba(91,108,255,0.16)"
    : "rgba(91,108,255,0.10)";
  const activeBar = LUMINA_INDIGO_SOFT;
  return (
    <div style={{
      position: "relative",
      padding: "8px 12px 8px 16px",
      borderRadius: 8,
      background: active ? activeBg : "transparent",
      cursor: "pointer",
    }}>
      {active && (
        <div style={{
          position: "absolute", left: 4, top: 10, bottom: 10,
          width: 3, borderRadius: 2,
          background: activeBar,
        }} />
      )}
      <div style={{
        fontSize: 13, fontWeight: active ? 600 : 500,
        color: dark ? "#E6E6EA" : "#1F1F23",
        lineHeight: 1.3,
      }}>{name}</div>
      <div style={{
        fontSize: 11, color: dark ? "#8B8B92" : "#9A9AA0",
        marginTop: 2,
      }}>{time}</div>
    </div>
  );
}

// Toolbar button — title attribute drives the native tooltip
function TB({ d, theme, active, title }) {
  const dark = theme === "dark";
  const color = active
    ? LUMINA_INDIGO_SOFT
    : (dark ? "#C9C9CF" : "#5B5B62");
  return (
    <div title={title} style={{
      width: 28, height: 28, borderRadius: 6,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
    }}>
      <Icon d={d} size={15} sw={1.6} color={color} />
    </div>
  );
}

// Format dropdown — replaces the H1/H2/H3 buttons. One control, all block types.
function FormatPicker({ theme, value = "Paragraph" }) {
  const dark = theme === "dark";
  const inkSoft = dark ? "#C9C9CF" : "#5B5B62";
  const inkFaint = dark ? "#8B8B92" : "#9A9AA0";
  const border = dark ? "#2D2D33" : "#E5E5EA";
  return (
    <div title="Format · Choose paragraph or heading"
         style={{
      height: 28, padding: "0 10px",
      display: "flex", alignItems: "center", gap: 8,
      borderRadius: 6,
      border: `1px solid ${border}`,
      background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
      cursor: "pointer", minWidth: 124,
      fontSize: 12.5, color: inkSoft, fontWeight: 500,
    }}>
      <span>{value}</span>
      <span style={{ flex: 1 }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 3.5 L5 6.5 L8 3.5" stroke={inkFaint}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Divider({ theme }) {
  return (
    <div style={{
      width: 1, height: 16, alignSelf: "center",
      background: theme === "dark" ? "#2D2D33" : "#E5E5EA",
      margin: "0 6px",
    }} />
  );
}

// Mini app logo for chrome
function LuminaMark({ size = 18 }) {
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size}
         style={{ borderRadius: size * 0.2237, display: "block" }}>
      <defs>
        <linearGradient id="mark-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B6CFF"/>
          <stop offset="1" stopColor="#3B4BD8"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="228" fill="url(#mark-bg)"/>
      <g transform="rotate(-8 512 512)">
        <rect x="240" y="200" width="500" height="640" rx="42" fill="rgba(255,255,255,0.62)"/>
      </g>
      <g transform="rotate(4 512 512)">
        <rect x="280" y="220" width="500" height="640" rx="42" fill="#ffffff"/>
      </g>
    </svg>
  );
}

// Main editor mock
function LuminaApp({ theme = "dark", width = 1100, height = 660 }) {
  const dark = theme === "dark";
  const bg = dark ? "#1A1A1F" : "#FAFAF7";
  const chromeBg = dark ? "#1F1F25" : "#FFFFFF";
  const sidebarBg = dark ? "#16161A" : "#F4F2EE";
  const border = dark ? "#2A2A30" : "#E8E6E0";
  const ink = dark ? "#ECECEF" : "#1F1F23";
  const inkSoft = dark ? "#A8A8B0" : "#6B6B70";
  const inkFaint = dark ? "#6B6B70" : "#A0A09A";
  const titleBarBg = dark ? "#15151A" : "#F0EEE9";

  return (
    <div style={{
      width, height,
      background: bg, color: ink,
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${border}`,
      display: "flex", flexDirection: "column",
      fontFamily: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
    }}>
      {/* Title bar */}
      <div style={{
        height: 36, background: titleBarBg,
        borderBottom: `1px solid ${border}`,
        display: "flex", alignItems: "center", padding: "0 14px",
        gap: 12, flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%",
                        background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%",
                        background: "#FFBD2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%",
                        background: "#28C840" }} />
        </div>
        <div style={{
          flex: 1, textAlign: "center", fontSize: 12,
          color: inkSoft, letterSpacing: 0.1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <LuminaMark size={14} />
          <span style={{ fontWeight: 500, color: ink }}>README.md</span>
          <span style={{ color: inkFaint }}>· Lumina</span>
        </div>
        <div style={{ width: 50 }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 220, background: sidebarBg,
          borderRight: `1px solid ${border}`,
          padding: "14px 10px",
          display: "flex", flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px", borderRadius: 8,
            background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}`,
            marginBottom: 14,
          }}>
            <Icon d={ICONS.search} size={13} sw={1.6} color={inkFaint} />
            <span style={{ fontSize: 12, color: inkFaint }}>Search files</span>
            <span style={{ marginLeft: "auto", fontSize: 10,
                           color: inkFaint, fontFamily: "ui-monospace, monospace",
                           padding: "1px 5px", borderRadius: 3,
                           background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
              ⌘K
            </span>
          </div>

          {/* Files header */}
          <div style={{
            fontSize: 10, color: inkFaint,
            textTransform: "uppercase", letterSpacing: 1,
            padding: "0 12px 8px", fontWeight: 600,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>Recent</span>
            <Icon d={ICONS.newDoc} size={13} sw={1.6} color={inkFaint} />
          </div>

          {/* File list — only filenames + time, no truncated paths */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FileRow name="README.md" time="Edited just now" active theme={theme} />
            <FileRow name="FirstTest.md" time="2 hours ago" theme={theme} />
            <FileRow name="design-notes.md" time="Yesterday" theme={theme} />
            <FileRow name="changelog.md" time="3 days ago" theme={theme} />
            <FileRow name="ideas.md" time="Last week" theme={theme} />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer — folder context */}
          <div style={{
            fontSize: 11, color: inkFaint,
            padding: "10px 12px", borderTop: `1px solid ${border}`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon d={ICONS.folder} size={13} sw={1.6} color={inkFaint} />
            <span style={{
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>~/Documents/notes</span>
          </div>
        </div>

        {/* Editor area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          background: bg, minWidth: 0,
        }}>
          {/* Toolbar — full action set, organized into groups. All buttons
              have title= so a native tooltip appears on hover. */}
          <div style={{
            height: 44, background: chromeBg,
            borderBottom: `1px solid ${border}`,
            display: "flex", alignItems: "center",
            padding: "0 12px", gap: 1, flexShrink: 0,
          }}>
            {/* History */}
            <TB d={ICONS.undo} theme={theme} title="Undo · ⌘Z" />
            <TB d={ICONS.redo} theme={theme} title="Redo · ⌘⇧Z" />
            <Divider theme={theme} />
            {/* Format dropdown — Paragraph / Heading 1 / Heading 2 / Heading 3 */}
            <FormatPicker theme={theme} value="Heading 1" />
            <Divider theme={theme} />
            {/* Inline formatting */}
            <TB d={ICONS.bold} theme={theme} title="Bold · ⌘B" />
            <TB d={ICONS.italic} theme={theme} title="Italic · ⌘I" />
            <TB d={ICONS.strike} theme={theme} title="Strikethrough · ⌘⇧X" />
            <TB d={ICONS.code} theme={theme} title="Inline code · ⌘E" />
            <Divider theme={theme} />
            {/* Lists */}
            <TB d={ICONS.list} theme={theme} title="Bulleted list · ⌘⇧8" />
            <TB d={ICONS.ordered} theme={theme} title="Numbered list · ⌘⇧7" />
            <TB d={ICONS.check} theme={theme} title="Checklist · ⌘⇧9" />
            <Divider theme={theme} />
            {/* Blocks */}
            <TB d={ICONS.quote} theme={theme} title="Blockquote · ⌘⇧.​" />
            <TB d={ICONS.block} theme={theme} title="Code block · ⌘⌥C" />
            <TB d={ICONS.divider} theme={theme} title="Horizontal rule" />
            <Divider theme={theme} />
            {/* Insert */}
            <TB d={ICONS.link} theme={theme} title="Insert link · ⌘K" />
            <TB d={ICONS.image} theme={theme} title="Insert image" />
            <TB d={ICONS.table} theme={theme} title="Insert table" />

            <div style={{ flex: 1 }} />
            <span style={{
              fontSize: 11, color: inkFaint,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              marginRight: 8,
            }}>
              247 words · 4 min
            </span>
            <TB d={ICONS.more} theme={theme} title="More options" />
          </div>

          {/* Editor canvas — generous padding, soft elevated surface */}
          <div style={{
            flex: 1, overflow: "hidden",
            display: "flex", justifyContent: "center",
            padding: "44px 0 0",
          }}>
            <div style={{
              maxWidth: 640, width: "100%",
              padding: "0 56px",
              fontSize: 16, lineHeight: 1.7,
              color: ink,
            }}>
              <h1 style={{
                fontSize: 34, fontWeight: 700, letterSpacing: -0.8,
                margin: "0 0 8px", lineHeight: 1.15,
                color: ink,
              }}>
                Welcome to Lumina
              </h1>
              <p style={{
                fontSize: 15, color: inkSoft, margin: "0 0 28px",
              }}>
                A lightweight, elegant editor for the documents you actually want to read.
              </p>

              <h2 style={{
                fontSize: 20, fontWeight: 600, letterSpacing: -0.3,
                margin: "32px 0 12px", color: ink,
              }}>
                Just write.
              </h2>
              <p style={{ margin: "0 0 16px" }}>
                Lumina is a <span style={{ color: LUMINA_INDIGO_SOFT, fontWeight: 600 }}>
                WYSIWYG markdown editor</span> for macOS and Windows. Format what
                you mean — the markdown is written for you, behind the glass.
              </p>
              <p style={{ margin: "0 0 16px" }}>
                Open any <code style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 13.5,
                  padding: "1px 6px", borderRadius: 4,
                  background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  color: dark ? "#E6E6EA" : "#1F1F23",
                }}>.md</code> file and it just works. The cursor sits where you
                see it. Headings look like headings.
                <span style={{
                  display: "inline-block", width: 2, height: 18,
                  background: LUMINA_INDIGO_SOFT,
                  marginLeft: 2, verticalAlign: "-3px",
                  animation: "luminaCaret 1s steps(2) infinite",
                }} />
              </p>

              <blockquote style={{
                margin: "20px 0", padding: "0 0 0 18px",
                borderLeft: `2px solid ${LUMINA_INDIGO_SOFT}`,
                color: inkSoft, fontStyle: "italic", fontSize: 15,
              }}>
                The best tool is the one you forget you're using.
              </blockquote>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            height: 26, borderTop: `1px solid ${border}`,
            background: chromeBg,
            display: "flex", alignItems: "center", padding: "0 16px",
            fontSize: 11, color: inkFaint,
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            flexShrink: 0, gap: 16,
          }}>
            <span>Markdown</span>
            <span>UTF-8</span>
            <span>Ln 14, Col 8</span>
            <div style={{ flex: 1 }} />
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#10B981",
              }} />
              Saved
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes luminaCaret {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { LuminaApp, LuminaMark, FormatPicker });
