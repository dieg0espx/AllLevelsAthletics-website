import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team | All Levels Athletics',
  description:
    'Meet the coaches and team behind All Levels Athletics.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Team | All Levels Athletics',
    description: 'Meet the coaches and team behind All Levels Athletics.',
    url: 'https://alllevelsathletics.com/team',
    type: 'website',
  },
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children
}
