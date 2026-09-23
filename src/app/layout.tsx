import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AyuTrace – Smart Crop Spoilage 0% Intelligence Engine',
  description: 'Autonomous GIS surplus routing, predictive thermal decay diagnostics, and dynamic 2-opt TSP clearance pricing platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark`}>
      <body className="bg-obsidian text-slate-100 min-h-screen flex flex-col antialiased selection:bg-harvest-500 selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}
