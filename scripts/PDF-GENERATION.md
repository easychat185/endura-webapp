# PDF Program Guide Generation

## Overview

The script `generate-guide.mjs` produces a mobile-friendly PDF of the Endura training program guide. It uses a **two-pass measurement-based bin-packing approach** to ensure content is never cut at page boundaries and is vertically centered on each page.

## How It Works

### Two-Pass Architecture

**Pass 1 — Measure:** All content is broken into atomic blocks (level intros, exercise headers, individual steps). These blocks are rendered in a headless Chromium instance via Puppeteer, and each block's pixel height is measured using `offsetHeight`.

**Bin-Pack:** A greedy algorithm assigns measured blocks to fixed-height pages (430×932px, iPhone-sized). No block is ever split across a page boundary.

**Pass 2 — Render:** The final HTML is built with each page as a fixed-height `<div>` using flexbox `justify-content: center` for vertical centering. Puppeteer exports this as a PDF with zero margins (padding is baked into the page divs).

### Block Types (atomic, never split)

| Block | Description |
|-------|-------------|
| `cover` | Title page — always alone on page 1 |
| `toc` | Table of contents — always alone on page 2 |
| `level-intro` | Level label + title + description — always starts a new page |
| `exercise-header` | Exercise number, name, duration/XP badges + "Why" section |
| `step` | Single step with number, title, and body text |
| `footer` | End disclaimer — placed on last page |

### Packing Rules

1. **Cover and TOC** each get their own page
2. **Level intros** always start a new page
3. **Each exercise starts its own page** — the header and its steps are placed together
4. If an exercise is **too tall for one page**, remaining steps overflow cleanly to the next page
5. After overflow, the **next exercise is only added to that page if it fits entirely** — if it would get cut off, it starts its own fresh page
6. The script reports which exercises span multiple pages

### Page Dimensions

- Width: 430px (iPhone Pro width)
- Height: 932px (iPhone Pro height)
- Padding: 28px top/bottom, 24px left/right
- Usable content height: 876px
- Gap between blocks: 16px

## Running

```bash
node scripts/generate-guide.mjs
```

### Output

- `endura-program-guide.pdf` — the final PDF
- `guide-pages/page-XX.png` — per-page PNG previews (for visual QA)

### Dependencies

- `puppeteer` — headless Chrome for rendering and PDF export
- `pdf-to-png-converter` — converts PDF pages to PNG for visual review

## Design Decisions

### Why not CSS page breaks?

CSS `break-inside: avoid` and `break-before: page` are unreliable in Puppeteer's PDF renderer. They caused:
- Text cut mid-line at page boundaries
- White gaps from `box-decoration-break: clone` cloning borders/padding
- Near-empty pages from awkward break interactions
- No way to vertically center content

### Why measure in the browser?

Calculating text heights from font metrics is error-prone. By rendering blocks in the actual browser engine and reading `offsetHeight`, we get exact pixel measurements that account for font loading, line wrapping, and CSS layout.

### Why no card borders/backgrounds on exercises?

Exercise cards originally had `border` and `background` styles. When cards spanned page breaks, `box-decoration-break: clone` created visible white edges at break points. Removing the card box and using subtle `border-bottom` separators (or just spacing) eliminated all visual artifacts.

## Current Stats

- 96 content blocks
- 21 pages
- 1 exercise spans 2 pages: #08 Progressive Muscle Relaxation (6 long steps)
- All other exercises fit on a single page
