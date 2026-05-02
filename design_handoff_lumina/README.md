# Handoff: Lumina (rebrand from EasyMarkEditor) — App Icon + UI Refresh

## Overview

Lumina is a lightweight, elegant WYSIWYG markdown editor for macOS and Windows (Electron + Tiptap). This handoff covers one specific change:

1. **UI refresh** — keep the structure of the current editor (sidebar + toolbar + canvas), but tighten typography, spacing, color, and active-state treatments to feel calmer and more "out of the way."

## About the design files

The HTML/JSX files in this bundle are **design references**, not production code. Recreate them in the existing Electron + React + Tailwind codebase using the patterns already in place (Radix UI primitives, Tiptap editor, Zustand store, Tailwind classes). Do not lift the JSX wholesale — translate intent into the codebase's idioms.

## Fidelity

**High-fidelity.** Exact colors, type sizes, spacing, and radii are specified below. Match them.

---

## Brand & app identity

### Name change

- **App name:** `Lumina` (was `EasyMarkEditor`)
- **Update in** `package.json`**:**
  - `name`: `"lumina"`
  - `description`: `"A lightweight, elegant WYSIWYG markdown editor"`
  - `build.appId`: `"com.lumina.app"`
  - `build.productName`: `"Lumina"`
- **Update window title** in `src/main/index.ts` (BrowserWindow `title` option) and any places where `EasyMarkEditor` appears in source.
- **Repo folder rename** is optional but recommended to match.

### App icon

The icon is bundled at the root of this folder.

| File | Purpose |
| --- | --- |
| `icon.svg` | **Vector source of truth.** Edit this to change the design. |
| `icon-1024.png` … `icon-16.png` | PNG renders at every size needed. |

**Icon design (Logo 09):**

- 1024×1024 canvas, **macOS Big Sur squircle** with corner radius **228** (≈22.37% of 1024)
- Background: linear gradient top→bottom, `#5B6CFF` → `#3B4BD8`
- **Back page:** white at 62% alpha, rotated −8° around center, rect at (240, 200) 500×640 with rx=42
- **Front page:** solid white, rotated +4° around center, rect at (280, 220) 500×640 with rx=42
- **Drop shadow** on both pages: Gaussian blur σ=14, offset y=18, alpha 0.18
- **Five lines** on the front page, stroke `#C9D0FF`, width 22, round caps, lengths decreasing top→bottom (380, 340, 300, 260, 180 px from x=340), spaced 90px vertically starting at y=380

### Building `.icns` and `.ico` for Electron

Place final binaries in `build/` (electron-builder reads them automatically). Two options:

**Easy:** drop in a single PNG and let electron-builder generate both formats:

```
mkdir -p build
cp design_handoff_lumina/icon-1024.png build/icon.png
```

**Best quality:** generate both formats from the per-size PNGs:

```bash
# macOS .icns
mkdir icon.iconset
cp design_handoff_lumina/icon-16.png   icon.iconset/icon_16x16.png
cp design_handoff_lumina/icon-32.png   icon.iconset/icon_16x16@2x.png
cp design_handoff_lumina/icon-32.png   icon.iconset/icon_32x32.png
cp design_handoff_lumina/icon-64.png   icon.iconset/icon_32x32@2x.png
cp design_handoff_lumina/icon-128.png  icon.iconset/icon_128x128.png
cp design_handoff_lumina/icon-256.png  icon.iconset/icon_128x128@2x.png
cp design_handoff_lumina/icon-256.png  icon.iconset/icon_256x256.png
cp design_handoff_lumina/icon-512.png  icon.iconset/icon_256x256@2x.png
cp design_handoff_lumina/icon-512.png  icon.iconset/icon_512x512.png
cp design_handoff_lumina/icon-1024.png icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o build/icon.icns
rm -rf icon.iconset

# Windows .ico (requires ImageMagick)
magick design_handoff_lumina/icon-16.png  design_handoff_lumina/icon-32.png \
       design_handoff_lumina/icon-48.png  design_handoff_lumina/icon-64.png \
       design_handoff_lumina/icon-128.png design_handoff_lumina/icon-256.png \
       build/icon.ico

# Linux fallback
cp design_handoff_lumina/icon-1024.png build/icon.png
```

---

## Design tokens

Add these to the Tailwind config (`tailwind.config.ts`) under `theme.extend.colors` and `fontFamily`. Reference them by class name throughout the app rather than hardcoding hex.

### Brand colors

| Token | Hex | Usage |
| --- | --- | --- |
| `lumina-indigo` | `#3B4BD8` | Primary, deep |
| `lumina-indigo-soft` | `#5B6CFF` | Hover, caret, active accents |
| `lumina-indigo-tint` | `rgba(91,108,255,0.10)` | Active row background (light) |
| `lumina-indigo-tint-dark` | `rgba(91,108,255,0.16)` | Active row background (dark) |

