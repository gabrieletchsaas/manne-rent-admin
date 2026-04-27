export default function Home() {
  return (
    <html lang="fr">
      <head>
        <title>Chargement Dashboard Admin...</title>
        <meta httpEquiv="refresh" 
              content="0;url=https://manne-rent-app.vercel.app/dashboard/admin" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a3a6b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{
        margin: 0,
        background: '#0a1628',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#c9a84c',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Redirection vers le Dashboard Admin...</p>
        </div>
      </body>
    </html>
  )
}