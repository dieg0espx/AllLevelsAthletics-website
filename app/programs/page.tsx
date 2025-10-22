"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Target, Zap, Heart, Award, Calendar, Play, ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import CalendlyPopup from "@/components/calendly-popup"
import ProgramConfirmationDialog from "@/components/program-confirmation-dialog"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"

export default function ProgramsPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user } = useAuth()
  
  const totalSlides = 4
  const slideWidth = 400 + 24 // card width + gap

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

  const handleStartTransformation = () => {
    if (!user) {
      // User is not logged in, show auth modal
      setIsAuthModalOpen(true)
    } else {
      // User is logged in, show program dialog (free registration, no subscription required)
      setIsProgramDialogOpen(true)
    }
  }

  const scrollToSlide = (direction: 'prev' | 'next') => {
    if (!carouselRef.current) return
    
    let newSlide
    if (direction === 'next') {
      // Jump to the next section (1 slide at a time for mobile, 2 for desktop)
      if (currentSlide < 3) {
        newSlide = currentSlide + 1
      } else {
        return // Already at the end
      }
    } else {
      // Jump to the previous section (1 slide at a time for mobile, 2 for desktop)
      if (currentSlide > 0) {
        newSlide = currentSlide - 1
      } else {
        return // Already at the beginning
      }
    }
    
    setCurrentSlide(newSlide)
    carouselRef.current.scrollTo({
      left: newSlide * slideWidth,
      behavior: 'smooth'
    })
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollToSlide('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollToSlide('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-40 sm:pt-44 md:pt-48 lg:pt-52 pb-24 sm:pb-28 md:pb-32 lg:pb-36 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/daniel/Photo Mar 05 2025, 6 13 10 PM.jpg"
            alt="Athletic training background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
        </div>
        {/* Enhanced background with depth and overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.2),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight">
              <span className="block text-white mb-2 sm:mb-3">Specialized Programs for</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Every Goal</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              From foundational movement patterns to elite performance training, discover the perfect program to match
              your current level and ambitious goals. Every program includes our revolutionary tension reset methodology.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full transition-all duration-300 ease-out shadow-xl group hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => window.location.href = '/programs#featured-programs'}
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                  View All Programs
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-orange-500/50 text-orange-400 font-semibold text-sm sm:text-base px-3 sm:px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-full transition-all duration-300 ease-out hover:bg-orange-500/10 hover:border-orange-500/70 hover:text-orange-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setIsCalendlyOpen(true)}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Consultation
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section id="featured-programs" className="py-20 bg-card/30 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Runner's Tension Score <span className="gradient-text">Program</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our most popular and effective training program designed to transform your fitness journey
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Hero Section with Enhanced Design */}
            <div className="relative bg-gradient-to-br from-orange-500/20 via-yellow-500/10 to-orange-500/20 rounded-3xl p-8 md:p-12 mb-12 border-2 border-orange-500/30 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                      <Target className="w-4 h-4" />
                      FREE PROGRAM
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      Comprehensive Tension Release & Performance Enhancement
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-orange-200 leading-relaxed">
                      Transform your running performance through our scientifically-backed methodology that addresses the root causes of tension and movement limitations.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-orange-300">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">All fitness levels</span>
                    </div>
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    <div className="flex items-center gap-2 text-orange-300">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold">Runners & athletes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="gradient-orange-yellow text-black font-bold hover:scale-105 transition-all text-lg px-8 py-4 rounded-xl w-full"
                      onClick={handleStartTransformation}
                    >
                      Start Your Transformation
                    </Button>
                    <p className="text-center text-green-400 font-semibold text-sm">
                      ✓ Free program - No subscription required
                    </p>
                    <p className="text-center text-muted-foreground text-sm mt-2">
                      Sign up for a free account to gain access to this Program!
                    </p>
                  </div>
                </div>
                
                {/* Right Side - Image */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="/daniel/Photo Feb 16 2025, 12 13 35 PM.jpg"
                      alt="Runner's Tension Score Program"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center shadow-lg">
                        <Target className="w-8 h-8 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-1 sm:mb-2 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                <h4 className="font-heading text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Tension Release</h4>
                <p className="text-white/80 leading-relaxed text-xs sm:text-sm lg:text-base">Increase work capacity through targeted tension release techniques that unlock your body's potential</p>
              </Card>

              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-1 sm:mb-2 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                <h4 className="font-heading text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Stretching</h4>
                <p className="text-white/80 leading-relaxed text-xs sm:text-sm lg:text-base">Improve range of motion (ROM) with progressive stretching protocols designed for runners</p>
              </Card>

              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-1 sm:mb-2 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                <h4 className="font-heading text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Activation</h4>
                <p className="text-white/80 leading-relaxed text-xs sm:text-sm lg:text-base">Wake up weak muscles with targeted activation exercises that restore proper function</p>
              </Card>

              <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-orange-yellow mx-auto mb-1 sm:mb-2 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                <h4 className="font-heading text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Compound Reintegration</h4>
                <p className="text-white/80 leading-relaxed text-xs sm:text-sm lg:text-base">Connect muscles together and scale strength to prevent reinjury and optimize performance</p>
              </Card>
            </div>


            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-8 border-2 border-orange-500/30">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-green-400/20 text-green-300 px-4 py-2 rounded-full text-sm font-semibold border border-green-400/30">
                    <CheckCircle className="w-4 h-4" />
                    Limited-time free access
                  </div>
                </div>
                <h4 className="font-heading text-2xl font-bold mb-4 text-white">Ready to Unlock Your Best Self?</h4>
                <p className="text-orange-200 mb-6 max-w-2xl mx-auto">
                  Schedule a free 15-minute session with Daniel and map out your personalized path to peak performance.
                </p>
                <Button 
                  className="gradient-orange-yellow text-black font-bold hover:scale-105 transition-all text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 rounded-xl w-full sm:w-auto"
                  onClick={() => {
                    console.log('Button clicked, opening Calendly popup')
                    setIsCalendlyOpen(true)
                  }}
                >
                  Book My 15-Min Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section id="programs" className="py-20 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Program <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect program category for your specific goals and experience level
            </p>
            {/* Scroll Instructions */}
            <div className="mt-4 text-sm text-muted-foreground/70">
              <span className="inline-flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                Scroll or use arrow keys to navigate
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={() => scrollToSlide('prev')}
              disabled={currentSlide === 0}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>
            
            <button
              onClick={() => scrollToSlide('next')}
              disabled={currentSlide >= 3}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>

            {/* Carousel Container - Fixed for mobile */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-4 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing scrollbar-hide"
            >
              <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[90%] sm:min-w-[85%] md:min-w-[400px] snap-center flex flex-col rounded-2xl">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Target className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-xl sm:text-2xl">Strength & Conditioning</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Build power, endurance, and resilience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400 text-sm sm:text-base">Beginner Programs</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Foundation Builder (6 weeks)</li>
                        <li>• Bodyweight Basics (4 weeks)</li>
                        <li>• Movement Fundamentals (8 weeks)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Advanced Programs</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Elite Strength (12 weeks)</li>
                        <li>• Power Development (10 weeks)</li>
                        <li>• Competition Prep (16 weeks)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[85%] sm:min-w-[400px] snap-center flex flex-col rounded-2xl">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Heart className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-xl sm:text-2xl">Recovery & Mobility</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Restore function and prevent injury</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400 text-sm sm:text-base">Recovery Programs</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Tension Reset (30 days)</li>
                        <li>• Active Recovery (4 weeks)</li>
                        <li>• Sleep Optimization (6 weeks)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Mobility Programs</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Daily Mobility (ongoing)</li>
                        <li>• Desk Worker Relief (8 weeks)</li>
                        <li>• Athletic Flexibility (12 weeks)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[85%] sm:min-w-[400px] snap-center flex flex-col rounded-2xl">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-xl sm:text-2xl">Sport-Specific Training</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Tailored for your sport or activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400 text-sm sm:text-base">Team Sports</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Basketball Performance</li>
                        <li>• Soccer Conditioning</li>
                        <li>• Football Strength</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Individual Sports</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Running Performance</li>
                        <li>• Tennis Agility</li>
                        <li>• Golf Mobility</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[85%] sm:min-w-[400px] snap-center flex flex-col rounded-2xl">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-xl sm:text-2xl">Specialized Programs</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Unique approaches for specific needs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400 text-sm sm:text-base">Age-Specific</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Youth Athletics (13-18)</li>
                        <li>• Masters Training (50+)</li>
                        <li>• Senior Fitness (65+)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Lifestyle-Based</h4>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li>• Busy Professional</li>
                        <li>• New Parent Fitness</li>
                        <li>• Travel Warrior</li>
                      </ul>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>


          </div>
        </div>
      </section>

      {/* Virtual Classes - Consistent styling for all three - COMMENTED OUT */}
      {/* <section className="py-20 bg-gradient-to-br from-orange-500/5 via-yellow-500/3 to-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="gradient-orange-yellow text-black font-bold mb-4">
              Live & On-Demand
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Virtual <span className="gradient-text">Classes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join live virtual classes and connect with the All Levels Athletics community
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-muted hover:border-orange-500/50 transition-all overflow-hidden group">
              <div className="flex flex-col lg:flex-row">
                <div className="relative lg:w-1/2 h-48 sm:h-80">
                  <img
                    src="/womanexcercising3.jpg"
                    alt="Morning Movement Class"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      7:00 AM PST
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <CardTitle className="font-heading text-2xl sm:text-3xl mb-2">Morning Movement</CardTitle>
                    <CardDescription className="text-base sm:text-lg">Start your day with energy and focus</CardDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">30 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">All levels</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Dynamic warm-up, mobility work, and energizing movements to kickstart your day.
                  </p>
                  <Button 
                    className="w-full gradient-orange-yellow text-black font-bold py-3 hover:scale-105 transition-all"
                    onClick={() => window.location.href = '/contact#contact-form'}
                  >
                    Join Live Class
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-muted hover:border-orange-500/50 transition-all group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/manexercising4.jpg"
                    alt="Strength Fundamentals Class"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white">
                       ON-DEMAND
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <CardTitle className="font-heading text-2xl mb-2">Strength Fundamentals</CardTitle>
                  <CardDescription className="mb-4">Build a solid foundation of strength</CardDescription>
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      45 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-orange-500" />
                      Beginner
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn proper form and technique for fundamental strength movements.
                  </p>
                  <Button 
                    className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all"
                    onClick={() => window.location.href = '/contact#contact-form'}
                  >
                    Start Class
                  </Button>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-muted hover:border-orange-500/50 transition-all group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/womanexcercising4.jpg"
                    alt="Elite Performance Class"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white font-bold">
                       PREMIUM
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <CardTitle className="font-heading text-2xl mb-2">Elite Performance</CardTitle>
                  <CardDescription className="mb-4">Advanced training for serious athletes</CardDescription>
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      60 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-orange-500" />
                      Advanced
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    High-intensity training session with personalized coaching and feedback.
                  </p>
                  <Button 
                    className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all"
                    onClick={() => window.location.href = '/contact#contact-form'}
                  >
                    Join Premium Class
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section> */}

      {/* Program Benefits - Enhanced for mobile */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Our <span className="gradient-text">Programs?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Every program is built on proven principles and personalized to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Personalized Approach */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-3 sm:p-4 lg:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-1 sm:mb-2 lg:mb-3">Personalized Approach</h3>
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">
                  Every program is customized to your goals, experience level, and available time.
                </p>
                <div className="mt-auto pt-1 sm:pt-2 lg:pt-3 border-t border-orange-500/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Tailored Programs</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Proven Results */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-3 sm:p-4 lg:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-1 sm:mb-2 lg:mb-3">
                  <span className="block lg:hidden">Proven Results</span>
                  <span className="hidden lg:block">
                    <span className="block">Proven</span>
                    <span className="block">Results</span>
                  </span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">
                  Based on methods that have transformed 500+ athletes across all levels.
                </p>
                <div className="mt-auto pt-1 sm:pt-2 lg:pt-3 border-t border-yellow-500/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Track Record</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Expert Guidance */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-3 sm:p-4 lg:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-1 sm:mb-2 lg:mb-3">
                  <span className="block lg:hidden">Expert Guidance</span>
                  <span className="hidden lg:block">
                    <span className="block">Expert</span>
                    <span className="block">Guidance</span>
                  </span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">
                  Direct access to professional coaching and ongoing support throughout your journey.
                </p>
                <div className="mt-auto pt-1 sm:pt-2 lg:pt-3 border-t border-orange-500/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Professional Support</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progressive System */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-3 sm:p-4 lg:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-1 sm:mb-2 lg:mb-3">Progressive System</h3>
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">
                  Structured progression that adapts as you grow stronger and more capable.
                </p>
                <div className="mt-auto pt-1 sm:pt-2 lg:pt-3 border-t border-yellow-500/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Adaptive Training</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced for mobile */}
      <section className="gradient-bg-variant-a py-20 overflow-hidden">
        <div className="wave-pattern-a"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Ready to Transform Your <span className="gradient-text">Training?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Book a 15-minute session with Daniel to discover your personalized path to peak performance.
            </p>
            
            {/* Enhanced buttons with better mobile styling */}
            <div className="flex justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 sm:px-10 py-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 w-full sm:w-auto"
                onClick={() => {
                  console.log('CTA Button clicked, opening Calendly popup')
                  setIsCalendlyOpen(true)
                }}
              >
                <span className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  Book 15-Min Session
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Popup */}
      <CalendlyPopup 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />

      {/* Program Confirmation Dialog */}
      <ProgramConfirmationDialog
        isOpen={isProgramDialogOpen}
        onClose={() => setIsProgramDialogOpen(false)}
        onConfirm={() => setIsProgramDialogOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo="/programs"
      />
    </div>
  )
}

