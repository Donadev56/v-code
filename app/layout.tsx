import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { OpenEditorProvider } from "@/hooks/useOpenEditor";
import { Toaster } from "@/components/ui/sonner";
import { EditorDialogProvider } from "@/hooks/useDialog";
import { TerminalDialogPortal } from "@/hooks/portal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPEN CODE",
  description: "OPEN CODE is an SSH code eidtor only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OpenEditorProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <EditorDialogProvider>
              {children}
              <TerminalDialogPortal />
            </EditorDialogProvider>
            <Toaster />
          </ThemeProvider>
        </OpenEditorProvider>
      </body>
    </html>
  );
}
