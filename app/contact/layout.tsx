import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | All Levels Athletics',
  description:
    'Get in touch with All Levels Athletics. Schedule a consultation or send us a message about coaching, programs, or the MF Roller.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | All Levels Athletics',
    description: 'Schedule a consultation or send us a message.',
    url: 'https://alllevelsathletics.com/contact',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
