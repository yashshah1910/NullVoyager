import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NullVoyager - AI Travel Concierge",
  description: "An intelligent AI travel concierge agent built on the NullShot Framework. Discover destinations, search flights, and find hotels with conversational AI.",
  keywords: ["AI", "travel", "agent", "NullShot", "hackathon", "concierge", "flights", "hotels", "destinations"],
  authors: [{ name: "NullVoyager Team" }],
  openGraph: {
    title: "NullVoyager - AI Travel Concierge",
    description: "Plan your perfect trip with AI. Built for NullShot Hacks Season 0.",
    type: "website",
    siteName: "NullVoyager",
  },
  twitter: {
    card: "summary_large_image",
    title: "NullVoyager - AI Travel Concierge",
    description: "Plan your perfect trip with AI. Built for NullShot Hacks Season 0.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-dark-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
