import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SafeAuthProvider } from "@/contexts/safe-auth-context"
import { SafeSubscriptionProvider } from "@/contexts/safe-subscription-context"
import { CartProvider } from "@/contexts/cart-context"
import { DiscountProvider } from "@/contexts/discount-context"
import { AdminRedirect } from "@/components/admin-redirect"
import { DiscountBanner } from "@/components/discount-banner"
import { SafeContextWrapper } from "@/components/safe-context-wrapper"
import { HydrationWrapper } from "@/components/hydration-wrapper"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "All Levels Athletics - Elite Online Personal Training",
  description:
    "Transform your fitness with premium online personal training, body tension reset courses, and professional recovery tools. Get personalized coaching from Daniel, serving athletes worldwide.",
  keywords: [
    "personal training",
    "online fitness coaching",
    "body tension reset",
    "athletic performance",
    "fitness transformation",
    "strength training",
    "recovery tools",
    "sports performance",
    "fitness coaching",
    "athletic training"
  ],
  authors: [{ name: "Daniel", url: "https://alllevelsathletics.com" }],
  creator: "All Levels Athletics",
  publisher: "All Levels Athletics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alllevelsathletics.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alllevelsathletics.com',
    siteName: 'All Levels Athletics',
    title: 'All Levels Athletics - Elite Online Personal Training',
    description: 'Transform your fitness with premium online personal training, body tension reset courses, and professional recovery tools. Get personalized coaching from Daniel, serving athletes worldwide.',
    images: [
      {
        url: '/openGraphAllLevels.png',
        width: 1200,
        height: 630,
        alt: 'All Levels Athletics - Elite Online Personal Training',
      },
      {
        url: '/openGraphAllLevels.png',
        width: 600,
        height: 600,
        alt: 'All Levels Athletics Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Levels Athletics - Elite Online Personal Training',
    description: 'Transform your fitness with premium online personal training, body tension reset courses, and professional recovery tools.',
    creator: '@AllLevelsAthletics',
    images: ['/openGraphAllLevels.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'fitness',
  classification: 'fitness and health',
  generator: "Next.js",
  applicationName: "All Levels Athletics",
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/logoAllLevels.png', sizes: 'any' },
      { url: '/logoAllLevels.png', sizes: '16x16', type: 'image/png' },
      { url: '/logoAllLevels.png', sizes: '32x32', type: 'image/png' },
      { url: '/logoAllLevels.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/logoAllLevels.png',
    apple: [
      { url: '/logoAllLevels.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logoAllLevels.png',
        color: '#f97316',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#f97316',
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'All Levels Athletics',
    'mobile-web-app-capable': 'yes',
    'application-name': 'All Levels Athletics',
    'msapplication-TileImage': '/logoAllLevels.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#f97316' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} dark`}>
      <head>
        {/* Additional meta tags for comprehensive platform support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="All Levels Athletics" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="All Levels Athletics" />
        
        {/* Windows Tile */}
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-TileImage" content="/logoAllLevels.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Additional Open Graph tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="All Levels Athletics - Elite Online Personal Training" />
        
        {/* Twitter additional tags */}
        <meta name="twitter:site" content="@AllLevelsAthletics" />
        <meta name="twitter:creator" content="@AllLevelsAthletics" />
        
        {/* Additional SEO tags */}
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="California" />
        <meta name="geo.position" content="34.0522;-118.2437" />
        <meta name="ICBM" content="34.0522, -118.2437" />
        
        {/* Contact information */}
        <meta name="contact" content="AllLevelsAthletics@gmail.com" />
        <meta name="phone" content="760-585-8832" />
        
        {/* Calendly CSS */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        
        {/* Business information */}
        <meta name="business:contact_data:street_address" content="Online Business" />
        <meta name="business:contact_data:locality" content="California" />
        <meta name="business:contact_data:region" content="CA" />
        <meta name="business:contact_data:postal_code" content="Online" />
        <meta name="business:contact_data:country_name" content="United States" />
        <meta name="business:contact_data:phone_number" content="760-585-8832" />
        <meta name="business:contact_data:email" content="AllLevelsAthletics@gmail.com" />
        
        {/* Structured data for fitness business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FitnessClub",
              "name": "All Levels Athletics",
              "description": "Elite Online Personal Training and Fitness Coaching",
              "url": "https://alllevelsathletics.com",
              "logo": "https://alllevelsathletics.com/logoAllLevels.png",
              "image": "https://alllevelsathletics.com/openGraphAllLevels.png",
              "telephone": "+1-760-585-8832",
              "email": "AllLevelsAthletics@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "CA"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 34.0522,
                "longitude": -118.2437
              },
              "openingHours": "Mo-Su 06:00-21:00",
              "priceRange": "$$",
              "currenciesAccepted": "USD",
              "paymentAccepted": "Credit Card, PayPal",
              "sameAs": [
                "https://www.tiktok.com/@AllLevelsAthletics",
                "https://www.instagram.com/AllLevelsAthletics"
              ],
              "serviceType": [
                "Personal Training",
                "Online Fitness Coaching",
                "Body Tension Reset",
                "Athletic Performance Training"
              ],
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Fitness Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Online Personal Training"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Body Tension Reset Course"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <SafeAuthProvider>
          <SafeSubscriptionProvider>
            <SafeContextWrapper>
              <CartProvider>
                <DiscountProvider>
                  <HydrationWrapper>
                    {/* Temporarily disable AdminRedirect to fix redirect loop */}
                    {/* <AdminRedirect> */}
                      <Navigation />
                      <DiscountBanner />
                      <main>{children}</main>
                      <Footer />
                    {/* </AdminRedirect> */}
                  </HydrationWrapper>
                </DiscountProvider>
              </CartProvider>
            </SafeContextWrapper>
          </SafeSubscriptionProvider>
        </SafeAuthProvider>
        <script async src="https://www.tiktok.com/embed.js"></script>
      </body>
    </html>
  )
}
