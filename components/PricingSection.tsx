"use client"

import { useState, useEffect } from "react"
import { CheckIcon, StarIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

// Custom hook for billing period management
const useBillingPeriod = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  
  useEffect(() => {
    // Update prices when billing period changes
    const event = new CustomEvent('billingPeriodChanged', { detail: { isAnnual } })
    window.dispatchEvent(event)
  }, [isAnnual])

  return { isAnnual, setIsAnnual }
}

// Analytics handler
const handleAnalytics = (plan: string, billing: string, variant: string) => {
  const event = {
    plan,
    billing,
    variant,
    timestamp: new Date().toISOString(),
    // Add your analytics tracking here
  }
  console.log('Pricing CTA clicked:', event)
}

// Pricing data
const pricingData = {
  tiers: [
    {
      id: 'foundation',
      name: 'Foundation',
      badge: 'STARTER',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      subtitle: 'Perfect for beginners ready to start their fitness journey',
      monthlyPrice: 197,
      annualPrice: 167, // 15% savings
      features: [
        '1x/month personalized check-ins',
        'Fully customized training program',
        'Email support & guidance',
        'Access to exercise library',
        'Nutrition guidelines'
      ],
      popular: false
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'GROWTH',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      subtitle: 'Ideal for committed individuals seeking faster results',
      monthlyPrice: 297,
      annualPrice: 252, // 15% savings
      features: [
        '2x/month detailed check-ins',
        'Form review & video feedback',
        'Progressive training adjustments',
        'Priority email support',
        'Meal planning assistance',
        'Recovery optimization'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      badge: 'ELITE',
      badgeColor: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
      subtitle: 'Maximum support for serious athletes and professionals',
      monthlyPrice: 497,
      annualPrice: 422, // 15% savings
      features: [
        'Weekly personalized check-ins',
        'Complete tension reset coaching',
        'Video analysis & technique review',
        'Mobility prioritization program',
        '24/7 text support access',
        'Supplement recommendations'
      ],
      popular: false
    }
  ],
  features: [
    { name: 'Check-in Frequency', foundation: 'Monthly', growth: 'Bi-weekly', elite: 'Weekly' },
    { name: 'Custom Training Program', foundation: true, growth: true, elite: true },
    { name: 'Form Review & Feedback', foundation: false, growth: true, elite: true },
    { name: 'Tension Reset Coaching', foundation: false, growth: false, elite: true },
    { name: '24/7 Text Support', foundation: false, growth: false, elite: true }
  ],
  faq: [
    {
      question: 'How does billing work?',
      answer: 'We offer both monthly and annual billing. Annual plans include a 15% discount and you can cancel anytime.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely! You can change your plan at any time. Changes take effect at your next billing cycle.'
    }
  ]
}

// Billing Toggle Component
const BillingToggle = ({ isAnnual, setIsAnnual }: { isAnnual: boolean; setIsAnnual: (value: boolean) => void }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-muted'}`}>
        Monthly
      </span>
      <button
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle billing period"
        onClick={() => setIsAnnual(!isAnnual)}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface border border-stroke transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-muted'}`}>
          Annual
        </span>
        {isAnnual && (
          <span className="inline-flex items-center rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success">
            Save 15%
          </span>
        )}
      </div>
    </div>
  )
}

// Plan Card Component
const PlanCard = ({ 
  plan, 
  isAnnual, 
  isPopular = false 
}: { 
  plan: typeof pricingData.tiers[0]; 
  isAnnual: boolean; 
  isPopular?: boolean;
}) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
  const savings = isAnnual ? Math.round(plan.monthlyPrice * 0.15) : 0

  return (
    <article
      className={`relative flex flex-col h-full rounded-2xl border border-stroke bg-surface p-6 lg:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${
        isPopular ? 'ring-2 ring-primary/20 scale-105' : ''
      }`}
      aria-labelledby={`${plan.id}-title`}
      aria-describedby={isPopular ? `${plan.id}-popular` : undefined}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div
            id={`${plan.id}-popular`}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-black"
          >
            <StarIcon className="h-3 w-3" />
            MOST POPULAR
          </div>
        </div>
      )}

      <header className="text-center pb-6 pt-4">
        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-4 ${plan.badgeColor}`}>
          {plan.badge}
        </div>
        <h3 id={`${plan.id}-title`} className="text-2xl font-bold mb-2">
          {plan.name}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {plan.subtitle}
        </p>
      </header>

      <div className="flex items-baseline justify-center mb-6">
        <span className="text-4xl font-black">${price}</span>
        <span className="text-muted ml-1">/month</span>
      </div>

      {isAnnual && savings > 0 && (
        <div className="text-center mb-6">
          <p className="text-success text-sm">
            Save ${savings}/month with annual billing
          </p>
        </div>
      )}

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => handleAnalytics(plan.id, isAnnual ? 'annual' : 'monthly', isPopular ? 'popular' : 'standard')}
        data-plan={plan.id}
        data-billing={isAnnual ? 'annual' : 'monthly'}
        data-variant={isPopular ? 'popular' : 'standard'}
        className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface ${
          isPopular
            ? 'bg-primary text-black hover:bg-primary/90 focus:ring-primary'
            : 'bg-surface border border-stroke text-white hover:border-primary/50 focus:ring-primary'
        }`}
      >
        Start 7-Day Free Trial
      </button>
    </article>
  )
}

// Comparison Table Component
const ComparisonTable = () => {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-center mb-8">Feature Comparison</h3>
      <div className="overflow-hidden rounded-2xl border border-stroke bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 sticky top-0">
              <tr className="border-b border-stroke">
                <th className="py-4 px-6 text-left font-semibold">Features</th>
                <th className="py-4 px-6 text-center font-semibold text-orange-400">Foundation</th>
                <th className="py-4 px-6 text-center font-semibold text-yellow-400">Growth</th>
                <th className="py-4 px-6 text-center font-semibold text-orange-300">Elite</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.features.map((feature, index) => (
                <tr key={index} className={`border-b border-stroke/50 ${index % 2 === 0 ? 'bg-surface/30' : ''}`}>
                  <td className="py-3 px-6 font-medium">{feature.name}</td>
                  <td className="py-3 px-6 text-center">
                    {typeof feature.foundation === 'boolean' ? (
                      feature.foundation ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <span className="text-muted">—</span>
                      )
                    ) : (
                      <span className="text-sm">{feature.foundation}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {typeof feature.growth === 'boolean' ? (
                      feature.growth ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <span className="text-muted">—</span>
                      )
                    ) : (
                      <span className="text-sm">{feature.growth}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {typeof feature.elite === 'boolean' ? (
                      feature.elite ? (
                        <CheckIcon className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <span className="text-muted">—</span>
                      )
                    ) : (
                      <span className="text-sm">{feature.elite}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-center mb-8">Frequently Asked Questions</h3>
      <div className="max-w-2xl mx-auto space-y-4">
        {pricingData.faq.map((item, index) => (
          <div key={index} className="border border-stroke rounded-xl bg-surface">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface/50 transition-colors"
            >
              <span className="font-medium">{item.question}</span>
              <QuestionMarkCircleIcon className="h-5 w-5 text-muted" />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-sm text-muted leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Pricing Section Component
export default function PricingSection() {
  const { isAnnual, setIsAnnual } = useBillingPeriod()

  return (
    <section className="py-24 bg-bg">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Coaching Plan
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            7-day free trial. No credit card required. Cancel anytime.
          </p>
        </header>

        <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {pricingData.tiers.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              isPopular={plan.popular}
            />
          ))}
        </div>

        <ComparisonTable />
        <FAQ />
      </div>
    </section>
  )
}
