import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programs | All Levels Athletics',
  description:
    'Browse coaching programs from All Levels Athletics — including the comprehensive Tension Release & Performance Enhancement program.',
  alternates: { canonical: '/programs' },
  openGraph: {
    title: 'Programs | All Levels Athletics',
    description: 'Coaching programs designed for tension release and performance enhancement.',
    url: 'https://alllevelsathletics.com/programs',
    type: 'website',
  },
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children
}
