/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // On affiche le Dashboard Admin à la racine de ce domaine
        source: '/',
        destination: 'https://manne-rent-app.vercel.app/dashboard/admin',
      },
      {
        // On proxy tout le reste (JS, CSS, API, images) SAUF les fichiers PWA locaux
        source: '/:path((?!manifest\\.json|icons/).*)',
        destination: 'https://manne-rent-app.vercel.app/:path*',
      },
    ]
  },
};

export default nextConfig;
