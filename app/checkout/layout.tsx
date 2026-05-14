import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | All Levels Athletics',
  description: 'Complete your order at All Levels Athletics.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
