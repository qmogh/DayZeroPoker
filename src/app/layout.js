import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Day Zero Poker",
  description: "Master the fundamentals of poker from day zero",
  openGraph: {
    title: "Day Zero Poker",
    description: "Master the fundamentals of poker from day zero",
    url: 'https://dayzeropoker.vercel.app',
    siteName: "Day Zero Poker",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541278107931-e006523892df',
        width: 1200,
        height: 630,
        alt: 'Poker cards on a green felt table',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Day Zero Poker",
    description: "Master the fundamentals of poker from day zero",
    images: ['https://images.unsplash.com/photo-1541278107931-e006523892df'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
