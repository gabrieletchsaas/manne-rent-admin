import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  manifest: '/manifest.json',
  themeColor: '#1a3a6b',
  appleWebApp: {
    capable: true,
    title: 'Dashboard Admin',
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: '#0a1628' }}>
        {children}
      </body>
    </html>
  )
}