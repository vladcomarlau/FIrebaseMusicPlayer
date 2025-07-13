
import type { Metadata } from 'next';
import './globals.css';
import { MusicProvider } from '@/contexts/MusicContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/ThemeProvider';
import { DynamicTheme } from '@/components/DynamicTheme';

export const metadata: Metadata = {
  title: 'Music',
  description: 'A modern local music player.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Music" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Music" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MusicProvider>
            <DynamicTheme>
              {children}
              <Toaster />
            </DynamicTheme>
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
