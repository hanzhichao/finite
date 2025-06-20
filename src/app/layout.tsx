"use client"
import "@/i18n";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DialogProvider } from "@/components/providers/dialog-provider";
import "@/styles/globals.css";
import { SearchCommand } from "@/components/dialogs/search-command";
import { Navigation } from "@/components/sidebar/navigation";
import { getCurrentWindow } from '@tauri-apps/api/window';
import {useEffect} from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(()=>{
    if (!(window === undefined)){
      const appWindow = getCurrentWindow();
      document
        .getElementById('titlebar-minimize')
        ?.addEventListener('click', () => appWindow.minimize());
      document
        .getElementById('titlebar-maximize')
        ?.addEventListener('click', () => appWindow.toggleMaximize());
      document
        .getElementById('titlebar-close')
        ?.addEventListener('click', () => appWindow.close());
    }
    },
    [])

  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster/>
      <DialogProvider/>
      <div className="h-full flex dark:bg-[#1F1F1F] rounded-t-2xl bg-transparent">
        <Navigation/>
        <main className="mt-10 flex-1 overflow-y-auto bg-transparent">
          <SearchCommand/>
          {children}
        </main>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
