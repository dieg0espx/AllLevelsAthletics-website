"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle, Globe, Users, Zap, ChevronLeft, ChevronRight, Instagram, Music } from "lucide-react"
import { useEffect, useState } from "react"
import CalendlyPopup from "@/components/calendly-popup"

export default function ContactPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  // Preload Calendly script and CSS on page load for inline widget
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Load Calendly CSS
    const existingCSS = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')
    if (!existingCSS) {
      const link = document.createElement('link')
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }

    // Load Calendly script
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => {
        // Initialize inline widget after script loads
        if ((window as any).Calendly) {
          console.log('Calendly script loaded and ready for inline widget')
          // Initialize the inline widget
          setTimeout(() => {
            if ((window as any).Calendly) {
              try {
                (window as any).Calendly.initInlineWidget({
                  url: 'https://calendly.com/alllevelsathletics/fitnessconsultation?back=1&month=2025-09',
                  parentElement: document.querySelector('.calendly-inline-widget'),
                  prefill: {},
                  utm: {}
                })
                console.log('Inline Calendly widget initialized')
              } catch (error) {
                console.error('Error initializing inline Calendly widget:', error)
              }
            }
          }, 500)
        }
      }
      document.head.appendChild(script)
    } else {
      // Script already exists, check if Calendly is ready
      if ((window as any).Calendly) {
        console.log('Calendly already available for inline widget')
        // Initialize the inline widget
        setTimeout(() => {
          try {
            (window as any).Calendly.initInlineWidget({
              url: 'https://calendly.com/alllevelsathletics/fitnessconsultation?back=1&month=2025-09',
              parentElement: document.querySelector('.calendly-inline-widget'),
              prefill: {},
              utm: {}
            })
            console.log('Inline Calendly widget initialized')
          } catch (error) {
            console.error('Error initializing inline Calendly widget:', error)
          }
        }, 500)
      }
    }
  }, [])

  // Function to handle phone calls
  const handlePhoneCall = () => {
    window.location.href = 'tel:760-585-8832'
  }

  // Function to handle email
  const handleEmail = () => {
    window.location.href = 'mailto:AllLevelsAthletics@gmail.com'
  }

  // Function to open Calendly
  const openCalendly = () => {
    window.open('https://calendly.com/alllevelsathletics/fitnessconsultation?back=1&month=2025-09', '_blank')
  }

  // Function to scroll to multiple ways to connect section
  const scrollToConnectSection = () => {
    const element = document.querySelector('section:nth-of-type(2)') // The "Multiple Ways to Connect" section
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Function to handle Instagram
  const handleInstagram = () => {
    window.open('https://www.instagram.com/alllevelsathletics?igsh=bWczNm0xNjl6ZjBy', '_blank')
  }

  // Function to handle TikTok
  const handleTikTok = () => {
    window.open('https://www.tiktok.com/@AllLevelsAthletics', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-40 sm:pt-44 md:pt-48 lg:pt-52 pb-24 sm:pb-28 md:pb-32 lg:pb-36 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/daniel/Photo Feb 16 2025, 12 34 05 PM.jpg"
            alt="Athletic training background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Enhanced background with depth and overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.2),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
             <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight">
               <span className="block text-white mb-2 sm:mb-4">Ready to Start Your</span>
               <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Transformation?</span>
             </h1>
             <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
               Whether you have questions about our programs, want to schedule a consultation, or are ready to begin your
               fitness journey, we're here to help you every step of the way.
             </p>
             
             {/* Enhanced CTA Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={scrollToConnectSection}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ease-out shadow-xl group hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Call Now
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsCalendlyOpen(true)}
                className="w-full sm:w-auto border-2 border-orange-500/50 text-orange-400 font-semibold text-base px-6 py-4 rounded-full transition-all duration-300 ease-out hover:bg-orange-500/10 hover:border-orange-500/70 hover:text-orange-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

      {/* Contact Methods - Enhanced for mobile */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
              Multiple Ways to <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              Choose the method that works best for you - we're available when you need us
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Call or Text Card */}
            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 group backdrop-blur-sm h-full flex flex-col p-4 sm:p-5 lg:p-6 xl:p-8">
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg flex-shrink-0 ring-2 ring-orange-500/20">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base sm:text-lg lg:text-xl xl:text-2xl text-white mb-1 sm:mb-2 font-bold">Call or Text</h3>
                </div>
              </div>
              <div className="w-full mb-3 sm:mb-4 lg:mb-5 xl:mb-6 flex-1">
                <p className="text-orange-300 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 opacity-90">Direct line to Daniel</p>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold gradient-text tracking-wide">760-585-8832</div>
              </div>
              <div className="mt-auto pt-2 sm:pt-3 lg:pt-4 border-t border-orange-500/20">
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 xl:mb-5 text-xs sm:text-sm lg:text-base">
                    PST time zone, Available early mornings, evenings, or weekends for consultations
                  </p>
                <Button 
                  onClick={handlePhoneCall}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-2 sm:py-2.5 lg:py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 text-xs sm:text-sm lg:text-base touch-manipulation"
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    Call Now
                  </span>
                </Button>
              </div>
            </Card>

            {/* Email Card */}
            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group backdrop-blur-sm h-full flex flex-col p-4 sm:p-5 lg:p-6 xl:p-8">
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg flex-shrink-0 ring-2 ring-yellow-500/20">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base sm:text-lg lg:text-xl xl:text-2xl text-white mb-1 sm:mb-2 font-bold">Email</h3>
                </div>
              </div>
              <div className="w-full mb-3 sm:mb-4 lg:mb-5 xl:mb-6 flex-1">
                <p className="text-yellow-300 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 opacity-90">Detailed inquiries welcome</p>
                <div className="text-xs sm:text-sm lg:text-base font-bold gradient-text tracking-wide break-words">AllLevelsAthletics@gmail.com</div>
              </div>
              <div className="mt-auto pt-2 sm:pt-3 lg:pt-4 border-t border-yellow-500/20">
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 xl:mb-5 text-xs sm:text-sm lg:text-base">
                    Response within 24-48 hours
                  </p>
                <Button 
                  onClick={handleEmail}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-2 sm:py-2.5 lg:py-3 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 border-2 border-yellow-400/20 text-xs sm:text-sm lg:text-base touch-manipulation"
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    Send Email
                  </span>
                </Button>
              </div>
            </Card>

            {/* Schedule Card */}
            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 group backdrop-blur-sm h-full flex flex-col p-4 sm:p-5 lg:p-6 xl:p-8">
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg flex-shrink-0 ring-2 ring-orange-500/20">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base sm:text-lg lg:text-xl xl:text-2xl text-white mb-1 sm:mb-2 font-bold">Schedule</h3>
                </div>
              </div>
              <div className="w-full mb-3 sm:mb-4 lg:mb-5 xl:mb-6 flex-1">
                <p className="text-orange-300 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 opacity-90">Book your consultation</p>
                <div className="text-sm sm:text-base lg:text-lg font-bold gradient-text tracking-wide">Free Consultation</div>
              </div>
              <div className="mt-auto pt-2 sm:pt-3 lg:pt-4 border-t border-orange-500/20">
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 xl:mb-5 text-xs sm:text-sm lg:text-base">
                    48-hour advance booking required
                  </p>
                <Button 
                  onClick={() => setIsCalendlyOpen(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-2 sm:py-2.5 lg:py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 text-xs sm:text-sm lg:text-base touch-manipulation"
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    Book Now
                  </span>
                </Button>
              </div>
            </Card>

            {/* Social Media Card */}
            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group backdrop-blur-sm h-full flex flex-col p-4 sm:p-5 lg:p-6 xl:p-8">
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg flex-shrink-0 ring-2 ring-yellow-500/20">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base sm:text-lg lg:text-xl xl:text-2xl text-white mb-1 sm:mb-2 font-bold">Social Media</h3>
                </div>
              </div>
              <div className="w-full mb-3 sm:mb-4 lg:mb-5 xl:mb-6 flex-1">
                <p className="text-yellow-300 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 opacity-90">Follow our journey</p>
                <div className="text-xs sm:text-sm lg:text-base font-bold gradient-text tracking-wide">@AllLevelsAthletics</div>
              </div>
              <div className="mt-auto pt-2 sm:pt-3 lg:pt-4 border-t border-yellow-500/20">
                <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 lg:mb-4 xl:mb-5 text-xs sm:text-sm lg:text-base">
                    TikTok & Instagram updates
                  </p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <Button 
                    onClick={handleInstagram}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-2 sm:py-2.5 lg:py-3 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 border-2 border-yellow-400/20 text-xs sm:text-sm lg:text-base touch-manipulation"
                  >
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                      Instagram
                    </span>
                  </Button>
                  <Button 
                    onClick={handleTikTok}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-2 sm:py-2.5 lg:py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 text-xs sm:text-sm lg:text-base touch-manipulation"
                  >
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                      TikTok
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Area & Availability - Enhanced for mobile */}
          <section className="py-20 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10 relative overflow-hidden">
                         {/* Background Elements */}
             <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl"></div>
           
           <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <Badge className="gradient-orange-yellow text-black font-bold mb-4 sm:mb-6 text-base sm:text-lg px-4 sm:px-6 py-2">
                 Global Reach
               </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                 Service Area & <span className="gradient-text">Availability</span>
               </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl sm:max-w-4xl mx-auto leading-relaxed">
                 From California to worldwide - we bring elite training to dedicated athletes everywhere
               </p>
             </div>

                                                       {/* Main Content Grid */}
               <div className="max-w-7xl mx-auto">
               {/* Top Row - Stats & Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                 <div className="text-center group">
                   <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">50 States</h3>
                <p className="text-orange-300 text-base sm:text-lg">Nationwide Coverage</p>
                 </div>
                 
                 <div className="text-center group">
                   <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">All Day</h3>
                <p className="text-yellow-300 text-base sm:text-lg">Always Available</p>
                 </div>
                 
                 <div className="text-center group col-span-2 sm:col-span-1">
                   <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">500+</h3>
                <p className="text-orange-300 text-base sm:text-lg">Athletes Served</p>
                 </div>
               </div>

               {/* Bottom Row - Interactive Gallery & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                 {/* Left - Interactive Training Gallery */}
              <div className="space-y-4 sm:space-y-6">
                   <div className="text-center lg:text-left">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Training Gallery</h3>
                  <p className="text-muted-foreground text-base sm:text-lg">See our programs in action</p>
                   </div>
                   
                                                                                                                                                                                                                                                                                                                               {/* Modern Carousel */}
                       <div className="relative group">
                  <div className="relative h-[300px] sm:h-[400px] lg:h-[540px] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                       {/* Main Image */}
                       <div className="relative h-full">
                         <img
                           src="/daniel/Photo Feb 16 2025, 12 15 03 PM.jpg"
                           alt="Total Body Transformation"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 0 ? 1 : 0,
                             transform: currentSlide === 0 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/daniel/Photo Apr 11 2021, 3 21 12 PM.jpg"
                           alt="Athletic Performance"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 1 ? 1 : 0,
                             transform: currentSlide === 1 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/daniel/Photo May 19 2020, 9 46 42 PM.jpg"
                           alt="Movement Restoration"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 2 ? 1 : 0,
                             transform: currentSlide === 2 ? 'scale(1.05)' : 'scale(1)',
                             objectPosition: 'center 30%'
                           }}
                         />
                         <img
                           src="/daniel/Photo Sep 20 2024, 5 35 42 PM.jpg"
                           alt="Strength Fundamentals"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 3 ? 1 : 0,
                             transform: currentSlide === 3 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/daniel/Photo Oct 10 2024, 3 07 48 PM.jpg"
                           alt="Morning Movement"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 4 ? 1 : 0,
                             transform: currentSlide === 4 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                       </div>
                       
                       {/* Gradient Overlay */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                       
                       {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                         <div className="text-white">
                        <h4 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                             {currentSlide === 0 && "Total Body Transformation"}
                             {currentSlide === 1 && "Athletic Performance"}
                             {currentSlide === 2 && "Movement Restoration"}
                             {currentSlide === 3 && "Strength Fundamentals"}
                             {currentSlide === 4 && "Morning Movement"}
                           </h4>
                        <p className="text-orange-300 text-sm sm:text-base lg:text-lg">
                             {currentSlide === 0 && "Comprehensive strength & conditioning"}
                             {currentSlide === 1 && "Elite sports performance enhancement"}
                             {currentSlide === 2 && "Injury recovery & pain relief"}
                             {currentSlide === 3 && "Build a solid foundation"}
                             {currentSlide === 4 && "Start your day energized"}
                           </p>
                         </div>
                       </div>
                       
                       {/* Navigation */}
                       <button
                         onClick={() => setCurrentSlide((prev) => (prev === 0 ? 4 : prev - 1))}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all group opacity-0 group-hover:opacity-100"
                       >
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-orange-400 transition-colors" />
                       </button>
                       
                       <button
                         onClick={() => setCurrentSlide((prev) => (prev === 4 ? 0 : prev + 1))}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all group opacity-0 group-hover:opacity-100"
                       >
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-orange-400 transition-colors" />
                       </button>
                     </div>
                     
                     {/* Thumbnail Navigation */}
                  <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                       {Array.from({ length: 5 }, (_, index) => (
                         <button
                           key={index}
                           onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                             currentSlide === index
                               ? 'bg-orange-500 scale-125 shadow-lg shadow-orange-500/50' 
                               : 'bg-white/30 hover:bg-white/50'
                           }`}
                         />
                       ))}
                     </div>
                   </div>
                 </div>

                 {/* Right - Schedule & Availability */}
              <div className="space-y-4 sm:space-y-6">
                   <div className="text-center lg:text-left">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Availability</h3>
                  <p className="text-muted-foreground text-base sm:text-lg">Flexible scheduling for your lifestyle</p>
                   </div>
                   
                   {/* Schedule Cards */}
                   <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 hover:border-orange-500/60 transition-all group">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                         </div>
                         <div>
                        <h4 className="font-heading text-lg sm:text-xl font-bold text-white">Consultation Hours</h4>
                        <p className="text-orange-300 text-sm sm:text-base">Evenings & Weekends</p>
                         </div>
                       </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">Weekdays:</span>
                           <span className="text-white font-semibold">6-9 PM PST</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">Weekends:</span>
                           <span className="text-white font-semibold">Flexible</span>
                         </div>
                       </div>
                     </div>
                     
                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 hover:border-yellow-500/60 transition-all group">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                         </div>
                         <div>
                        <h4 className="font-heading text-lg sm:text-xl font-bold text-white">Quick Start</h4>
                        <p className="text-yellow-300 text-sm sm:text-base">48-hour setup process</p>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">1</div>
                        <span className="text-muted-foreground text-sm sm:text-base">Contact & Consultation</span>
                         </div>
                         <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">2</div>
                        <span className="text-muted-foreground text-sm sm:text-base">Program Selection</span>
                         </div>
                         <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">3</div>
                        <span className="text-muted-foreground text-sm sm:text-base">Start Training</span>
                         </div>
                       </div>
                     </div>
                     
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 hover:border-orange-500/60 transition-all group">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                         </div>
                         <div>
                        <h4 className="font-heading text-lg sm:text-xl font-bold text-white">Global Support</h4>
                        <p className="text-orange-300 text-sm sm:text-base">Worldwide accessibility</p>
                         </div>
                       </div>
                       <p className="text-muted-foreground text-sm leading-relaxed">
                         Online coaching platform serving athletes across all time zones. 
                         Flexible communication and All Day support ensure you're never alone in your journey.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </section>

               {/* Calendly Booking Section */}
        <section id="calendly-booking" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-orange-500/5 via-yellow-500/3 to-orange-500/5 relative overflow-hidden">
                    {/* Background Elements */}
           <div className="absolute top-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-10 left-10 w-32 sm:w-40 h-32 sm:h-40 bg-yellow-500/10 rounded-full blur-2xl"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
                                                       <div className="text-center mb-16">
                 <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                   Schedule Your <span className="gradient-text">Free Consultation</span>
                 </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Book a time that works for you and let's discuss your fitness goals and how we can help you achieve them
                </p>
              </div>

                           <Card className="bg-card/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25">
                 <CardHeader className="text-center pb-6 sm:pb-8">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                     <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                  </div>
                   <CardTitle className="font-heading text-2xl sm:text-3xl">Book Your Consultation</CardTitle>
                   <CardDescription className="text-base sm:text-lg text-muted-foreground">
                    Choose a time that works for you - consultations are available evenings and weekends
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Calendly Inline Widget */}
                  <div 
                    className="calendly-inline-widget" 
                    data-url="https://calendly.com/alllevelsathletics/fitnessconsultation?back=1&month=2025-09"
                    style={{ minWidth: '320px', height: '700px' }}
                  >
                    {/* Fallback content if Calendly doesn't load */}
                    <div className="flex items-center justify-center h-full bg-gray-50">
                      <div className="text-center p-8">
                        <Calendar className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Calendar...</h3>
                        <p className="text-gray-600 mb-6">If the calendar doesn't load, you can book directly:</p>
                        <Button 
                          onClick={() => window.open('https://calendly.com/alllevelsathletics/fitnessconsultation', '_blank')}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-6 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
                        >
                          Open Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
           </div>
         </div>
       </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about getting started with your transformation
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <CardTitle className="font-heading text-lg sm:text-xl group-hover:text-orange-400 transition-colors">How quickly can I get started?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  Most clients can start within 48-72 hours of their initial consultation. We'll schedule your
                  consultation, discuss your goals, and have your custom program ready to go by the end of the week.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <CardTitle className="font-heading text-lg sm:text-xl group-hover:text-yellow-400 transition-colors">What if I'm in a different time zone?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  We work with clients across all time zones. While our live consultation hours are PST-based, we're
                  flexible and can accommodate different schedules. Most communication happens asynchronously anyway.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <CardTitle className="font-heading text-lg sm:text-xl group-hover:text-orange-400 transition-colors">Do you offer payment plans?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  Yes! We offer flexible payment options including monthly billing and discounted 6-month packages.
                  We'll discuss the best option for your budget during your consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-12 sm:w-12 sm:h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <CardTitle className="font-heading text-lg sm:text-xl group-hover:text-yellow-400 transition-colors">What if I need to cancel or reschedule?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  Life happens! We require 48-hour notice for rescheduling consultations, and our coaching programs have
                  flexible cancellation policies. We'll work with you to find solutions that fit your life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-bg-variant-a py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="wave-pattern-a"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Your Transformation Starts with <span className="gradient-text">One Conversation</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Don't wait another day to start becoming the strongest, healthiest version of yourself. Reach out now and
              let's begin your journey together.
            </p>
            
            {/* Enhanced buttons with better styling */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12">
              <Button
                size="lg"
                onClick={handlePhoneCall}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20 w-full sm:w-auto"
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  Call 760-585-8832
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleEmail}
                className="border-2 border-orange-500 text-white hover:bg-yellow-500/10 hover:text-yellow-300 text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 w-full sm:w-auto"
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  Send Email
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
    </div>
  )
}
