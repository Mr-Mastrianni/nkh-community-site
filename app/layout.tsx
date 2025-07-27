import type { Metadata } from 'next';
import StoreProvider from '../lib/store/StoreProvider';
import SessionProvider from '../components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nefer Kali Healing & Spiritual Education',
  description: 'Embark on a mystical journey of self-discovery and healing through ancient wisdom and modern spiritual practices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}