import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anna & Petr | Svatební pozvánka",
  description: "Svatební web Anny a Petra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
