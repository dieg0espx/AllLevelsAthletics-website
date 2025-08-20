"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, Users, Target, Zap, Heart, Award, Play, Mail, Trophy, Star, Info, ShoppingCart, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function ServicesPage() {
  const [selectedImage, setSelectedImage] = useState("/roller/roller 5.jpeg")
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const rollerImages = [
    "/roller/roller 5.jpeg",
    "/roller/roller3.jpeg", 
    "/roller/roller4.jpg",
    "/roller/roller6.jpeg"
  ]

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rollerImages.length)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [rollerImages.length])

  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/manexercising2.jpg"
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
            <Badge className="gradient-orange-yellow text-black font-bold mb-4 sm:mb-6 text-base sm:text-lg px-4 sm:px-6 py-2">
              Premium Training Services
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight">
              <span className="block text-white mb-2 sm:mb-4">Choose Your Path to</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Peak Performance</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              Our tier-based coaching system is designed to meet you exactly where you are and take you exactly where
              you want to go. Every program includes our revolutionary tension reset methodology and personalized
              approach.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ease-out shadow-xl group hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free Trial
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-orange-500/50 text-orange-400 font-semibold text-base px-6 py-4 rounded-full transition-all duration-300 ease-out hover:bg-orange-500/10 hover:border-orange-500/70 hover:text-orange-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  View All Services
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Service Comparison */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Compare <span className="gradient-text">Training Tiers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect level of support for your fitness journey
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Enhanced Comparison Table */}
            <div className="bg-card border-2 border-muted rounded-2xl overflow-hidden shadow-xl">
              {/* Table Header */}
              <div className="grid lg:grid-cols-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b-2 border-muted">
                <div className="p-6 lg:p-8">
                  <h3 className="font-heading text-xl font-bold text-white mb-2">Features</h3>
                  <p className="text-sm text-muted-foreground">What's included in each tier</p>
                </div>
                <div className="p-6 lg:p-8 text-center border-l border-muted">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-3">STARTER</Badge>
                  <h4 className="font-heading text-2xl font-bold text-white mb-1">Foundation</h4>
                  <div className="text-3xl font-bold gradient-text mb-1">$197</div>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
                <div className="p-6 lg:p-8 text-center border-l border-muted relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-3">GROWTH</Badge>
                  <h4 className="font-heading text-2xl font-bold text-white mb-1">Accelerated</h4>
                  <div className="text-3xl font-bold gradient-text mb-1">$297</div>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
                <div className="p-6 lg:p-8 text-center border-l border-muted">
                  <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30 mb-3">ELITE</Badge>
                  <h4 className="font-heading text-2xl font-bold text-white mb-1">Premium</h4>
                  <div className="text-3xl font-bold gradient-text mb-1">$497</div>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-muted">
                {/* Monthly Check-ins */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Monthly Check-ins</h5>
                        <p className="text-sm text-muted-foreground">Regular progress reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">1x per month</span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium">2x per month</span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">Weekly</span>
                    </div>
                  </div>
                </div>

                {/* Custom Program Design */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Custom Program Design</h5>
                        <p className="text-sm text-muted-foreground">Personalized workout plans</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Form Review & Feedback */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Form Review & Feedback</h5>
                        <p className="text-sm text-muted-foreground">Video analysis & corrections</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Video Analysis */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Video Analysis</h5>
                        <p className="text-sm text-muted-foreground">Detailed movement breakdown</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Tension Coaching */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Tension Coaching</h5>
                        <p className="text-sm text-muted-foreground">Myofascial release guidance</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Mobility Prioritization */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Mobility Prioritization</h5>
                        <p className="text-sm text-muted-foreground">Flexibility & range of motion</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Email Support */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Email Support</h5>
                        <p className="text-sm text-muted-foreground">Basic communication</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Priority Support */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Priority Support</h5>
                        <p className="text-sm text-muted-foreground">Faster response times</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Training Progression */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Training Progression</h5>
                        <p className="text-sm text-muted-foreground">Systematic advancement</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>

                {/* Nutrition Guidance */}
                <div className="grid lg:grid-cols-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-orange-500" />
                      <div>
                        <h5 className="font-semibold text-white">Nutrition Guidance</h5>
                        <p className="text-sm text-muted-foreground">Diet & meal planning support</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <X className="w-6 h-6 mx-auto text-muted-foreground" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-yellow-500" />
                  </div>
                  <div className="p-6 lg:p-8 text-center border-l border-muted">
                    <CheckCircle className="w-6 h-6 mx-auto text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Table Footer - CTA Buttons */}
              <div className="grid lg:grid-cols-4 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border-t-2 border-muted">
                <div className="p-6 lg:p-8"></div>
                <div className="p-6 lg:p-8 text-center border-l border-muted">
                  <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                    Get Started
                  </Button>
                </div>
                <div className="p-6 lg:p-8 text-center border-l border-muted">
                  <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                    Choose Growth
                  </Button>
                </div>
                <div className="p-6 lg:p-8 text-center border-l border-muted">
                  <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                    Go Elite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
         <section className="relative py-40 overflow-hidden">
           {/* Enhanced Gradient Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-yellow-500/15 to-orange-600/25"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10"></div>
           
          {/* Enhanced Animated Background Elements */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>

          <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-8 py-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm mb-8 hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-black" />
              <span className="text-xl">Core Methodology</span>
              <Star className="w-6 h-6 text-black" />
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              What's <span className="gradient-text">Included</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Every tier includes our core methodology and proven systems
            </p>
          </div>

                                {/* Enhanced Features Grid - Two Rows */}
           <div className="max-w-6xl mx-auto">
             {/* First Row - 3 Cards */}
             <div className="grid lg:grid-cols-3 gap-6 mb-8">
               {/* Feature Card 1 */}
               <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Target className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-orange-400 transition-colors">Custom Program Design</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Every program is built specifically for your goals, experience level, available equipment, and time constraints.
                   </p>
                 </CardContent>
               </Card>

               {/* Feature Card 2 */}
               <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Zap className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">Tension Reset Method</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Our revolutionary approach to releasing muscle tension and optimizing movement patterns for maximum results.
                   </p>
                 </CardContent>
               </Card>

               {/* Feature Card 3 */}
               <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Users className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-orange-400 transition-colors">Expert Coaching</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Direct access to Daniel Ledbetter and his proven methodology that has transformed 500+ athletes.
                   </p>
                 </CardContent>
               </Card>
             </div>

             {/* Second Row - 3 Cards */}
             <div className="grid lg:grid-cols-3 gap-6">
               {/* Feature Card 4 */}
               <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Clock className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">Flexible Scheduling</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Work around your schedule with evening and weekend availability. 48-hour booking notice required.
                   </p>
                 </CardContent>
               </Card>

               {/* Feature Card 5 */}
               <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Heart className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-orange-400 transition-colors">Ongoing Support</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Never train alone. Get the support and accountability you need to stay consistent and motivated.
                   </p>
                 </CardContent>
               </Card>

               {/* Feature Card 6 */}
               <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
                 <CardContent className="text-center py-6 px-6">
                   <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Award className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="font-heading text-xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">Proven Results</h3>
                   <p className="text-white/80 leading-relaxed text-base">
                     Join the 98% of clients who achieve their goals with our systematic approach to transformation.
                   </p>
                 </CardContent>
               </Card>
             </div>
           </div>
        </div>
      </section>

      {/* Digital Products Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Products</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Self-guided programs and professional tools for independent training
            </p>
          </div>

          {/* Knot Roller Detailed Information with Image Gallery */}
          <div className="max-w-7xl mx-auto">
                                                   <Card className="bg-transparent border-2 border-orange-500/30 overflow-hidden rounded-t-lg p-0">
               <CardHeader className="relative border-b border-orange-500/30 overflow-hidden p-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                 <div className="relative z-10 px-8 py-6">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                       <Zap className="w-6 h-6 text-black" />
                     </div>
                     <div>
                                               <CardTitle className="font-heading text-2xl text-white mb-1">All Levels Knot Roller</CardTitle>
                        <CardDescription className="text-orange-300">Professional Myofascial Release Tool</CardDescription>
                     </div>
                   </div>
                 </div>
               </CardHeader>
                <CardContent className="p-8 bg-card/90">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Price Card - Left Top */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/30 p-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold gradient-text mb-2">$99</div>
                        <p className="text-sm text-muted-foreground mb-4">+ shipping</p>
                        <div className="space-y-3">
                          <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                            <span className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Order Now
                            </span>
                          </Button>
                          <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                            <span className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Watch Demo
                            </span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-heading text-lg font-bold text-orange-400">What's Included</h3>
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>12-month warranty</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span>Ships within 24 hours in the USA</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-yellow-500" />
                            <span>Lifetime durability guarantee</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-yellow-500" />
                            <span>Used by 500+ successful clients</span>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                  
                                     {/* Product Description - Center */}
                   <div className="lg:col-span-1 space-y-6">
                     <div>
                       <h3 className="font-heading text-xl font-bold text-orange-400 mb-3">Product Overview</h3>
                       <p className="text-white/80 leading-relaxed">
                         The ultimate upgrade from a traditional foam roller. This mobility tool is designed to go deeper into muscles 
                         and release hard-to-reach knots that regular rollers simply can't touch.
                       </p>
                     </div>
                     
                     <div>
                       <h3 className="font-heading text-xl font-bold text-yellow-400 mb-3">Key Features</h3>
                       <ul className="space-y-3 text-white/80">
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Precision Ball Bearings:</strong> Glides smoothly and lets you control the pressure for maximum effectiveness</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Non-slip Rubber Base:</strong> Provides stability on any surface—hardwood, carpet, tile, or even outdoors</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Versatile Design:</strong> Roller can be removed from the base and used as a stand-alone tool</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Durable Construction:</strong> Made with a durable stainless steel core and built to last a lifetime</span>
                         </li>
                       </ul>
                     </div>

                     
                   </div>

                                     {/* Image Slideshow - Right */}
                   <div className="lg:col-span-1">
                     <div className="space-y-4">
                       {/* Main Image Slideshow */}
                       <div className="relative overflow-hidden rounded-xl">
                         <img
                           src={rollerImages[currentSlide]}
                           alt="All Levels Knot Roller"
                           className="w-full h-64 object-cover object-center transition-all duration-500"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                         
                         {/* Slideshow Navigation Dots */}
                         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                           {rollerImages.map((_, index) => (
                             <button
                               key={index}
                               onClick={() => setCurrentSlide(index)}
                               className={`w-2 h-2 rounded-full transition-all ${
                                 currentSlide === index 
                                   ? 'bg-orange-500 w-4' 
                                   : 'bg-white/50 hover:bg-white/75'
                               }`}
                             />
                           ))}
                         </div>
                       </div>
                       
                       {/* Target Areas */}
                       <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30 rounded-xl p-4">
                         <h3 className="font-heading text-lg font-bold text-orange-400 mb-3">Target Areas</h3>
                         <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Feet</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Calves</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Quads</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Hamstrings</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Hip Flexors</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Triceps</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Biceps</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Forearms</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

                     {/* Body Tension Reset Course Detailed Information */}
           <div className="mt-16 max-w-7xl mx-auto">
                                                   <Card className="bg-transparent border-2 border-orange-500/30 overflow-hidden rounded-t-lg p-0">
               <CardHeader className="relative border-b border-orange-500/30 overflow-hidden p-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                 <div className="relative z-10 px-8 py-6">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                       <Target className="w-6 h-6 text-black" />
                     </div>
                     <div>
                                               <CardTitle className="font-heading text-2xl text-white mb-1">Body Tension Reset Course</CardTitle>
                        <CardDescription className="text-orange-300">30-Day Self-Guided Program</CardDescription>
                     </div>
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="p-8 bg-card/90">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Price Card - Left Top */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/30 p-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold gradient-text mb-2">$49</div>
                        <p className="text-sm text-muted-foreground line-through mb-1">$99</p>
                        <p className="text-sm text-green-400 font-semibold mb-4">50% OFF</p>
                        <div className="space-y-3">
                          <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                            <span className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Get Course
                            </span>
                          </Button>
                          <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                            <span className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Watch Preview
                            </span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-heading text-lg font-bold text-orange-400">What's Included</h3>
                        <ul className="space-y-2 text-white/80 text-sm">
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span>30 days of guided instruction</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Play className="w-4 h-4 text-yellow-500" />
                            <span>Video demonstrations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-yellow-500" />
                            <span>Progress tracking tools (PDF/Excel)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-yellow-500" />
                            <span>Money-back guarantee</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>Lifetime access</span>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Course Description - Center */}
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-orange-400 mb-3">Course Overview</h3>
                      <p className="text-white/80 leading-relaxed">
                        A self-paced program designed to help you identify, track, and reduce your body's tension levels. 
                        In just 30 days, you can cut your Body Tension Score by 50%—guaranteed or your money back.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-heading text-xl font-bold text-yellow-400 mb-3">What You'll Learn</h3>
                      <ul className="space-y-3 text-white/80">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Body Tension Score System:</strong> Understand and apply the system to measure muscle tension and pain</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Problem Area Identification:</strong> Identify specific problem areas in your body and know exactly where to focus</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Progress Tracking:</strong> Track progress each week using simple PDF or Excel tools</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <span><strong>Step-by-step Techniques:</strong> Follow proven techniques to reduce pain, release tightness, and restore mobility</span>
                        </li>
                      </ul>
                    </div>

                                       </div>

                   {/* Course Image - Right */}
                   <div className="lg:col-span-1">
                     <div className="space-y-4">
                       <div className="relative overflow-hidden rounded-xl">
                         <img
                           src="/gymTools.jpg"
                           alt="Body Tension Reset Course"
                           className="w-full h-64 object-cover object-center"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                       </div>
                       
                       {/* Course Benefits */}
                       <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30 rounded-xl p-4">
                         <h3 className="font-heading text-lg font-bold text-orange-400 mb-3">Course Benefits</h3>
                         <div className="space-y-2 text-sm text-white/80">
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>50% reduction in Body Tension Score guaranteed</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Measurable results you can track</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Easy-to-use tracking system</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Small, consistent steps for big improvements</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Lasting improvements in how you feel and move</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

                     {/* Complete Bundle Detailed Information */}
           <div className="mt-16 max-w-7xl mx-auto">
                                                   <Card className="bg-transparent border-2 border-orange-500/30 overflow-hidden rounded-t-lg p-0">
               <CardHeader className="relative border-b border-orange-500/30 overflow-hidden p-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                 <div className="relative z-10 px-8 py-6">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                       <ShoppingCart className="w-6 h-6 text-black" />
                     </div>
                     <div>
                                               <CardTitle className="font-heading text-2xl text-white mb-1">Complete Bundle</CardTitle>
                        <CardDescription className="text-orange-500/30">Knot Roller + Course Package</CardDescription>
                     </div>
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="p-8 bg-card/90">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Price Card - Left Top */}
                  <div className="lg:col-span-1">
                                         <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/30 p-6">
                       <div className="text-center mb-6">
                         <div className="text-4xl font-bold gradient-text mb-2">$149</div>
                         <p className="text-sm text-muted-foreground line-through mb-1">$199</p>
                         <p className="text-sm text-orange-400 font-semibold mb-4">Save $50!</p>
                         <div className="space-y-3">
                           <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                             <span className="flex items-center gap-2">
                               <ShoppingCart className="w-4 h-4" />
                               Get Bundle
                             </span>
                           </Button>
                           <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                             <span className="flex items-center gap-2">
                               <Info className="w-4 h-4" />
                               Learn More
                             </span>
                           </Button>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                         <h3 className="font-heading text-lg font-bold text-orange-400">Bundle Benefits</h3>
                         <ul className="space-y-2 text-white/80 text-sm">
                           <li className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Complete recovery system in one package</span>
                           </li>
                           <li className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Save $50 compared to buying separately</span>
                           </li>
                           <li className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Proven results from 500+ clients</span>
                           </li>
                           <li className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Professional-grade tools and guidance</span>
                           </li>
                           <li className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-orange-500" />
                             <span>Lifetime access to course content</span>
                           </li>
                         </ul>
                       </div>
                     </Card>
                  </div>
                  
                  {/* Bundle Description - Center */}
                  <div className="lg:col-span-1 space-y-6">
                                         <div>
                       <h3 className="font-heading text-xl font-bold text-orange-400 mb-3">Bundle Overview</h3>
                       <p className="text-white/80 leading-relaxed">
                         Get the ultimate recovery system by combining the All Levels Knot Roller with the Body Tension Reset Course. 
                         This bundle gives you everything you need to take control of your recovery, reduce pain, and move better—starting today.
                       </p>
                     </div>
                     
                     <div>
                       <h3 className="font-heading text-xl font-bold text-yellow-400 mb-3">What You'll Receive</h3>
                       <ul className="space-y-3 text-white/80">
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Full Knot Roller Device:</strong> Built to last and designed to unlock deep muscle tension</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Lifetime Course Access:</strong> Body Tension Reset Course with the Body Tension Score system</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Bonus Integration Guide:</strong> Shows you exactly how to use the roller with the course for maximum results</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Priority Support:</strong> Customer support for any questions or guidance</span>
                         </li>
                         <li className="flex items-start gap-3">
                           <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                           <span><strong>Free Shipping:</strong> Included in the bundle price</span>
                         </li>
                       </ul>
                     </div>

                                       </div>

                   {/* Bundle Image - Right */}
                   <div className="lg:col-span-1">
                     <div className="space-y-4">
                       <div className="relative overflow-hidden rounded-xl">
                         <img
                           src="/roller.jpg"
                           alt="Complete Bundle - Knot Roller + Course Package"
                           className="w-full h-64 object-cover object-center"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                       </div>
                       
                                               {/* Perfect For */}
                        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30 rounded-xl p-4">
                          <h3 className="font-heading text-lg font-bold text-orange-400 mb-3">Perfect For</h3>
                          <div className="space-y-2 text-sm text-white/80">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-orange-500" />
                              <span>Athletes looking for complete recovery</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-orange-500" />
                              <span>Anyone with chronic muscle tension</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-orange-500" />
                              <span>People wanting to reduce pain naturally</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-orange-500" />
                              <span>Those seeking better mobility and movement</span>
                            </div>
                          </div>
                        </div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

         
        </div>
      </section>

                           {/* Special Offers */}
        <section className="gradient-bg-variant-a py-40 overflow-hidden">
          <div className="wave-pattern-a"></div>

         <div className="container mx-auto px-4 relative z-10">
                       {/* Enhanced Header Section */}
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                Special <span className="gradient-text">Offers</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Limited-time deals to get you started on your transformation journey
              </p>
            </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="text-center">
                 <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                   <Zap className="w-8 h-8 text-black" />
                 </div>
                 <CardTitle className="font-heading text-2xl mb-2 group-hover:text-orange-400 transition-colors">Free 7-Day Trial</CardTitle>
                 <CardDescription className="text-orange-300">Experience our coaching risk-free</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                 <p className="text-white/80 leading-relaxed text-base mb-6">
                   Get full access to our Starter program for 7 days. No commitment, no credit card required.
                 </p>
                 <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                   <span className="flex items-center gap-2">
                     <Zap className="w-4 h-4" />
                     Start Free Trial
                   </span>
                 </Button>
               </CardContent>
             </Card>

             <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="text-center">
                 <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                   <Award className="w-8 h-8 text-black" />
                 </div>
                 <CardTitle className="font-heading text-2xl mb-2 group-hover:text-yellow-400 transition-colors">BOGO MFRoller</CardTitle>
                 <CardDescription className="text-yellow-300">Buy 2, Get 1 Free - Limited Time</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                 <p className="text-white/80 leading-relaxed text-base mb-6">
                   Perfect for training partners or family. Get three professional MFRollers for the price of two.
                 </p>
                 <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                   <span className="flex items-center gap-2">
                     <Award className="w-4 h-4" />
                     Claim Offer
                   </span>
                 </Button>
               </CardContent>
             </Card>

             <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="text-center">
                 <div className="w-16 h-16 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                   <Heart className="w-8 h-8 text-black" />
                 </div>
                 <CardTitle className="font-heading text-2xl mb-2 group-hover:text-orange-400 transition-colors">6-Month Discount</CardTitle>
                 <CardDescription className="text-orange-300">Save 10% on any coaching tier</CardDescription>
               </CardHeader>
               <CardContent className="text-center">
                 <p className="text-white/80 leading-relaxed text-base mb-6">
                   Commit to your transformation with our 6-month packages and save 10% on your monthly rate.
                 </p>
                 <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                   <span className="flex items-center gap-2">
                     <Heart className="w-4 h-4" />
                     Get Discount
                   </span>
                 </Button>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

                           {/* FAQ Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
             <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
               Frequently Asked <span className="gradient-text">Questions</span>
             </h2>
             <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
               Everything you need to know about our services and methodology
             </p>
           </div>

           <div className="max-w-5xl mx-auto space-y-6">
             <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Users className="w-6 h-6 text-black" />
                   </div>
                   <CardTitle className="font-heading text-xl group-hover:text-orange-400 transition-colors">How does online training work?</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-white/80 leading-relaxed text-base">
                   Our online training combines personalized program design with regular check-ins via video calls, form
                   reviews through video submissions, and ongoing support through our communication platform. You'll
                   receive your custom workout program and can reach out anytime for guidance.
                 </p>
               </CardContent>
             </Card>

             <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Target className="w-6 h-6 text-black" />
                   </div>
                   <CardTitle className="font-heading text-xl group-hover:text-yellow-400 transition-colors">What equipment do I need?</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-white/80 leading-relaxed text-base">
                   Programs are designed around your available equipment. Whether you have a full gym, basic home setup,
                   or just bodyweight, we'll create an effective program for you. We'll discuss your equipment during
                   your initial consultation.
                 </p>
               </CardContent>
             </Card>

             <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Clock className="w-6 h-6 text-black" />
                   </div>
                   <CardTitle className="font-heading text-xl group-hover:text-orange-400 transition-colors">Can I change tiers anytime?</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-white/80 leading-relaxed text-base">
                   You can upgrade or downgrade your coaching tier at any time. Changes take effect at your next billing
                   cycle, and we'll adjust your program and support level accordingly.
                 </p>
               </CardContent>
             </Card>

             <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm cursor-pointer hover:scale-105">
               <CardHeader className="pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                     <Heart className="w-6 h-6 text-black" />
                   </div>
                   <CardTitle className="font-heading text-xl group-hover:text-yellow-400 transition-colors">What is the tension reset method?</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="pt-0">
                 <p className="text-white/80 leading-relaxed text-base">
                   Our proprietary tension reset method focuses on releasing chronic muscle tension and optimizing
                   movement patterns before building strength. This approach leads to better results, fewer injuries, and
                   improved performance across all activities.
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

             {/* CTA Section */}
       <section className="gradient-bg-variant-a py-20 overflow-hidden">
         <div className="wave-pattern-a"></div>
         <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-5xl mx-auto text-center">
             <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
               Ready to Transform Your <span className="gradient-text">Training?</span>
             </h2>
             <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
               Join hundreds of athletes who have already discovered the power of our proven methodology.
             </p>
             
             {/* Enhanced buttons with better styling */}
             <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
               <Button
                 size="lg"
                 className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-10 py-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20"
               >
                 <span className="flex items-center gap-3">
                   <Zap className="w-6 h-6" />
                   Start Free 7-Day Trial
                 </span>
               </Button>
               <Button
                 variant="outline"
                 size="lg"
                 className="border-2 border-orange-500 text-white hover:bg-yellow-500/10 hover:text-yellow-300 text-lg px-10 py-6 rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
               >
                 <span className="flex items-center gap-3">
                   <MessageCircle className="w-6 h-6" />
                   Schedule Consultation
                 </span>
               </Button>
             </div>
           </div>
         </div>
       </section>
     </div>
   )
 }