### Light theme

| Token | Hex |
| --- | --- |
| `bg` (canvas) | `#FAFAF7` |
| `chrome` (toolbar, status bar) | `#FFFFFF` |
| `sidebar` | `#F4F2EE` |
| `titlebar` | `#F0EEE9` |
| `border` | `#E8E6E0` |
| `ink` | `#1F1F23` |
| `ink-soft` | `#6B6B70` |
| `ink-faint` | `#A0A09A` |

### Dark theme

| Token | Hex |
| --- | --- |
| `bg` | `#1A1A1F` |
| `chrome` | `#1F1F25` |
| `sidebar` | `#16161A` |
| `titlebar` | `#15151A` |
| `border` | `#2A2A30` |
| `ink` | `#ECECEF` |
| `ink-soft` | `#A8A8B0` |
| `ink-faint` | `#6B6B70` |

### Status colors

- Saved indicator dot: `#10B981`

### Typography

- **Single typeface:** **Inter Tight** (Google Font). Load weights 400, 500, 600, 700.
- **Monospace:** system stack — `ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace` — used **only** for code blocks, inline code, status bar metadata, and shortcut hints.

### Type scale (rendered editor content)

| Element | Size | Weight | Letter-spacing | Line-height |
| --- | --- | --- | --- | --- |
| H1 | 34px | 700 | \-0.8px | 1.15 |
| H2 | 20px | 600 | \-0.3px | 1.4 |
| Body | 16px | 400 | 0 | 1.7 |
| Lede / subtitle | 15px | 400 | 0 | 1.55 |
| Inline code | 13.5px | 400 (mono) | 0 | inherit |
| Blockquote | 15px | 400 italic | 0 | 1.55 |

### Type scale (chrome)

| Element | Size | Weight | Color |
| --- | --- | --- | --- |
| Title bar filename | 12px | 500 | `ink` |
| Title bar suffix ("· Lumina") | 12px | 400 | `ink-faint` |
| Sidebar section header | 10px | 600, uppercase, letter-spacing 1px | `ink-faint` |
| File name (sidebar) | 13px | 500 (active: 600) | `ink` |
| File timestamp | 11px | 400 | `ink-faint` |
| Toolbar word count | 11px (mono) | 400 | `ink-faint` |
| Status bar | 11px (mono) | 400 | `ink-faint` |

### Spacing & radii

- Editor content max-width: **640px**, side padding **56px**, top padding **44px**
- Title bar height: **36px**
- Toolbar height: **44px**
- Status bar height: **26px**
- Sidebar width: **220px**
- Window border-radius: **12px**
- Toolbar button: **28×28**, radius **6px**, icon 15px stroke 1.6
- Card / panel radius: **8px**
- Inline code radius: **4px**
- Code block radius: **6–8px**

### Shadows / elevation

- Window/title bar uses native chrome on macOS; on Windows, retain whatever frameless treatment the project already uses.
- The editor is intentionally flat — no card shadows in the canvas.

---

## Screens

### 1. Editor window (only screen)

**Layout (top to bottom):**

1. Title bar — 36px high, `titlebar` background, `border` bottom 1px
2. Body — fills remaining height, two columns:
   - Sidebar: 220px wide, `sidebar` background, `border` right 1px
   - Editor area: flex 1
3. Inside editor area (top to bottom):
   - Toolbar — 44px high, `chrome` background, `border` bottom 1px
   - Canvas — flex 1, scrolls
   - Status bar — 26px high, `chrome` background, `border` top 1px

#### Title bar

- macOS: render the native traffic-light buttons via Electron's `titleBarStyle: 'hiddenInset'` if not already; on Windows render minimize/maximize/close on the right via the existing pattern.
- Center: small **18px** Lumina mark (use `icon.svg` inline) + filename + `· Lumina` suffix in `ink-faint`. Filename in `ink` weight 500.

#### Sidebar

Top to bottom, 14px vertical padding, 10px horizontal:

1. **Search box** — full width, 7px/10px padding, radius 8px, background `rgba(0,0,0,0.04)` light / `rgba(255,255,255,0.04)` dark. Search icon (13px stroke 1.6) + "Search files" placeholder + `⌘K` hint pill on the right.
2. **"Recent" header** — 10px uppercase letter-spacing 1px `ink-faint`, with a "new file" icon button on the right.
3. **File rows** — each row 8px/12px/8px/16px padding, radius 8px:
   - **Active state:** soft tint background (`lumina-indigo-tint` / `-dark`), and a 3px-wide × \~20px-tall rounded indigo bar at left edge (positioned absolute, left: 4px, top: 10, bottom: 10).
   - **Filename:** 13px, weight 500 (active 600), color `ink`.
   - **Timestamp:** 11px `ink-faint`, 2px below filename. Use relative time ("Edited just now", "2 hours ago", "Yesterday", "3 days ago", "Last week").
   - **No truncated paths.** Full path can appear in a tooltip on hover.
