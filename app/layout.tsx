import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3movies | Movie in Three Clues",
  description: "A live movie guessing game for 2–8 players. Join a room, read the clues, and claim the spotlight.",
  icons: {
    icon: "/favicon.svg?v=3movies",
    shortcut: "/favicon.svg?v=3movies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('three-clues-theme');document.documentElement.dataset.cinemaTheme=['midnight','arena'].includes(t)?t:'premiere'}catch{}"}}/>{children}</body>
    </html>
  );
}
