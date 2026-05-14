import type { MetadataRoute } from 'next'

const BASE_URL = 'https://alllevelsathletics.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/checkout',
          '/success',
          '/plan-success',
          '/subscription-success',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
