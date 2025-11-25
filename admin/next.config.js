/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Excluir undici del procesamiento de webpack en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Ignorar módulos problemáticos
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'undici': 'commonjs undici'
      });
    }
    
    return config;
  },
}

module.exports = nextConfig
