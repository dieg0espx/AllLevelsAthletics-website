"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Trophy,
  Target,
  Zap,
  Shield,
  ArrowRight,
  Play,
  Quote,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"

import Stars from "@/components/Stars"
import { useEffect, useState } from "react"
import CalendlyPopup from "@/components/calendly-popup"
import { useDiscount } from "@/contexts/discount-context"

export default function HomePage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { coachingDiscount } = useDiscount()

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    if (discountPercentage === 0) return originalPrice
    const discount = originalPrice * (discountPercentage / 100)
    return Math.round(originalPrice - discount)
  }

  // Testimonials data
  const testimonials = [
    {
      name: "Jessica M.",
      role: "Marketing Executive",
      quote: "Lost 30 pounds and gained incredible strength. Daniel's tension reset techniques changed everything for me! The personalized approach made all the difference in my fitness journey."
    },
    {
      name: "Robert K.",
      role: "Software Engineer",
      quote: "Finally found a program that works with my busy schedule. The online coaching is incredibly effective and the recovery tools have been game-changing for my performance."
    },
    {
      name: "Amanda L.",
      role: "Physical Therapist",
      quote: "The MFRoller and tension reset course eliminated my chronic back pain. Life-changing results that I never thought possible with online training!"
    },
    {
      name: "Michael T.",
      role: "Firefighter",
      quote: "As a firefighter, I need to stay in peak condition. Daniel's programs have improved my strength, endurance, and recovery time significantly. The tension reset techniques are revolutionary!"
    },
    {
      name: "Sarah J.",
      role: "Nurse",
      quote: "Working 12-hour shifts as a nurse, I needed a flexible program. Daniel's online coaching fits perfectly into my schedule and has transformed my energy levels and overall health."
    },
    {
      name: "David R.",
      role: "Business Owner",
      quote: "At 45, I thought my best days were behind me. Daniel's programs proved me wrong. I'm stronger now than I was in my 20s, and the tension reset techniques have eliminated my chronic pain."
    }
  ]

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Preload Calendly script on page load
  useEffect(() => {
    // Check if script already exists
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-background">

             <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center h-full py-8 sm:py-12 md:py-16 lg:py-20">
            {/* Left Column - Text & CTA */}
                            <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-1">
              {/* Elite badge */}
                <div className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-black" />
                  <span>500+ Transformations Since 2020</span>
                  <Star className="w-5 h-5 text-black" />
              </div>

              {/* Main headline */}
                <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6">
                  <Image 
                    src="/logoAllLevels.png" 
                    alt="All Levels Athletics Logo" 
                    width={80} 
                    height={80} 
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                  />
                  <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight">
                    <span className="block text-foreground transition-all duration-500 ease-out hover:text-orange-400 hover:scale-105 transform cursor-default">ALL LEVELS</span>
                    <span className="block text-orange-500 transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-orange-500 hover:via-yellow-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent hover:drop-shadow-[0_0_20px_rgba(251,146,60,0.5)] hover:scale-105 transform cursor-default relative group">
                      ATHLETICS
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-sm scale-110"></div>
                    </span>
                  </h1>
                </div>
                  
                  {/* Enhanced Energy Drawing */}
                  <div className="flex items-center gap-4 relative justify-center lg:justify-start">
                    {/* Left energy line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-orange-500 rounded-full relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                    
                    {/* Central energy icon with enhanced effects */}
                    <div className="relative group">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-orange-500/50">
                        <Zap className="w-5 h-5 text-white transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
                      </div>
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 w-8 h-8 border-2 border-orange-500/30 rounded-full"></div>
                      <div className="absolute inset-0 w-8 h-8 border border-yellow-500/50 rounded-full"></div>
                      {/* Energy particles */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    </div>
                    
                    {/* Right energy line */}
                    <div className="w-24 h-1 bg-gradient-to-l from-transparent via-yellow-500 to-yellow-500 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-l from-yellow-400 via-orange-400 to-yellow-400"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
                    </div>
                </div>
              </div>

              {/* Description */}
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed">
                  Transform your body with{" "}
                    <span className="text-orange-500 font-semibold relative group cursor-default">
                      premium online personal training
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                    </span>
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm sm:text-base text-white">
                    <div className="flex items-center gap-3 group cursor-default">
                      <Target className="w-5 h-5 text-orange-500 flex-shrink-0 transition-all duration-300 ease-out group-hover:scale-105 group-hover:text-yellow-400 will-change-transform" />
                    <span>Revolutionary Tension Reset Techniques</span>
                  </div>
                    <div className="flex items-center gap-3 group cursor-default">
                      <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 transition-all duration-300 ease-out group-hover:scale-105 group-hover:text-orange-400 will-change-transform" />
                    <span>Professional Recovery Tools & Methods</span>
                  </div>
                    <div className="flex items-center gap-3 group cursor-default">
                      <Users className="w-5 h-5 text-orange-500 flex-shrink-0 transition-all duration-300 ease-out group-hover:scale-105 group-hover:text-yellow-400 will-change-transform" />
                    <span>500+ Success Stories & 98% Success Rate</span>
                  </div>
                </div>
              </div>

              {/* CTA section */}
                <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    size="lg"
                      className="bg-orange-500 text-white font-bold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 ease-out shadow-lg group hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => setIsCalendlyOpen(true)}
                  >
                    <span className="flex items-center gap-2 sm:gap-3">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      Book 15-Min Session
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>

                  <p className="text-white/60 text-xs sm:text-sm">
                     No credit card required • Cancel anytime • Join 500+ satisfied clients
                </p>
              </div>

            </div>

              {/* Right Column - Large Prominent Image */}
              <div className="order-2 lg:order-2 flex justify-center lg:justify-end items-center">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[4/5] lg:aspect-square">
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-3xl transform rotate-1 scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl transform -rotate-1 scale-105"></div>
                  
                  {/* Main image container */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 ease-out hover:scale-105">
                  <img
                    src="/athletic-person-gym.png"
                    alt="Professional athletic training"
                    className="w-full h-full object-cover"
                  />
                    
                    {/* Gradient overlay for better integration */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-transparent to-yellow-500/15"></div>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(251,146,60,0.1)]"></div>
                  
                  {/* Floating stats card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                          <div className="text-orange-500 font-bold text-lg">Daniel Ledbetter</div>
                          <div className="text-white/80 text-sm">Certified Personal Trainer</div>
                      </div>
                      <div className="text-right">
                          <div className="text-white font-bold text-xl">500+</div>
                          <div className="text-white/80 text-sm">Clients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gradient-bg-variant-a py-12 sm:py-16 md:py-20 lg:py-24" aria-labelledby="testimonials-heading">
        <div className="wave-pattern-a"></div>
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="testimonials-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Real <span className="text-amber-500">Success Stories</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl sm:max-w-3xl mx-auto">
              See how our clients transformed their lives with All Levels Athletics
            </p>
          </div>

          {/* Mobile Testimonials Carousel */}
          <div className="md:hidden relative w-full px-2 pb-12">
            <div className="relative overflow-hidden">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-black" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-black" />
              </button>

              {/* Testimonial Card */}
              <div className="px-10">
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/20 transition-all duration-500">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <Quote className="w-12 h-12 text-amber-500/40" />
                  </div>
                  
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    <Stars rating={5} />
                  </div>
                  
                  {/* Quote Text */}
                  <p className="text-lg leading-relaxed text-white/90 text-center mb-6 italic min-h-[180px] flex items-center justify-center">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  
                  {/* Divider */}
                  <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mx-auto mb-5"></div>
                  
                  {/* Author Info */}
                  <div className="text-center">
                    <div className="font-bold text-xl text-white mb-1">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-amber-400 font-medium">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "w-8 bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid with Manual Scrolling */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
            {/* Jessica M. Testimonial */}
            <figure 
              className="flex h-full flex-col rounded-2xl border border-amber-500/25 bg-neutral-900/60 p-6 md:p-8 backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(251,191,36,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/60 focus-visible:rounded-2xl"
              itemScope 
              itemType="https://schema.org/Review"
            >
              <div className="text-center mb-6">
                <div className="relative w-18 h-18 mx-auto mb-4">
                  <img
                    src="/smiling-fitness-woman-headshot.png"
                    alt="Jessica M. - Client Success Story"
                    className="w-full h-full object-cover rounded-full ring-2 ring-amber-400/40"
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  <Stars rating={5} />
                  <span className="sr-only">5 out of 5 stars</span>
                </div>
              </div>
              
              <blockquote className="flex-1">
                <div className="relative">
                  <div className="text-center mb-4">
                    <div className="font-semibold text-neutral-100" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">Jessica M.</span>
                    </div>
                    <div className="text-sm text-neutral-400" itemProp="reviewBody">
                      Marketing Executive
                    </div>
                    <meta itemProp="reviewRating" content="5" />
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/40 via-amber-400/30 to-transparent h-px w-full mb-6"></div>
                  <p className="text-lg md:text-xl leading-relaxed text-neutral-200 max-w-prose mx-auto">
                    "Lost 30 pounds and gained incredible strength. Daniel's tension reset techniques changed everything
                    for me! The personalized approach made all the difference in my fitness journey."
                  </p>
                </div>
              </blockquote>
            </figure>

            {/* Robert K. Testimonial */}
            <figure 
              className="flex h-full flex-col rounded-2xl border border-amber-500/25 bg-neutral-900/60 p-6 md:p-8 backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(251,191,36,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/60 focus-visible:rounded-2xl"
              itemScope 
              itemType="https://schema.org/Review"
            >
              <div className="text-center mb-6">
                <div className="relative w-18 h-18 mx-auto mb-4">
                  <img
                    src="/confident-man-athletic-wear-headshot.png"
                    alt="Robert K. - Client Success Story"
                    className="w-full h-full object-cover rounded-full ring-2 ring-amber-400/40"
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  <Stars rating={5} />
                  <span className="sr-only">5 out of 5 stars</span>
                </div>
              </div>
              
              <blockquote className="flex-1">
                <div className="relative">
                  <div className="text-center mb-4">
                    <div className="font-semibold text-neutral-100" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">Robert K.</span>
                    </div>
                    <div className="text-sm text-neutral-400" itemProp="reviewBody">
                      Software Engineer
                    </div>
                    <meta itemProp="reviewRating" content="5" />
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/40 via-amber-400/30 to-transparent h-px w-full mb-6"></div>
                  <p className="text-lg md:text-xl leading-relaxed text-neutral-200 max-w-prose mx-auto">
                    "Finally found a program that works with my busy schedule. The online coaching is incredibly
                    effective and the recovery tools have been game-changing for my performance."
                  </p>
                </div>
              </blockquote>
            </figure>

            {/* Amanda L. Testimonial */}
            <figure 
              className="flex h-full flex-col rounded-2xl border border-amber-500/25 bg-neutral-900/60 p-6 md:p-8 backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(251,191,36,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/60 focus-visible:rounded-2xl"
              itemScope 
              itemType="https://schema.org/Review"
            >
              <div className="text-center mb-6">
                <div className="relative w-18 h-18 mx-auto mb-4">
                  <img
                    src="/athletic-woman-headshot.png"
                    alt="Amanda L. - Client Success Story"
                    className="w-full h-full object-cover rounded-full ring-2 ring-amber-400/40"
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  <Stars rating={5} />
                  <span className="sr-only">5 out of 5 stars</span>
                </div>
              </div>
              
              <blockquote className="flex-1">
                <div className="relative">
                  <div className="text-center mb-4">
                    <div className="font-semibold text-neutral-100" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">Amanda L.</span>
                    </div>
                    <div className="text-sm text-neutral-400" itemProp="reviewBody">
                      Physical Therapist
                    </div>
                    <meta itemProp="reviewRating" content="5" />
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/40 via-amber-400/30 to-transparent h-px w-full mb-6"></div>
                  <p className="text-lg md:text-xl leading-relaxed text-neutral-200 max-w-prose mx-auto">
                    "The MFRoller and tension reset course eliminated my chronic back pain. Life-changing results
                    that I never thought possible with online training!"
                  </p>
                </div>
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      {/* ... existing services section ... */}
      <section id="services" className="py-12 sm:py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-20">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Premium <span className="gradient-text">Training Services</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8">
              Choose your path to peak performance with our tier-based coaching system
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-green-500/30 text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">7-Day Free Trial • No Credit Card Required</span>
            </div>
          </div>

          {/* ... existing service cards ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-6xl mx-auto mb-8 sm:mb-12 md:mb-16">
            {/* Starter Tier */}
            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm h-full flex flex-col max-w-[280px] sm:max-w-sm mx-auto w-full">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <Badge className="w-fit mx-auto mb-3 sm:mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30 text-sm sm:text-base px-2 sm:px-3 py-1 sm:py-1.5">
                  STARTER
                </Badge>
                <CardTitle className="font-heading text-xl sm:text-2xl mb-2 sm:mb-3">Foundation</CardTitle>
                <div className="space-y-1 mb-2 sm:mb-3">
                  {coachingDiscount > 0 ? (
                    <div className="space-y-1">
                      <div className="relative inline-block">
                        <div className="text-lg sm:text-xl text-muted-foreground opacity-60">$197</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-0.5 w-full bg-red-500 rotate-[-8deg]"></div>
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        ${calculateDiscountedPrice(197, coachingDiscount)}
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs flex items-center gap-1 w-fit mx-auto">
                        <Sparkles className="w-3 h-3" />
                        {coachingDiscount}% OFF
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-black gradient-text">$197</div>
                  )}
                  <CardDescription className="text-sm sm:text-base text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-sm sm:text-base">Perfect for beginners ready to start their fitness journey</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 flex flex-col flex-grow">
                <ul className="space-y-2 sm:space-y-3 flex-grow">
                    <li className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base">1x/month personalized check-ins</span>
                    </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Fully customized training program</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Email support & guidance</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Access to exercise library</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Nutrition guidelines</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Basic recovery guidance</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold text-base sm:text-lg py-4 sm:py-5 hover:scale-105 transition-all group-hover:shadow-2xl mt-auto"
                  onClick={() => window.location.href = '/services#services'}
                >
                  Start Foundation Program
                </Button>
              </CardContent>
            </Card>

            {/* Growth Tier - Most Popular */}
            <Card className="bg-card/80 border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange group relative backdrop-blur-sm scale-105 h-full flex flex-col max-w-[280px] sm:max-w-sm mx-auto w-full">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="gradient-orange-yellow text-black font-bold px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm shadow-2xl">
                    MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-6 sm:pt-8 flex-shrink-0">
                <Badge className="w-fit mx-auto mb-3 sm:mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                  GROWTH
                </Badge>
                <CardTitle className="font-heading text-lg sm:text-xl mb-2 sm:mb-3">Accelerated</CardTitle>
                <div className="space-y-1 mb-2 sm:mb-3">
                  {coachingDiscount > 0 ? (
                    <div className="space-y-1">
                      <div className="relative inline-block">
                        <div className="text-base sm:text-lg text-muted-foreground opacity-60">$297</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-0.5 w-full bg-red-500 rotate-[-8deg]"></div>
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        ${calculateDiscountedPrice(297, coachingDiscount)}
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs flex items-center gap-1 w-fit mx-auto">
                        <Sparkles className="w-3 h-3" />
                        {coachingDiscount}% OFF
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-black gradient-text">$297</div>
                  )}
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-xs sm:text-sm">Ideal for committed individuals seeking faster results</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 flex flex-col flex-grow">
                <ul className="space-y-2 sm:space-y-3 flex-grow">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">2x/month detailed check-ins</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Form review & video feedback</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Progressive training adjustments</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Priority email support</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Meal planning assistance</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Recovery optimization</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold text-base sm:text-lg py-4 sm:py-5 hover:scale-105 transition-all shadow-2xl mt-auto"
                  onClick={() => window.location.href = '/services#services'}
                >
                  Choose Growth Program
                </Button>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm h-full flex flex-col max-w-[280px] sm:max-w-sm mx-auto w-full">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <Badge className="w-fit mx-auto mb-3 sm:mb-4 bg-orange-600/20 text-orange-300 border-orange-600/30 text-sm sm:text-base px-2 sm:px-3 py-1 sm:py-1.5">
                  ELITE
                </Badge>
                <CardTitle className="font-heading text-xl sm:text-2xl mb-2 sm:mb-3">Premium</CardTitle>
                <div className="space-y-1 mb-2 sm:mb-3">
                  {coachingDiscount > 0 ? (
                    <div className="space-y-1">
                      <div className="relative inline-block">
                        <div className="text-lg sm:text-xl text-muted-foreground opacity-60">$497</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-0.5 w-full bg-red-500 rotate-[-8deg]"></div>
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        ${calculateDiscountedPrice(497, coachingDiscount)}
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs flex items-center gap-1 w-fit mx-auto">
                        <Sparkles className="w-3 h-3" />
                        {coachingDiscount}% OFF
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-black gradient-text">$497</div>
                  )}
                  <CardDescription className="text-sm sm:text-base text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-sm sm:text-base">Maximum support for serious athletes and professionals</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 flex flex-col flex-grow">
                <ul className="space-y-2 sm:space-y-3 flex-grow">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Weekly personalized check-ins</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Complete tension reset coaching</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Video analysis & technique review</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Mobility prioritization program</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">24/7 text support access</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Supplement recommendations</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold text-base sm:text-lg py-4 sm:py-5 hover:scale-105 transition-all group-hover:shadow-2xl mt-auto"
                  onClick={() => window.location.href = '/services#services'}
                >
                  Go Elite Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Service Comparison Table */}
          <div className="hidden md:block max-w-[280px] sm:max-w-6xl mx-auto mt-20 mb-16">
            <Card className="bg-card/80 border-2 border-orange-500/30 backdrop-blur-sm shadow-2xl rounded-2xl">
              <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Choose Your <span className="gradient-text">Perfect Plan</span>
                </CardTitle>
                  <CardDescription className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Compare our training tiers and find the perfect match for your fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur-sm z-10">
                      <tr className="border-b-2 border-orange-500/30">
                        <th className="py-6 px-6 text-base sm:text-lg md:text-xl font-bold text-left">Features</th>
                        <th className="py-6 px-6 text-center text-base sm:text-lg md:text-xl font-bold text-orange-400">Foundation</th>
                        <th className="py-6 px-6 text-center text-base sm:text-lg md:text-xl font-bold text-yellow-400">Growth</th>
                        <th className="py-6 px-6 text-center text-base sm:text-lg md:text-xl font-bold text-orange-300">Elite</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm sm:text-base md:text-lg">
                      <tr className="border-b border-border/30 hover:bg-orange-500/10 transition-all duration-200 group cursor-pointer">
                        <td className="py-5 px-6 font-semibold flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          Check-in Frequency
                        </td>
                        <td className="py-5 px-6 text-center font-medium group-hover:bg-orange-500/5 transition-colors">Monthly</td>
                        <td className="py-5 px-6 text-center font-medium bg-yellow-500/5 border-l border-r border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">Bi-weekly</td>
                        <td className="py-5 px-6 text-center font-medium group-hover:bg-orange-500/5 transition-colors">Weekly</td>
                      </tr>
                      <tr className="border-b border-border/30 hover:bg-orange-500/10 transition-all duration-200 group cursor-pointer">
                        <td className="py-5 px-6 font-semibold flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          Custom Training Program
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center bg-yellow-500/5 border-l border-r border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 hover:bg-orange-500/10 transition-all duration-200 group cursor-pointer">
                        <td className="py-5 px-6 font-semibold flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          Form Review & Feedback
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform" title="Not included">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center bg-yellow-500/5 border-l border-r border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 hover:bg-orange-500/10 transition-all duration-200 group cursor-pointer">
                        <td className="py-5 px-6 font-semibold flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          Tension Reset Coaching
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform" title="Not included">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center bg-yellow-500/5 border-l border-r border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform" title="Not included">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-orange-500/10 transition-all duration-200 group cursor-pointer">
                        <td className="py-5 px-6 font-semibold flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          24/7 Text Support
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform" title="Not included">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center bg-yellow-500/5 border-l border-r border-yellow-500/20 group-hover:bg-yellow-500/10 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500/20 rounded-full group-hover:scale-110 transition-transform" title="Not included">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center group-hover:bg-orange-500/5 transition-colors">
                          <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform" title="Included">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Why Choose All Levels Athletics Section */}
      <section className="relative py-16 sm:py-24 md:py-40 overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-yellow-500/15 to-orange-600/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10"></div>
        
        {/* Enhanced Animated Background Elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm mb-6 sm:mb-8 hover:scale-105 transition-transform text-sm sm:text-base md:text-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
              <span className="text-base sm:text-lg md:text-xl">500+ Success Stories</span>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Why Choose <span className="gradient-text">All Levels Athletics?</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover what sets us apart from other online fitness programs
            </p>
          </div>

          {/* Enhanced Features Grid - Two Rows */}
          <div className="max-w-6xl mx-auto">
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Feature Card 1 */}
              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-orange-400 transition-colors">Personalized Approach</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Every program is tailored specifically to your goals, fitness level, and lifestyle. No cookie-cutter solutions.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 2 */}
              <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-yellow-400 transition-colors">Proven Results</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Over 500 successful transformations with a 98% client satisfaction rate. Our methods work.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 3 */}
              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-orange-400 transition-colors">Expert Guidance</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Work directly with Daniel Ledbetter, a certified professional with over a decade of experience in helping Client's achieve their best Body Transformation.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {/* Feature Card 4 */}
              <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-yellow-400 transition-colors">Flexible Scheduling</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Train on your schedule with online coaching that fits your busy lifestyle. No gym required.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 5 */}
              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-orange-400 transition-colors">Ongoing Support</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Get continuous support and motivation throughout your journey. You're never alone in this process.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 6 */}
              <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                <CardContent className="text-center py-4 sm:py-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-yellow-400 transition-colors">Innovative Methods</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    Revolutionary tension reset techniques and cutting-edge recovery methods you won't find elsewhere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </section>

      {/* ... existing final CTA and footer sections remain unchanged ... */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                Ready to <span className="gradient-text">Transform?</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8">
                Book a 15-minute session with Daniel to discover your personalized path to peak performance
              </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center justify-center">

              <Card className="bg-card/80 border-2 border-orange-500/30 glow-orange backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-heading text-2xl sm:text-3xl mb-2">Start Your Journey</CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Join hundreds of satisfied clients who transformed their lives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 sm:space-y-8">
                  <div className="space-y-4">
                    <Button 
                      className="w-full gradient-orange-yellow text-black font-bold text-lg sm:text-xl py-6 sm:py-8 hover:scale-105 transition-all shadow-2xl group"
                      onClick={() => setIsCalendlyOpen(true)}
                    >
                      <span className="flex items-center gap-2 sm:gap-3">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                        Book 15-Min Session
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>

                    <div className="text-center space-y-3">
                        <div className="text-xs sm:text-sm text-muted-foreground"> No credit card required • Cancel anytime</div>
                        <div className="flex justify-center items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background overflow-hidden">
                            <Image
                              src="/person1.png"
                              alt="Client 1"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background overflow-hidden">
                            <Image
                              src="/person2.png"
                              alt="Client 2"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background overflow-hidden">
                            <Image
                              src="/person3.png"
                              alt="Client 3"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-white/70">
                          <span className="font-semibold text-white">500+</span> clients transformed
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 sm:pt-6">
                    <div className="text-center space-y-3">
                      <div className="text-base sm:text-lg font-semibold">Questions? We're here to help!</div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Button
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 border-orange-500 shadow-lg text-sm sm:text-base py-2 sm:py-3"
                          onClick={() => window.open('tel:+17605858832', '_self')}
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Call Now
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600 border-yellow-500 shadow-lg text-sm sm:text-base py-2 sm:py-3"
                          onClick={() => window.open('mailto:AllLevelsAthletics@gmail.com?subject=Question about All Levels Athletics&body=Hi Daniel,%0D%0A%0D%0AI have a question about your training services.%0D%0A%0D%0A', '_self')}
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Email Us
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Image Section */}
              <div className="relative group cursor-pointer h-full">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500 hover:shadow-orange-500/25 h-full">
                  <img
                    src="/tension-reset-coaching.png"
                    alt="Daniel Ledbetter Professional Training"
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-yellow-500/20 group-hover:from-orange-500/30 group-hover:to-yellow-500/30 transition-all duration-500"></div>
                  
                  {/* Interactive Floating Badge */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="bg-black/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-2 border-white/30 shadow-2xl group-hover:shadow-orange-500/25">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full gradient-orange-yellow flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm sm:text-base group-hover:text-orange-400 transition-colors">Daniel Ledbetter</div>
                          <div className="text-xs text-white/80 group-hover:text-white/90 transition-colors">Certified Trainer and Performance Coach</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Popup */}
      <CalendlyPopup 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  )
}
