import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin — Manne Rent',
  applicationName: 'Admin Manne Rent',
  manifest: '/manifest.json',
  themeColor: '#F59E0B',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Admin Manne Rent',
  },
  icons: {
    apple: '/icons/admin-icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F59E0B" />
        <meta name="application-name" content="Admin Manne Rent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Admin Manne Rent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/admin-icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, background: '#0B1C3D' }}>
        {children}
      </body>
    </html>
  );
}