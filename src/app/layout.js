import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Who's Winning? Poker Hand Trainer",
  description: "Practice identifying winning poker hands at every stage of Texas Hold'em",
  openGraph: {
    title: "Who's Winning? Poker Hand Trainer",
    description: "Practice identifying winning poker hands at every stage of Texas Hold'em",
    url: 'https://pokerhandtrainer.vercel.app',
    siteName: "Poker Hand Trainer",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541278107931-e006523892df',  // Random poker image from Unsplash
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
    title: "Who's Winning? Poker Hand Trainer",
    description: "Practice identifying winning poker hands at every stage of Texas Hold'em",
    images: ['https://images.unsplash.com/photo-1541278107931-e006523892df'], // Same image
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
