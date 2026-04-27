export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B1C3D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '24px',
    }}>
      <div>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚫</div>
        <h1 style={{ color: '#F59E0B', fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>
          Accès Refusé
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
          Vous n&apos;avez pas les droits pour accéder au Dashboard Admin.
        </p>
        <a
          href="/login"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#F59E0B',
            color: '#0B1C3D',
            borderRadius: '16px',
            fontWeight: 900,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            textDecoration: 'none',
          }}
        >
          Se connecter avec un compte Admin
        </a>
      </div>
    </div>
  );
}