4. **Spacer** — flex 1.
5. **Footer** — folder context bar with top border. Folder icon + path text (e.g. `~/Documents/notes`), truncated with ellipsis. 11px `ink-faint`.

#### Toolbar — keep ALL existing actions

The full action set is preserved. Six clusters separated by hairline dividers (1px wide, 16px tall, color `border`, with 6px horizontal margin). Order:

1. **History** — Undo, Redo
2. **Format** — single dropdown (replaces individual H1/H2/H3 buttons; see below)
3. **Inline formatting** — Bold, Italic, Strikethrough, Inline code
4. **Lists** — Bulleted, Ordered, Checklist
5. **Blocks** — Blockquote, Code block, Horizontal rule
6. **Insert** — Link, Image, Table

After the insert group, `flex: 1` spacer, then:

- **Word count** ("247 words · 4 min") — 11px mono, `ink-faint`, margin-right 8px
- **More menu** (⋯) — 28px button

##### Format dropdown

A single control replaces the H1/H2/H3 buttons so that **Paragraph** is also addressable. Use a Radix `DropdownMenu` (already in the project's deps).

- **Trigger:** 28px tall, \~124px wide, 1px border (`border` token), radius 6px, very faint background tint, 10px horizontal padding. Shows the current block label in 12.5px / 500 weight `ink-soft`, plus a 10px chevron-down on the right.
- **Label always reflects the cursor's current block** — keeps the user oriented:
  - `Paragraph` (default body)
  - `Heading 1`
  - `Heading 2`
  - `Heading 3`
  - `Code block` *(when cursor is inside a fenced code block)*
  - `Blockquote` *(when cursor is inside a quote)*
- **Menu items** (only first four are selectable from this control; code block and blockquote are reachable from the Blocks cluster, but the label still updates when the user is in one):
  - Paragraph — `⌘⌥0`
  - Heading 1 — `⌘⌥1`
  - Heading 2 — `⌘⌥2`
  - Heading 3 — `⌘⌥3`
- Selecting an item calls Tiptap's `editor.chain().focus().setParagraph()` / `.toggleHeading({ level: N }).run()`.

##### Tooltips on every toolbar control

**Required.** Every icon button and the Format dropdown has a tooltip on hover so users always know what an icon does. Two acceptable implementations — pick one and use consistently:

- **Preferred:** Radix `Tooltip` (already in deps), 200ms delay-open, 0ms delay-close, side="bottom", with the action name and its keyboard shortcut, e.g. **"Bold · ⌘B"**.
- **Acceptable fallback:** native `title="…"` attribute on the button — works everywhere, no extra dependency, but slower to appear and not styled.

Tooltip text per button:

| Button | Tooltip |
| --- | --- |
| Undo | Undo · ⌘Z |
| Redo | Redo · ⌘⇧Z |
| Format dropdown | Format · Choose paragraph or heading |
| Bold | Bold · ⌘B |
| Italic | Italic · ⌘I |
| Strikethrough | Strikethrough · ⌘⇧X |
| Inline code | Inline code · ⌘E |
| Bulleted list | Bulleted list · ⌘⇧8 |
| Numbered list | Numbered list · ⌘⇧7 |
| Checklist | Checklist · ⌘⇧9 |
| Blockquote | Blockquote · ⌘⇧. |
| Code block | Code block · ⌘⌥C |
| Horizontal rule | Horizontal rule |
| Insert link | Insert link · ⌘K |
| Insert image | Insert image |
| Insert table | Insert table |
| More | More options |

On Windows, swap `⌘` for `Ctrl` and `⌥` for `Alt` in the displayed shortcuts.

**Button states:**

- Resting icon color: `#5B5B62` (light) / `#C9C9CF` (dark)
- Hover: background `rgba(0,0,0,0.04)` / `rgba(255,255,255,0.05)`, radius 6px
- Active (formatting applied at cursor): icon color `lumina-indigo-soft`, background tint
- Disabled: 40% opacity

#### Editor canvas

- Full width, scrolls vertically
- Content column: max-width 640px, centered, 56px horizontal padding, 44px top padding
- Background: `bg` token (no card, no shadow — content sits directly on the canvas)
- Caret: 2px wide, color `lumina-indigo-soft`, blink animation: 1s `steps(2)` infinite

#### Status bar

Single row, 11px mono, `ink-faint`, gap 16px:

- `Markdown` (current file format)
- `UTF-8` (encoding)
- `Ln 14, Col 8` (cursor position)
- Spacer
- Right side: 6px green dot (`#10B981`) + "Saved" text. When dirty, swap to amber and "Unsaved changes."

---

## Where the indigo accent appears

Used as a "you are here" signal, never decoration:

| Surface | Treatment |
| --- | --- |
| Active sidebar row | 3px left bar + 10–16% tint background |
| Caret | `lumina-indigo-soft` solid, 2px |
| Selection | 15% indigo highlight |
| Active toolbar button | Icon glows `lumina-indigo-soft` |
| Inline links in rendered preview | `lumina-indigo-soft` weight 600, no underline until hover |
| Blockquote rule | 2px left border `lumina-indigo-soft` |
| Focus ring on inputs | 2px `lumina-indigo-soft` outline with 2px offset |

---

## Interactions & behavior

### Theme switching

- Honor OS-level theme preference by default (`prefers-color-scheme`).
- Allow manual override via View menu or status-bar toggle.
- Persist to existing electron-store.

### Sidebar

- Search input filters the recent list as you type (case-insensitive substring on filename).
- ⌘K (macOS) / Ctrl+K (Windows) focuses the search.
- Click a file row to open. Active row gets the active treatment.
- Hover row reveals truncated full path as a Radix Tooltip.
- "New file" icon next to "Recent" creates an unsaved buffer.

### Toolbar

- Each button toggles its formatting on the current Tiptap selection (already wired in `@tiptap/react`).
- Tooltips on hover (Radix Tooltip), 200ms delay, including keyboard shortcut.
- Word count updates live from the editor's plain-text content (use `editor.storage.characterCount` or recompute).

### Editor

- WYSIWYG via Tiptap (already in the codebase). Markdown round-trips via `tiptap-markdown`.
- Caret blink runs continuously while focused; pause for 500ms after any keystroke.
- Save state: debounced 500ms after last keystroke, write to the open file path. While debounced, status bar shows "Unsaved changes" (amber dot); after write completes, "Saved" (green).

### Animations

- Sidebar row hover: background-color transition 120ms ease-out.
- Toolbar button hover: background-color transition 100ms ease-out.
- Theme switch: no transition (snap), to avoid flashing during file open.

---

## State management

Use the existing Zustand store (`src/main/store.ts` for persisted, plus a renderer store for UI state). Keys to add or confirm:

| Key | Type | Purpose |
| --- | --- | --- |
| `theme` | `'light' | 'dark' | 'system'` | User-selected theme. Persisted. |
| `recentFiles` | `Array<{path, lastOpened}>` | Drives sidebar list. Persisted. |
| `activeFilePath` | `string | null` | Highlights active row, drives title. |
| `searchQuery` | `string` | Sidebar filter. Not persisted. |
| `dirty` | `boolean` | Drives status bar Saved/Unsaved. |
| `wordCount` / `readingTime` | `number` / `string` | Derived from editor content. |

---

## Files in this bundle

| File | Purpose |
| --- | --- |
| `Lumina UI.html` | Static design reference. Open in a browser to see the target light + dark mockups side-by-side, with rationale annotations. |
| `lumina-ui.jsx` | The React component used inside the mockup. Reference for exact JSX structure / token usage — **not** the source to copy into the app. |
| `icon.svg` | Vector master for the app icon. |
| `icon-{16,32,48,64,128,256,512,1024}.png` | Pre-rendered PNG sizes for `.icns`/`.ico` generation. |
| This `README.md` | The implementation guide you're reading. |

---

## Suggested implementation order

 1. Rebrand strings, app id, window title, and `package.json` fields.
 2. Drop in the icon (`build/icon.icns`, `.ico`, `.png`) and verify dev build shows the new icon in the dock/taskbar.
 3. Add Inter Tight to the renderer (Google Fonts `<link>` in `index.html` or local font file + `@font-face`).
 4. Extend Tailwind theme with the design tokens above.
 5. Refactor the title bar to the new structure (icon + filename + suffix).
 6. Refactor the sidebar (search, recent header, simplified rows, footer).
 7. Restyle the toolbar with the six-cluster grouping and divider treatment, keeping every existing action.
 8. Add max-width content column + 56px padding to the editor canvas; restyle Tiptap defaults to match the type scale.
 9. Add the status bar (dirty/saved indicator, format/encoding/cursor).
10. Wire ⌘K to focus search, add tooltips, verify dark/light parity.

---

## Open questions

- Confirm whether the existing window uses Electron's `titleBarStyle: 'hiddenInset'` (mac) — needed for the centered filename treatment to work without overlap.
- Confirm whether file paths and recent files are already persisted via `electron-store`, or if a new store key is needed.
- The current toolbar may have actions not enumerated above (e.g. text alignment). Keep any existing action; slot it into the most appropriate cluster.