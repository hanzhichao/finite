"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Palette, Play, X } from "lucide-react";
import { convertFileSrc } from "@tauri-apps/api/core";

import { getNote } from "@/lib/notes";
import { Note } from "@/lib/types";
import { useActiveNote } from "@/hooks/use-active-note";
import { useSettings } from "@/hooks/use-settings";
import {
  PRESENT_THEMES,
  TRANSITIONS,
  getThemeById,
  type TransitionType,
} from "@/lib/present-themes";
import { useTranslation } from "react-i18next";

// ---------------------------------------------------------------------------
// Image helpers (unchanged)
// ---------------------------------------------------------------------------

function resolveImageSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://asset.localhost/") ||
      src.startsWith("https://asset.localhost/") ||
      src.startsWith("asset://") ||
      src.startsWith("data:") ||
      src.startsWith("blob:")) {
    return src;
  }
  if (src.startsWith("/")) return convertFileSrc(src);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return convertFileSrc(src);
}

function extractImagesFromContent(contentJson: string | undefined): Array<{ url: string; alt: string }> {
  if (!contentJson) return [];
  try {
    const blocks = JSON.parse(contentJson);
    const images: Array<{ url: string; alt: string }> = [];
    function walk(nodes: unknown[]) {
      for (const node of nodes) {
        if (typeof node !== "object" || node === null) continue;
        const block = node as Record<string, unknown>;
        if (block.type === "image") {
          const props = block.props as Record<string, string> | undefined;
          if (props?.url) {
            images.push({ url: props.url, alt: props.caption || props.name || "" });
          }
        }
        if (Array.isArray(block.children)) walk(block.children);
      }
    }
    if (Array.isArray(blocks)) walk(blocks);
    return images;
  } catch {
    return [];
  }
}

function fixMarkdownImages(markdown: string, contentJson: string | undefined): string {
  const images = extractImagesFromContent(contentJson);
  if (images.length === 0) return markdown;

  let result = markdown;
  const usedIndices = new Set<number>();

  result = result.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt: string, url: string) => {
    const resolved = resolveImageSrc(url || undefined);
    if (resolved) return `![${alt}](${resolved})`;
    const idx = images.findIndex((img, i) => !usedIndices.has(i) && (img.alt === alt || alt === ""));
    if (idx !== -1) {
      usedIndices.add(idx);
      const src = resolveImageSrc(images[idx].url);
      return src ? `![${images[idx].alt}](${src})` : match;
    }
    return match;
  });

  const markdownImageUrls = new Set<string>();
  result.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_m, url: string) => {
    markdownImageUrls.add(url);
    return _m;
  });

  for (let i = 0; i < images.length; i++) {
    if (usedIndices.has(i)) continue;
    const img = images[i];
    const resolved = resolveImageSrc(img.url);
    if (!resolved) continue;
    if (markdownImageUrls.has(img.url) || markdownImageUrls.has(resolved)) continue;
    result += `\n\n![${img.alt}](${resolved})`;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Slide splitting
// ---------------------------------------------------------------------------

function stripYamlFrontMatter(md: string) {
  const lines = md.split("\n");
  if (lines[0]?.trim() !== "---") return md;
  const second = lines.slice(1).findIndex((l) => l.trim() === "---");
  if (second === -1) return md;
  return lines.slice(second + 2).join("\n");
}

function splitSlides(
  md: string,
  opts: { enableHeadingSplit: boolean; headingLevel: number }
) {
  const cleaned = stripYamlFrontMatter(md || "");
  const lines = cleaned.split("\n");
  const slides: string[] = [];
  let buf: string[] = [];
  let inCodeFence = false;

  const level = Math.min(6, Math.max(1, opts.headingLevel));
  const headingRe = new RegExp(`^#{1,${level}}\\s+`);

  const isSeparator = (line: string) => {
    const t = line.trim();
    if (t === "") return false;
    if (/^(---|\*\*\*|___)$/.test(t)) return true;
    if (/^<hr\s*\/?>$/i.test(t)) return true;
    if (/^(\*\s*\*\s*\*|_\s*_\s*_|-{3,})$/.test(t)) return true;
    return false;
  };

  const pushSlide = () => {
    const s = buf.join("\n").trim();
    if (s) slides.push(s);
    buf = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inCodeFence = !inCodeFence;
      buf.push(line);
      continue;
    }
    if (!inCodeFence) {
      if (isSeparator(line)) { pushSlide(); continue; }
      if (opts.enableHeadingSplit && headingRe.test(line)) {
        if (buf.join("\n").trim().length > 0) pushSlide();
        buf.push(line);
        continue;
      }
    }
    buf.push(line);
  }

  pushSlide();
  return slides;
}

// ---------------------------------------------------------------------------
// Transition CSS (injected once)
// ---------------------------------------------------------------------------

const transitionCSS = `
@keyframes present-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes present-slide-left {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes present-slide-right {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}
`;

