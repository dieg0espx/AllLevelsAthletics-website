import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | All Levels Athletics',
  description:
    'Meet Daniel and learn the story behind All Levels Athletics — a body-tension reset and athletic performance coaching practice serving athletes worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | All Levels Athletics',
    description: 'Meet Daniel and the philosophy behind All Levels Athletics.',
    url: 'https://alllevelsathletics.com/about',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
