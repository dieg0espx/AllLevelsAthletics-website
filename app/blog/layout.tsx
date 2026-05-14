import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | All Levels Athletics',
  description:
    'Training tips, mobility insights, and recovery strategies from All Levels Athletics.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | All Levels Athletics',
    description: 'Training tips, mobility insights, and recovery strategies.',
    url: 'https://alllevelsathletics.com/blog',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
