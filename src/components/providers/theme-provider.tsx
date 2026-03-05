import * as React from "react"

function ensureLocalStorage() {
  const g = globalThis as unknown as { localStorage?: unknown };
  const ls = g.localStorage as { getItem?: unknown; setItem?: unknown; removeItem?: unknown; clear?: unknown } | undefined;
  if (
    ls &&
    typeof ls.getItem === "function" &&
    typeof ls.setItem === "function" &&
    typeof ls.removeItem === "function" &&
    typeof ls.clear === "function"
  ) {
    return;
  }

  const store = new Map<string, string>();
  const shim = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => { store.set(String(key), String(value)); },
    removeItem: (key: string) => { store.delete(String(key)); },
    clear: () => { store.clear(); },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() { return store.size; },
  };

  g.localStorage = shim;
}

export function ThemeProvider({
                                children,
                                ...props
                              }: React.ComponentProps<any>) {
  ensureLocalStorage();
  // Defer loading next-themes until after localStorage is valid.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ThemeProvider: NextThemesProvider } = require("next-themes") as typeof import("next-themes");
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
