# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finite is a Notion-like markdown note-taking desktop app built with **Tauri 2** (Rust backend) + **Next.js** (React frontend). It uses SQLite for local data storage and BlockNote as the rich-text editor.

## Development Commands

```bash
pnpm tauri dev      # Run the app in development (starts Next.js dev server + Tauri window)
pnpm tauri build    # Build for release
pnpm dev            # Run Next.js frontend only (port 3000)
pnpm lint           # Run Biome check + Next.js ESLint
```

## Architecture

### Frontend (Next.js with static export)
- **Single-page app**: `src/app/page.tsx` is the only page route. It conditionally renders different views (editor, mind map, subnotes, calendar) based on `useActiveNote` store state.
- **Layout**: `src/app/layout.tsx` is a `"use client"` root layout that sets up ThemeProvider, DialogProvider, Navigation sidebar, and SearchCommand. It also handles Tauri window controls (minimize/maximize/close) for the custom titlebar (`decorations: false`).
- **Next.js config**: Static export mode (`output: "export"`, `distDir: "out"`), unoptimized images, no React strict mode.

### State Management (Zustand stores in `src/hooks/`)
- `use-active-note.ts` — Central store: active note ID, note data, view mode flags (mind map, subnotes, calendar), properties, content change counter.
- `use-settings.ts` — App settings: wide mode, show properties, default title/icon, show favorites/recent.
- `use-properties.ts` — Property visibility state.
- `use-sidebar.ts`, `use-search.ts`, `use-cover-image.ts`, `use-import.ts` — UI state for sidebar, search dialog, cover picker, import dialog.

### Data Layer (`src/lib/`)
- `notes.ts` — All SQLite CRUD operations for notes via `@tauri-apps/plugin-sql`. Database stored at `~/Finite/db.sqlite` (or app data dir on Android).
- `properties.ts` — CRUD for note properties (custom fields) and options (for select/multi-select types).
- `types.ts` — Core types: `Note`, `Property`, `PropertyType` enum, `Option`.
- `utils.ts` — UUID generation, date conversion helpers.
- `attachments.ts` — File attachment handling.

### Database Schema (SQLite)
Four tables: `notes` (hierarchical with `parent` FK), `properties` (custom field definitions), `options` (select/multi-select choices), `notes_properties` (note-property values junction table).

### Rust Backend (`src-tauri/`)
- Minimal Rust code — `src/lib.rs` initializes Tauri with plugins: `tauri-plugin-os`, `tauri-plugin-fs`, `tauri-plugin-sql` (SQLite). No custom Tauri commands; all DB access happens through the SQL plugin from the frontend.
- `tauri.conf.json`: Custom titlebar (no decorations), transparent window, asset protocol enabled for `$HOME/Finite/**`.

### Component Structure (`src/components/`)
- `main/` — Note views: editor, navbar (with sub-components for menu, title, favorites, lock, etc.), note header, cover, properties, tags, subnotes (table/card), markmap, calendar.
- `sidebar/` — Navigation tree, note items with drag-and-drop, favorites, templates, trash.
- `dialogs/` — Settings, search command (cmdk), cover picker, import, confirm dialog, icon picker.
- `ui/` — shadcn/ui components (button, dialog, dropdown-menu, etc.).
- `providers/` — Theme provider (next-themes), dialog provider.
- `common/` — Reusable widgets: date-time picker, file uploader, addable select, mode/language toggles.

### i18n
Translations in `src/i18n/en.json` and `src/i18n/zh.json`, initialized in `src/i18n/index.ts` using i18next + react-i18next.

## Code Style

- **Formatter/Linter**: Biome (spaces, double quotes) + ESLint with Next.js plugin.
- **Path alias**: `@/*` maps to `./src/*`.
- **UI framework**: shadcn/ui (Radix primitives) + Tailwind CSS v4 + Mantine (for BlockNote editor).
- **Package manager**: pnpm.
- Console log messages are in Chinese (this is intentional).
