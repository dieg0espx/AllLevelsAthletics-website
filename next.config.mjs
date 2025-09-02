/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tiktok.com https://*.ttwstatic.com",
              "font-src 'self' https://fonts.gstatic.com https://*.tiktok.com https://*.ttwstatic.com",
              "img-src 'self' data: https: blob: https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com",
              "media-src 'self' https: https://*.tiktok.com https://*.ttwstatic.com",
              "connect-src 'self' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com https://*.supabase.co https://*.supabase.com",
              "frame-src 'self' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: [
              'accelerometer=(self)',
              'ambient-light-sensor=(self)',
              'autoplay=(self)',
              'battery=(self)',
              'camera=(self)',
              'cross-origin-isolated=(self)',
              'display-capture=(self)',
              'document-domain=(self)',
              'encrypted-media=(self)',
              'execution-while-not-rendered=(self)',
              'execution-while-out-of-viewport=(self)',
              'fullscreen=(self)',
              'geolocation=(self)',
              'gyroscope=(self)',
              'keyboard-map=(self)',
              'magnetometer=(self)',
              'microphone=(self)',
              'midi=(self)',
              'navigation-override=(self)',
              'payment=(self)',
              'picture-in-picture=(self)',
              'publickey-credentials-get=(self)',
              'screen-wake-lock=(self)',
              'sync-xhr=(self)',
              'usb=(self)',
              'web-share=(self)',
              'xr-spatial-tracking=(self)',
            ].join(', '),
          },
        ],
      },
    ];
  },
}

export default nextConfig
