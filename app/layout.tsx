import type { Metadata } from "next";
import "./globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: "Movie in Three Clues",
  description: "A live movie guessing game for 2–8 players. Join a room, read the clues, and claim the spotlight.",
  icons: {
    icon: "/favicon.svg?v=frame-question",
    shortcut: "/favicon.svg?v=frame-question",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..900&display=swap" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
