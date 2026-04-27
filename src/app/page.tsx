export default function Home() {
  return (
    <html lang="fr">
      <head>
        <meta httpEquiv="refresh" 
          content="0;url=https://manne-rent-app.vercel.app/dashboard/admin" 
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a3a6b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Dashboard Admin" />
        <meta name="application-name" content="Dashboard Admin" />
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
        <p>Chargement Dashboard Admin...</p>
      </body>
    </html>
  )
}