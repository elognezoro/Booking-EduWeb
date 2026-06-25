/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    // Dépôt de fichiers CERTEL (PDF/captures) pour l'évaluation IA des tâches pratiques.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
