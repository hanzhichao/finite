export interface PresentTheme {
  id: string;
  name: string;
  // CSS variable overrides
  vars: Record<string, string>;
  // Pre-computed full slide class string (BASE + theme-specific + element overrides)
  slideClasses: string;
  // H1 slide: always vertically + horizontally centered
  h1Center: boolean;
  // preview swatch [bg, fg, accent]
  preview: [string, string, string];
}


/**
 * Base Tailwind classes shared by ALL themes (structural / non-decorative).
 * Included in each theme's pre-computed `slideClasses` string.
 */
export const BASE_SLIDE_CLASS = [
  "max-w-none leading-relaxed",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4",
  "[&_ul:has(>li>input[type=checkbox])]:list-none [&_ul:has(>li>input[type=checkbox])]:pl-0",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4",
  "[&_li]:my-0.5",
  "[&_li:has(>input[type=checkbox]:checked)]:line-through [&_li:has(>input[type=checkbox]:checked)]:text-muted-foreground",
  "[&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-muted",
  "[&_pre]:overflow-auto [&_pre]:my-4",
  "[&_pre>code]:block [&_pre>code]:p-4 [&_pre>code]:rounded-md",
  "[&_table]:w-full [&_table]:my-4 [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:text-left [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2",
  "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border",
].join(" ");

// ---------------------------------------------------------------------------
// 5 Themes
// ---------------------------------------------------------------------------

const themeDefault: PresentTheme = {
  id: "default",
  name: "Default",
  vars: {},
  slideClasses: [
    BASE_SLIDE_CLASS,
    "text-lg",
    "[&_h1]:text-7xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-6",
    "[&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-5",
    "[&_h3]:text-3xl [&_h3]:font-semibold [&_h3]:mb-4",
    "[&_p]:text-xl [&_p]:leading-relaxed [&_p]:my-4",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  ].join(" "),
  h1Center: true,
  preview: ["#f5f5f5", "#1a1a1a", "#e5e5e5"],
};

const themeDark: PresentTheme = {
  id: "dark",
  name: "Dark",
  vars: {
    "--background": "oklch(0.13 0 0)",
    "--foreground": "oklch(0.93 0 0)",
    "--muted": "oklch(0.22 0 0)",
    "--muted-foreground": "oklch(0.62 0 0)",
    "--accent": "oklch(0.22 0 0)",
    "--accent-foreground": "oklch(0.93 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
  },
  slideClasses: [
    BASE_SLIDE_CLASS,
    "text-lg",
    "[&_h1]:text-7xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-8 [&_h1]:bg-gradient-to-r [&_h1]:from-blue-400 [&_h1]:to-violet-400 [&_h1]:bg-clip-text [&_h1]:text-transparent",
    "[&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-5 [&_h2]:text-blue-300",
    "[&_h3]:text-3xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-violet-300",
    "[&_p]:text-xl [&_p]:leading-relaxed [&_p]:my-4",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  ].join(" "),
  h1Center: true,
  preview: ["#1e1e1e", "#ededed", "#3a3a6a"],
};

const themeInk: PresentTheme = {
  id: "ink",
  name: "Ink",
  vars: {
    "--background": "oklch(0.97 0.005 80)",
    "--foreground": "oklch(0.25 0.02 50)",
    "--muted": "oklch(0.92 0.01 80)",
    "--muted-foreground": "oklch(0.50 0.02 50)",
    "--accent": "oklch(0.92 0.01 80)",
    "--accent-foreground": "oklch(0.25 0.02 50)",
    "--border": "oklch(0.85 0.02 80)",
  },
  slideClasses: [
    BASE_SLIDE_CLASS,
    "text-lg font-serif",
    "[&_h1]:text-7xl [&_h1]:font-black [&_h1]:tracking-wide [&_h1]:mb-8 [&_h1]:border-b-2 [&_h1]:border-current [&_h1]:pb-4 [&_h1]:inline-block",
    "[&_h2]:text-4xl [&_h2]:font-bold [&_h2]:mb-5 [&_h2]:border-b [&_h2]:border-current/30 [&_h2]:pb-2",
    "[&_h3]:text-3xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:italic",
    "[&_p]:text-xl [&_p]:leading-loose [&_p]:my-4",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-amber-700/40 [&_blockquote]:pl-5 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:opacity-80",
  ].join(" "),
  h1Center: true,
  preview: ["#f5f0e8", "#3d3529", "#e0d5c4"],
};

const themeOcean: PresentTheme = {
  id: "ocean",
  name: "Ocean",
  vars: {
    "--background": "oklch(0.20 0.04 250)",
    "--foreground": "oklch(0.92 0.02 210)",
    "--muted": "oklch(0.28 0.04 250)",
    "--muted-foreground": "oklch(0.68 0.03 210)",
    "--accent": "oklch(0.28 0.04 250)",
    "--accent-foreground": "oklch(0.92 0.02 210)",
    "--border": "oklch(0.34 0.04 250)",
  },
  slideClasses: [
    BASE_SLIDE_CLASS,
    "text-lg",
    "[&_h1]:text-7xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-8 [&_h1]:bg-gradient-to-r [&_h1]:from-cyan-300 [&_h1]:to-blue-300 [&_h1]:bg-clip-text [&_h1]:text-transparent [&_h1]:drop-shadow-lg",
    "[&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-5 [&_h2]:text-cyan-300",
    "[&_h3]:text-3xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-sky-300",
    "[&_p]:text-xl [&_p]:leading-relaxed [&_p]:my-4",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-cyan-400/40 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-sky-300/80 [&_blockquote]:italic",
  ].join(" "),
  h1Center: true,
  preview: ["#172540", "#d0e8f5", "#1e3a5f"],
};

const themeRose: PresentTheme = {
  id: "rose",
  name: "Rose",
  vars: {
    "--background": "oklch(0.98 0.008 350)",
    "--foreground": "oklch(0.22 0.03 340)",
    "--muted": "oklch(0.93 0.012 350)",
    "--muted-foreground": "oklch(0.50 0.03 340)",
    "--accent": "oklch(0.93 0.012 350)",
    "--accent-foreground": "oklch(0.22 0.03 340)",
    "--border": "oklch(0.88 0.018 350)",
  },
  slideClasses: [
    BASE_SLIDE_CLASS,
    "text-lg",
    "[&_h1]:text-7xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-8 [&_h1]:bg-gradient-to-r [&_h1]:from-rose-500 [&_h1]:to-pink-400 [&_h1]:bg-clip-text [&_h1]:text-transparent",
    "[&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-5 [&_h2]:text-rose-600",
    "[&_h3]:text-3xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-pink-500",
    "[&_p]:text-xl [&_p]:leading-relaxed [&_p]:my-4",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-rose-300 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-rose-400 [&_blockquote]:italic",
  ].join(" "),
  h1Center: true,
  preview: ["#fdf2f4", "#3d2030", "#f5d5dc"],
};

export const PRESENT_THEMES: PresentTheme[] = [
  themeDefault,
  themeDark,
  themeInk,
  themeOcean,
  themeRose,
];

export function getThemeById(id: string): PresentTheme {
  return PRESENT_THEMES.find((t) => t.id === id) ?? PRESENT_THEMES[0];
}

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export type TransitionType = "none" | "fade" | "slide";

export const TRANSITIONS: { id: TransitionType; name: string }[] = [
  { id: "none", name: "None" },
  { id: "fade", name: "Fade" },
  { id: "slide", name: "Slide" },
];