function useTransitionCSS() {
  useEffect(() => {
    const id = "present-transition-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = transitionCSS;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const NotePresent = ({ noteId }: { noteId: string }) => {
  const { t } = useTranslation();
  const [note, setNote] = useState<Note>();
  const [index, setIndex] = useState(0);
  const prevIndex = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [transitionOpen, setTransitionOpen] = useState(false);

  const setActiveNote = useActiveNote((s) => s.setActiveNote);
  const setPresentView = useActiveNote((s) => s.setPresentView);

  const enableHeadingSplit = useSettings((s) => s.presentAutoSplitByHeading);
  const headingLevel = useSettings((s) => s.presentSplitHeadingLevel);
  const defaultTheme = useSettings((s) => s.presentTheme);
  const noteThemes = useSettings((s) => s.presentNoteThemes);
  const setNoteTheme = useSettings((s) => s.setPresentNoteTheme);
  const transition = useSettings((s) => s.presentTransition) as TransitionType;
  const setTransition = useSettings((s) => s.setPresentTransition);

  const activeThemeId = noteThemes[noteId] ?? defaultTheme;
  const theme = getThemeById(activeThemeId);

  useTransitionCSS();

  useEffect(() => {
    const fetchData = async () => {
      const cur = await getNote(noteId);
      setNote(cur);
      setActiveNote(cur);
      setIndex(0);
    };
    void fetchData();
  }, [noteId, setActiveNote]);

  const slides = useMemo(
    () => {
      const md = fixMarkdownImages(note?.markdown ?? "", note?.content);
      return splitSlides(md, { enableHeadingSplit, headingLevel });
    },
    [note?.markdown, note?.content, enableHeadingSplit, headingLevel]
  );

  const total = slides.length;
  const current = slides[index] ?? "";
  const isH1Slide = theme.h1Center && /^\s*#\s+/.test(current);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, total - 1)));
  }, [total]);

  const direction = index >= prevIndex.current ? "right" : "left";

  const toggleFullscreen = useCallback(async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const win = getCurrentWindow();
    const full = await win.isFullscreen();
    await win.setFullscreen(!full);
    setIsFullscreen(!full);
  }, []);

  const exit = useCallback(async () => {
    if (isFullscreen) {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().setFullscreen(false);
    }
    setPresentView(false);
    useActiveNote.getState().setPresentView(false);
  }, [setPresentView, isFullscreen]);

  const prev = useCallback(() => {
    setIndex((i) => { prevIndex.current = i; return Math.max(0, i - 1); });
  }, []);

  const next = useCallback(() => {
    setIndex((i) => { prevIndex.current = i; return Math.min(Math.max(0, total - 1), i + 1); });
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); exit(); return; }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); return; }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exit, next, prev]);

  const slideClasses = theme.slideClasses;

  return (
    <div
      className="fixed inset-0 z-[999999] bg-background text-foreground"
      style={Object.keys(theme.vars).length > 0 ? theme.vars as React.CSSProperties : undefined}
    >
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-12 px-3 flex items-center justify-between border-b bg-background/80 backdrop-blur">
        <div className="text-xs text-muted-foreground truncate">
          {note?.icon} {note?.title}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {total === 0 ? "0/0" : `${index + 1}/${total}`}
          </span>
          {/* theme picker */}
          <div className="relative">
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              onClick={() => setThemeOpen((v) => !v)}
            >
              <Palette className="w-4 h-4" />
            </button>
            {themeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-40 rounded-md border bg-background p-1 shadow-md">
                  {PRESENT_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      className={`w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent ${th.id === activeThemeId ? "bg-accent font-medium" : ""}`}
                      onClick={() => {
                        setNoteTheme(noteId, th.id);
                        setThemeOpen(false);
                      }}
                    >
                      <span className="flex gap-0.5">
                        {th.preview.map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-full border border-border/50" style={{ background: c }} />
                        ))}
                      </span>
                      {t(th.name)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* transition picker */}
          <div className="relative">
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              onClick={() => setTransitionOpen((v) => !v)}
            >
              <Play className="w-4 h-4" />
            </button>
            {transitionOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setTransitionOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-32 rounded-md border bg-background p-1 shadow-md">
                  {TRANSITIONS.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      className={`w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent ${tr.id === transition ? "bg-accent font-medium" : ""}`}
                      onClick={() => {
                        setTransition(tr.id);
                        setTransitionOpen(false);
                      }}
                    >
                      {t(tr.name)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button
            type="button"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              exit();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* slide viewport */}
      <div className="absolute inset-0 top-12 overflow-y-auto">
        <div className={`min-h-full w-full flex justify-center ${isH1Slide ? "items-center" : "items-start"}`}>
          <div className={`w-full max-w-5xl px-10 py-10 ${isH1Slide ? "text-center" : ""}`}>
            {total === 0 ? (
              <div className="text-sm text-muted-foreground">
                No slides. Use `---` or headings to split.
              </div>
            ) : (
              <div
                key={`${index}-${transition}`}
                style={transition === "none" ? undefined : {
                  animation: transition === "fade"
                    ? "present-fade-in 300ms ease both"
                    : `present-slide-${direction === "right" ? "left" : "right"} 300ms ease both`,
                }}
              >
                <div className={slideClasses}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    urlTransform={(url) => url}
                    components={{
                      img: ({ src, alt, node, ...rest }) => {
                        const resolved = resolveImageSrc(typeof src === "string" ? src : undefined);
                        if (!resolved) return null;
                        return (
                          <img
                            src={resolved}
                            alt={alt ?? ""}
                            className="max-w-full h-auto rounded-md my-4"
                            {...rest}
                          />
                        );
                      },
                      input: ({ node, disabled, checked, ...rest }) => {
                        if (rest.type === "checkbox") {
                          return <input {...rest} defaultChecked={checked} />;
                        }
                        return <input disabled={disabled} checked={checked} {...rest} />;
                      },
                      thead: ({ node, children, ...rest }) => {
                        const isEmpty = !node?.children?.some((row) => {
                          if (row.type !== "element") return false;
                          return row.children?.some((cell) => {
                            if (cell.type !== "element") return false;
                            return cell.children && cell.children.length > 0 &&
                              cell.children.some((c) => (c.type === "text" && c.value.trim() !== "") || c.type === "element");
                          });
                        });
                        if (isEmpty) return null;
                        return <thead {...rest}>{children}</thead>;
                      },
                    }}
                  >{current}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {total > 0 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="fixed left-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-background/70 border disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index >= total - 1}
              className="fixed right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-background/70 border disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
