/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化静态资源加载
  images: {
    unoptimized: true,
  },
  // 启用 React 严格模式
  reactStrictMode: true,
  // 配置 webpack 以更好地处理资源
  webpack: (config, { dev, isServer }) => {
    // 优化开发体验
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    return config;
  },
  // 配置 HTTP 头以优化缓存
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
