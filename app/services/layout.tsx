import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | All Levels Athletics',
  description:
    'Online personal training, body tension reset, and one-on-one coaching. Foundation, Growth, and Elite plans tailored to your performance goals.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | All Levels Athletics',
    description: 'Online personal training, body tension reset, and one-on-one coaching.',
    url: 'https://alllevelsathletics.com/services',
    type: 'website',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
