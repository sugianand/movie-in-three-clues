import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie in Three Clues",
  description: "A live movie guessing game for 2–8 players. Join a room, read the clues, and claim the spotlight.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg?v=midnight",
    shortcut: "/favicon.svg?v=midnight",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
