import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sepotifi AI Studio — AI Playlist Curator & Massive Listening DNA',
  description:
    'AI Music Curation Studio & Deep Listening DNA Analytics powered by Spotify Web API.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-[#1ED760] selection:text-black overflow-hidden">
        {children}
      </body>
    </html>
  );
}
