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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com https://js.stripe.com https://m.stripe.com https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tiktok.com https://*.ttwstatic.com https://assets.calendly.com",
              "font-src 'self' https://fonts.gstatic.com https://*.tiktok.com https://*.ttwstatic.com https://assets.calendly.com",
              "img-src 'self' data: https: blob: https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com https://assets.calendly.com https://*.calendly.com",
              "media-src 'self' https: https://*.tiktok.com https://*.ttwstatic.com",
              "connect-src 'self' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com https://*.supabase.co https://*.supabase.com https://api.stripe.com https://checkout.stripe.com https://assets.calendly.com https://*.calendly.com",
              "frame-src 'self' https://www.tiktok.com https://*.tiktok.com https://*.bytedance.net https://*.ttwstatic.com https://checkout.stripe.com https://js.stripe.com https://calendly.com https://*.calendly.com https://assets.calendly.com",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(self "https://checkout.stripe.com" "https://js.stripe.com" "https://calendly.com"), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()',
          },
        ],
      },
    ];
  },
}

export default nextConfig
