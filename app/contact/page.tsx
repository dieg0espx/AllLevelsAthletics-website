"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle, Globe, Users, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-50 pb-42 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/dumbell.jpg"
            alt="Athletic training background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Enhanced background with depth and overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.2),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Get In Touch
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <span className="block text-white mb-4">Ready to Start Your</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Transformation?</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              Whether you have questions about our programs, want to schedule a consultation, or are ready to begin your
              fitness journey, we're here to help you every step of the way.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button
                size="lg"
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

      {/* Contact Methods */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Multiple Ways to <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the method that works best for you - we're available when you need us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Call or Text Card */}
            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl text-white">Call or Text</CardTitle>
                <CardDescription className="text-orange-300">Direct line to Daniel</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-start">
                  <div className="text-2xl font-bold gradient-text mb-3">760-585-8832</div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Available evenings & weekends for consultations
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl text-white">Email</CardTitle>
                <CardDescription className="text-yellow-300">Detailed inquiries welcome</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-start">
                  <div className="text-lg font-bold gradient-text mb-3">AllLevelsAthletics@gmail.com</div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Response within 24 hours guaranteed
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 border-2 border-yellow-400/20">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Email
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl text-white">Schedule</CardTitle>
                <CardDescription className="text-orange-300">Book your consultation</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-start">
                  <div className="text-xl font-bold gradient-text mb-3">Free Consultation</div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    48-hour advance booking required
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card className="bg-card/90 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl text-white">Social Media</CardTitle>
                <CardDescription className="text-yellow-300">Follow our journey</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-start">
                  <div className="text-lg font-bold gradient-text mb-3">@AllLevelsAthletics</div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    TikTok & Instagram updates
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 border-2 border-yellow-400/20">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Follow Us
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

                                                                                                               {/* Service Area & Availability - New Design */}
          <section className="py-20 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
           
           <div className="container mx-auto px-4 relative z-10">
             <div className="text-center mb-20">
               <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">
                 Global Reach
               </Badge>
               <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                 Service Area & <span className="gradient-text">Availability</span>
               </h2>
               <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                 From California to worldwide - we bring elite training to dedicated athletes everywhere
               </p>
             </div>

                                                       {/* Main Content Grid */}
               <div className="max-w-7xl mx-auto">
               {/* Top Row - Stats & Info */}
               <div className="grid md:grid-cols-3 gap-8 mb-16">
                 <div className="text-center group">
                   <div className="relative">
                     <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                       <Globe className="w-16 h-16 text-orange-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                   <h3 className="font-heading text-3xl font-bold text-white mb-2">50 States</h3>
                   <p className="text-orange-300 text-lg">Nationwide Coverage</p>
                 </div>
                 
                 <div className="text-center group">
                   <div className="relative">
                     <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                       <Clock className="w-16 h-16 text-yellow-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                   <h3 className="font-heading text-3xl font-bold text-white mb-2">24/7</h3>
                   <p className="text-yellow-300 text-lg">Always Available</p>
                 </div>
                 
                 <div className="text-center group">
                   <div className="relative">
                     <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                       <Users className="w-16 h-16 text-orange-400" />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                   </div>
                   <h3 className="font-heading text-3xl font-bold text-white mb-2">500+</h3>
                   <p className="text-orange-300 text-lg">Athletes Served</p>
                 </div>
               </div>

               {/* Bottom Row - Interactive Gallery & Schedule */}
               <div className="grid lg:grid-cols-2 gap-12 items-start">
                 {/* Left - Interactive Training Gallery */}
                 <div className="space-y-6">
                   <div className="text-center lg:text-left">
                     <h3 className="font-heading text-3xl font-bold text-white mb-4">Training Gallery</h3>
                     <p className="text-muted-foreground text-lg">See our programs in action</p>
                   </div>
                   
                                                                                                                                                                                                                                                                                                                               {/* Modern Carousel */}
                       <div className="relative group">
                         <div className="relative h-[540px] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                       {/* Main Image */}
                       <div className="relative h-full">
                         <img
                           src="/womanexcercising.jpg"
                           alt="Total Body Transformation"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 0 ? 1 : 0,
                             transform: currentSlide === 0 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/manexercising3.jpg"
                           alt="Athletic Performance"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 1 ? 1 : 0,
                             transform: currentSlide === 1 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/womanexcercising2.jpg"
                           alt="Movement Restoration"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 2 ? 1 : 0,
                             transform: currentSlide === 2 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/manexercising4.jpg"
                           alt="Strength Fundamentals"
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                           style={{ 
                             opacity: currentSlide === 3 ? 1 : 0,
                             transform: currentSlide === 3 ? 'scale(1.05)' : 'scale(1)'
                           }}
                         />
                         <img
                           src="/womanexcercising3.jpg"
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
                       <div className="absolute bottom-0 left-0 right-0 p-8">
                         <div className="text-white">
                           <h4 className="font-heading text-2xl font-bold mb-2">
                             {currentSlide === 0 && "Total Body Transformation"}
                             {currentSlide === 1 && "Athletic Performance"}
                             {currentSlide === 2 && "Movement Restoration"}
                             {currentSlide === 3 && "Strength Fundamentals"}
                             {currentSlide === 4 && "Morning Movement"}
                           </h4>
                           <p className="text-orange-300 text-lg">
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
                         className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all group opacity-0 group-hover:opacity-100"
                       >
                         <ChevronLeft className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                       </button>
                       
                       <button
                         onClick={() => setCurrentSlide((prev) => (prev === 4 ? 0 : prev + 1))}
                         className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all group opacity-0 group-hover:opacity-100"
                       >
                         <ChevronRight className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                       </button>
                     </div>
                     
                     {/* Thumbnail Navigation */}
                     <div className="flex justify-center gap-3 mt-6">
                       {Array.from({ length: 5 }, (_, index) => (
                         <button
                           key={index}
                           onClick={() => setCurrentSlide(index)}
                           className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
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
                 <div className="space-y-6">
                   <div className="text-center lg:text-left">
                     <h3 className="font-heading text-3xl font-bold text-white mb-4">Availability</h3>
                     <p className="text-muted-foreground text-lg">Flexible scheduling for your lifestyle</p>
                   </div>
                   
                   {/* Schedule Cards */}
                   <div className="space-y-4">
                     <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6 hover:border-orange-500/60 transition-all group">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                           <Clock className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <h4 className="font-heading text-xl font-bold text-white">Consultation Hours</h4>
                           <p className="text-orange-300">Evenings & Weekends</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-sm">
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
                     
                     <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/60 transition-all group">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                           <Zap className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <h4 className="font-heading text-xl font-bold text-white">Quick Start</h4>
                           <p className="text-yellow-300">48-hour setup process</p>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">1</div>
                           <span className="text-muted-foreground">Contact & Consultation</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">2</div>
                           <span className="text-muted-foreground">Program Selection</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs">3</div>
                           <span className="text-muted-foreground">Start Training</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6 hover:border-orange-500/60 transition-all group">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                           <Globe className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <h4 className="font-heading text-xl font-bold text-white">Global Support</h4>
                           <p className="text-orange-300">Worldwide accessibility</p>
                         </div>
                       </div>
                       <p className="text-muted-foreground text-sm leading-relaxed">
                         Online coaching platform serving athletes across all time zones. 
                         Flexible communication and 24/7 support ensure you're never alone in your journey.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </section>

       {/* Contact Form */}
       <section className="py-20 bg-gradient-to-br from-orange-500/5 via-yellow-500/3 to-orange-500/5 relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
         <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
         
         <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-4xl mx-auto">
                           <div className="text-center mb-16">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                  Send Us a <span className="gradient-text">Message</span>
                </h2>
               <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                 Tell us about your goals and we'll get back to you with a personalized plan within 24 hours
               </p>
             </div>

             <Card className="bg-card/90 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25">
               <CardHeader className="text-center pb-8">
                 <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                   <MessageCircle className="w-10 h-10 text-black" />
                 </div>
                 <CardTitle className="font-heading text-3xl">Get Your Free Consultation</CardTitle>
                 <CardDescription className="text-lg text-muted-foreground">
                   Fill out the form below and Daniel will personally respond within 24 hours
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-8">
                 {/* Personal Information */}
                 <div className="space-y-6">
                   <h3 className="font-heading text-xl font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                     Personal Information
                   </h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                       <Label htmlFor="firstName" className="text-sm font-semibold">First Name *</Label>
                       <Input 
                         id="firstName" 
                         placeholder="Enter your first name" 
                         className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 h-12" 
                       />
                     </div>
                     <div className="space-y-3">
                       <Label htmlFor="lastName" className="text-sm font-semibold">Last Name *</Label>
                       <Input 
                         id="lastName" 
                         placeholder="Enter your last name" 
                         className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 h-12" 
                       />
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                       <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                       <Input 
                         id="email" 
                         type="email" 
                         placeholder="your.email@example.com" 
                         className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 h-12" 
                       />
                     </div>
                     <div className="space-y-3">
                       <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                       <Input 
                         id="phone" 
                         type="tel" 
                         placeholder="(555) 123-4567" 
                         className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 h-12" 
                       />
                     </div>
                   </div>
                 </div>

                 {/* Fitness Goals */}
                 <div className="space-y-4">
                   <h3 className="font-heading text-xl font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                     Your Fitness Journey
                   </h3>
                   <div className="space-y-3">
                     <Label htmlFor="goals" className="text-sm font-semibold">What are your fitness goals? *</Label>
                     <Textarea
                       id="goals"
                       placeholder="Tell us about your current fitness level, goals, and what you hope to achieve..."
                       className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 min-h-[120px] resize-none"
                     />
                   </div>

                   <div className="space-y-3">
                     <Label htmlFor="experience" className="text-sm font-semibold">Current fitness experience</Label>
                     <Textarea
                       id="experience"
                       placeholder="Describe your current workout routine, any injuries or limitations, and previous training experience..."
                       className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 min-h-[100px] resize-none"
                     />
                   </div>

                   <div className="space-y-3">
                     <Label htmlFor="timeline" className="text-sm font-semibold">When would you like to start?</Label>
                     <Input 
                       id="timeline" 
                       placeholder="Immediately, next week, next month..." 
                       className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 h-12" 
                     />
                   </div>
                 </div>

                 {/* Questions */}
                 <div className="space-y-4">
                   <h3 className="font-heading text-xl font-semibold text-orange-400 border-b border-orange-500/30 pb-2">
                     Questions & Additional Info
                   </h3>
                   <div className="space-y-3">
                     <Label htmlFor="questions" className="text-sm font-semibold">Any questions for Daniel?</Label>
                     <Textarea
                       id="questions"
                       placeholder="Ask about programs, pricing, methodology, or anything else you'd like to know..."
                       className="bg-background/80 border-2 border-orange-500/20 focus:border-orange-500/60 transition-all duration-300 min-h-[80px] resize-none"
                     />
                   </div>
                 </div>

                 {/* Submit Button */}
                 <div className="text-center pt-6 border-t border-orange-500/30">
                   <Button
                     size="lg"
                     className="gradient-orange-yellow text-black font-bold text-lg px-16 py-6 rounded-full hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/25"
                   >
                     <span className="flex items-center gap-3">
                       <MessageCircle className="w-5 h-5" />
                       Send Message & Get Free Consultation
                     </span>
                   </Button>
                   <p className="text-sm text-muted-foreground mt-6 max-w-md mx-auto">
                     We respect your privacy. Your information will never be shared with third parties.
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Common <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Quick answers to help you get started</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">How quickly can I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most clients can start within 48-72 hours of their initial consultation. We'll schedule your
                  consultation, discuss your goals, and have your custom program ready to go by the end of the week.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">What if I'm in a different time zone?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We work with clients across all time zones. While our live consultation hours are PST-based, we're
                  flexible and can accommodate different schedules. Most communication happens asynchronously anyway.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Do you offer payment plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer flexible payment options including monthly billing and discounted 6-month packages.
                  We'll discuss the best option for your budget during your consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">What if I need to cancel or reschedule?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Life happens! We require 48-hour notice for rescheduling consultations, and our coaching programs have
                  flexible cancellation policies. We'll work with you to find solutions that fit your life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Your Transformation Starts with
              <span className="block gradient-text">One Conversation</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't wait another day to start becoming the strongest, healthiest version of yourself. Reach out now and
              let's begin your journey together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 glow-orange hover:scale-105 transition-all"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 760-585-8832
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-500 text-white hover:bg-orange-500/10 text-lg px-8 py-4 bg-transparent"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
