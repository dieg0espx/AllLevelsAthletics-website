import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle, Globe, Users, Zap } from "lucide-react"

export default function ContactPage() {
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

                           {/* Service Area & Availability */}
        <section className="py-20 bg-black relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Service Area & <span className="gradient-text">Availability</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Global reach through online coaching - we work with dedicated athletes worldwide to achieve extraordinary results
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Global Reach Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="font-heading text-2xl text-white">Global Reach</CardTitle>
                    <CardDescription className="text-orange-300">Worldwide online coaching</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                                         <div className="flex-1 flex flex-col justify-start">
                       <p className="text-muted-foreground leading-relaxed mb-6">
                         While we're based in California, our online coaching platform allows us to work with dedicated
                         athletes anywhere. Join clients from coast to coast who are achieving incredible results.
                       </p>
                       <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="text-center">
                           <div className="text-3xl font-bold gradient-text">50</div>
                           <div className="text-sm text-muted-foreground">States Served</div>
                         </div>
                         <div className="text-center">
                           <div className="text-3xl font-bold gradient-text">500+</div>
                           <div className="text-sm text-muted-foreground">Remote Clients</div>
                         </div>
                       </div>
                     </div>
                    <div className="flex-shrink-0 pt-4 border-t border-orange-500/20">
                      <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Worldwide Access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Flexible Schedule Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Clock className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="font-heading text-2xl text-white">Flexible Schedule</CardTitle>
                    <CardDescription className="text-yellow-300">Available when you need us</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Consultations:</span>
                          <span className="font-semibold text-white">6-9 PM PST</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Weekends:</span>
                          <span className="font-semibold text-white">Sat & Sun</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Booking:</span>
                          <span className="font-semibold text-white">48h notice</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pt-4 border-t border-yellow-500/20">
                      <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Start Process Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Zap className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="font-heading text-2xl text-white">Quick Start</CardTitle>
                    <CardDescription className="text-orange-300">Begin your journey today</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                            1
                          </div>
                          <span className="text-muted-foreground text-sm">Contact us</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                            2
                          </div>
                          <span className="text-muted-foreground text-sm">Free consultation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                            3
                          </div>
                          <span className="text-muted-foreground text-sm">Choose program</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                            4
                          </div>
                          <span className="text-muted-foreground text-sm">Start training</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pt-4 border-t border-orange-500/20">
                      <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>48h Setup</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

       {/* Contact Form */}
       <section className="py-20">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                 Send Us a <span className="gradient-text">Message</span>
               </h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Tell us about your goals and we'll get back to you with a personalized plan
               </p>
             </div>

             <Card className="bg-card border-2 border-orange-500/30 glow-orange">
               <CardHeader className="text-center">
                 <CardTitle className="font-heading text-2xl">Get Your Free Consultation</CardTitle>
                 <CardDescription>
                   Fill out the form below and Daniel will personally respond within 24 hours
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="firstName">First Name *</Label>
                     <Input id="firstName" placeholder="Enter your first name" className="bg-background" />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="lastName">Last Name *</Label>
                     <Input id="lastName" placeholder="Enter your last name" className="bg-background" />
                   </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="email">Email Address *</Label>
                     <Input id="email" type="email" placeholder="your.email@example.com" className="bg-background" />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phone">Phone Number</Label>
                     <Input id="phone" type="tel" placeholder="(555) 123-4567" className="bg-background" />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="goals">What are your fitness goals? *</Label>
                   <Textarea
                     id="goals"
                     placeholder="Tell us about your current fitness level, goals, and what you hope to achieve..."
                     className="bg-background min-h-[120px]"
                   />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="experience">Current fitness experience</Label>
                   <Textarea
                     id="experience"
                     placeholder="Describe your current workout routine, any injuries or limitations, and previous training experience..."
                     className="bg-background min-h-[100px]"
                   />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="timeline">When would you like to start?</Label>
                   <Input id="timeline" placeholder="Immediately, next week, next month..." className="bg-background" />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="questions">Any questions for Daniel?</Label>
                   <Textarea
                     id="questions"
                     placeholder="Ask about programs, pricing, methodology, or anything else you'd like to know..."
                     className="bg-background min-h-[80px]"
                   />
                 </div>

                 <div className="text-center pt-4">
                   <Button
                     size="lg"
                     className="gradient-orange-yellow text-black font-bold text-lg px-12 py-4 glow-orange hover:scale-105 transition-all"
                   >
                     Send Message & Get Free Consultation
                   </Button>
                   <p className="text-sm text-muted-foreground mt-4">
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
