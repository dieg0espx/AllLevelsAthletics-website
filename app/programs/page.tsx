"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Target, Zap, Heart, Award, Calendar, Play, ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function ProgramsPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const totalSlides = 4
  const slideWidth = 400 + 24 // card width + gap

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

      {/* Enhanced Hero Section with More Space */}
      <section className="relative overflow-hidden pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-24 sm:pb-32 md:pb-40 lg:pb-48 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image with enhanced overlay */}
        <div className="absolute inset-0">
          <img
            src="/manexercising.jpg"
            alt="Athletic training background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Enhanced background with multiple layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-transparent to-orange-500/25"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_70%)]"></div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Enhanced Main Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight tracking-tight">
              <span className="block text-white mb-4 sm:mb-6">Specialized Programs for</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,146,60,0.4)] animate-pulse">
                Every Goal
              </span>
            </h1>
            
            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12 sm:mb-16 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed">
              From foundational movement patterns to elite performance training, discover the perfect program to match
              your current level and ambitious goals.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg sm:text-xl px-10 sm:px-12 py-6 sm:py-8 rounded-full transition-all duration-300 ease-out shadow-2xl group hover:shadow-3xl hover:shadow-orange-500/30 hover:-translate-y-2 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => window.location.href = '/programs#featured-programs'}
              >
                <span className="flex items-center gap-3">
                  <Target className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  View All Programs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-3 border-orange-500/60 text-orange-300 font-semibold text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-8 rounded-full transition-all duration-300 ease-out hover:bg-orange-500/15 hover:border-orange-500/80 hover:text-orange-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background backdrop-blur-sm"
                onClick={() => window.location.href = '/contact#contact-form'}
              >
                <span className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
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
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Featured <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our most popular and effective training programs designed to transform your fitness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange relative overflow-hidden group hover:scale-105 p-0 backdrop-blur-sm shadow-xl hover:shadow-2xl mb-8">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img
                  src="/womanexcercising.jpg"
                  alt="Total Body Transformation"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-6 h-6 text-black" />
                  </div>
                </div>
                {/* Enhanced overlay with program type badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    MOST POPULAR
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CardTitle className="font-heading text-2xl group-hover:text-orange-400 transition-colors">Total Body Transformation</CardTitle>
                <CardDescription className="text-orange-300">12-Week Complete Overhaul Program</CardDescription>
              </div>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">12 weeks • 4-5 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">All fitness levels</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Full body strength & conditioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Tension reset protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Nutrition guidance included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Progress tracking system</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all mb-4"
                  onClick={() => window.location.href = '/contact#contact-form'}
                >
                  Start Program
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange overflow-hidden group hover:scale-105 p-0 backdrop-blur-sm shadow-xl hover:shadow-2xl mb-8">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img
                  src="/manexercising3.jpg"
                  alt="Athletic Performance"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                </div>
                {/* Enhanced overlay with program type badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    ELITE
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CardTitle className="font-heading text-2xl group-hover:text-yellow-400 transition-colors">Athletic Performance</CardTitle>
                <CardDescription className="text-yellow-300">Elite Sports Performance Enhancement</CardDescription>
              </div>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">16 weeks • 5-6 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Intermediate to advanced</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Sport-specific training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Power & explosiveness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Injury prevention protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Recovery optimization</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all mb-4"
                  onClick={() => window.location.href = '/contact#contact-form'}
                >
                  Start Program
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow overflow-hidden group hover:scale-105 p-0 backdrop-blur-sm shadow-xl hover:shadow-2xl mb-8">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img
                  src="/womanexcercising2.jpg"
                  alt="Movement Restoration"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Heart className="w-6 h-6 text-black" />
                  </div>
                </div>
                {/* Enhanced overlay with program type badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    RECOVERY
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CardTitle className="font-heading text-2xl group-hover:text-orange-400 transition-colors">Movement Restoration</CardTitle>
                <CardDescription className="text-orange-300">Injury Recovery & Pain Relief</CardDescription>
              </div>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">8 weeks • 3-4 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">All levels • Injury recovery</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Pain reduction techniques</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Mobility restoration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Corrective exercises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Gradual strength building</span>
                  </li>
                </ul>
                <Button 
                  className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all mb-4"
                  onClick={() => window.location.href = '/contact#contact-form'}
                >
                  Start Program
                </Button>
              </CardContent>
            </Card>
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
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Program <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>
            
            <button
              onClick={() => scrollToSlide('next')}
              disabled={currentSlide >= 3}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>

            {/* Carousel Container - Fixed for mobile */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing scrollbar-hide"
            >
              <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[280px] sm:min-w-[400px] snap-start flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Target className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-2xl">Strength & Conditioning</CardTitle>
                      <CardDescription>Build power, endurance, and resilience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400">Beginner Programs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Foundation Builder (6 weeks)</li>
                        <li>• Bodyweight Basics (4 weeks)</li>
                        <li>• Movement Fundamentals (8 weeks)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400">Advanced Programs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Elite Strength (12 weeks)</li>
                        <li>• Power Development (10 weeks)</li>
                        <li>• Competition Prep (16 weeks)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[280px] sm:min-w-[400px] snap-start flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Heart className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-2xl">Recovery & Mobility</CardTitle>
                      <CardDescription>Restore function and prevent injury</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400">Recovery Programs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Tension Reset (30 days)</li>
                        <li>• Active Recovery (4 weeks)</li>
                        <li>• Sleep Optimization (6 weeks)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400">Mobility Programs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Daily Mobility (ongoing)</li>
                        <li>• Desk Worker Relief (8 weeks)</li>
                        <li>• Athletic Flexibility (12 weeks)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[280px] sm:min-w-[400px] snap-start flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-2xl">Sport-Specific Training</CardTitle>
                      <CardDescription>Tailored for your sport or activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400">Team Sports</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Basketball Performance</li>
                        <li>• Soccer Conditioning</li>
                        <li>• Football Strength</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400">Individual Sports</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Running Performance</li>
                        <li>• Tennis Agility</li>
                        <li>• Golf Mobility</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow backdrop-blur-sm shadow-xl hover:shadow-2xl min-w-[280px] sm:min-w-[400px] snap-start flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-black" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="font-heading text-2xl">Specialized Programs</CardTitle>
                      <CardDescription>Unique approaches for specific needs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-400">Age-Specific</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Youth Athletics (13-18)</li>
                        <li>• Masters Training (50+)</li>
                        <li>• Senior Fitness (65+)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-400">Lifestyle-Based</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
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

      {/* Virtual Classes - Consistent styling for all three */}
      <section className="py-20 bg-gradient-to-br from-orange-500/5 via-yellow-500/3 to-orange-500/5">
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
            {/* Live Class - Full Width */}
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

            {/* On-Demand Classes - Side by Side with consistent styling */}
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
      </section>

      {/* Program Benefits - Enhanced for mobile */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Why Choose Our <span className="gradient-text">Programs?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every program is built on proven principles and personalized to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Personalized Approach */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-3 sm:mb-4">Personalized Approach</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Every program is customized to your goals, experience level, and available time.
                </p>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-orange-500/20">
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
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-3 sm:mb-4">
                  Proven Results
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Based on methods that have transformed 500+ athletes across all levels.
                </p>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-yellow-500/20">
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
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-3 sm:mb-4">
                  Expert Guidance
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Direct access to professional coaching and ongoing support throughout your journey.
                </p>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-orange-500/20">
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
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-full flex flex-col p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-3 sm:mb-4">Progressive System</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Structured progression that adapts as you grow stronger and more capable.
                </p>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-yellow-500/20">
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
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Ready to Find Your <span className="gradient-text">Perfect Program?</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Take our quick assessment to discover which program will help you achieve your goals fastest.
            </p>
            
            {/* Enhanced buttons with better mobile styling */}
            <div className="flex justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 sm:px-10 py-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 w-full sm:w-auto"
                onClick={() => window.location.href = '/contact#contact-form'}
              >
                <span className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  Start 7-Day Trial
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
