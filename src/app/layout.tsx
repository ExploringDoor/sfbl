import type { Metadata } from "next";
import "./globals.css";
import ScoreTicker from "@/components/ScoreTicker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SFBL — South Florida Baseball League",
  description: "One of the premier adult baseball organizations in Florida. Wood bat league operating in Dade, Broward and Palm Beach counties.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&family=Barlow:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScoreTicker />
        <Navbar />
        <main style={{ paddingTop: 110 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
