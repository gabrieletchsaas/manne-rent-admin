export default function Home() {
  return (
    <html lang="fr">
      <head>
        <title>Dashboard Admin</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a3a6b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" 
              content="black-translucent" />
        <meta name="apple-mobile-web-app-title" 
              content="Dashboard Admin" />
        <meta name="application-name" content="Dashboard Admin" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { 
            width: 100%; 
            height: 100%; 
            overflow: hidden;
            background: #0a1628;
          }
          iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: none;
            display: block;
          }
        `}</style>
      </head>
      <body>
        <iframe 
          src="https://manne-rent-app.vercel.app/dashboard/admin"
          title="Dashboard Admin Manne Rent"
          allow="fullscreen"
        />
      </body>
    </html>
  )
}