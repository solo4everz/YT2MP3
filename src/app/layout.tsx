import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YT2MP3 Studio - High Quality YouTube to MP3 Converter",
  description:
    "Tukar YouTube link kepada fail audio MP3 320kbps HD, M4A, FLAC atau WAV dengan pantas dan percuma. Dibina secara profesional oleh Safwan Quest.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "YT2MP3 Studio - Penukar YouTube ke MP3 HD",
    description:
      "Tukar YouTube link kepada fail audio MP3 320kbps HD dengan pantas dan percuma. Dibina oleh Safwan Quest.",
    locale: "ms_MY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ms"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0d091a] text-white">
        {children}
      </body>
    </html>
  );
}
