import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle, Globe, Users, Zap } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">Get In Touch</Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Ready to Start Your
              <span className="block gradient-text">Transformation?</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Whether you have questions about our programs, want to schedule a consultation, or are ready to begin your
              fitness journey, we're here to help you every step of the way.
            </p>
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
            <Card className="bg-card border-2 border-orange-500/50 hover:border-orange-500 transition-all hover:glow-orange text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Call or Text</CardTitle>
                <CardDescription>Direct line to Daniel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text mb-2">760-585-8832</div>
                <p className="text-sm text-muted-foreground mb-4">Available evenings & weekends for consultations</p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Call Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-yellow-500/50 hover:border-yellow-500 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Email</CardTitle>
                <CardDescription>Detailed inquiries welcome</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold gradient-text mb-2">AllLevelsAthletics@gmail.com</div>
                <p className="text-sm text-muted-foreground mb-4">Response within 24 hours guaranteed</p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Send Email</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-orange-500/50 hover:border-orange-500 transition-all hover:glow-orange text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Schedule</CardTitle>
                <CardDescription>Book your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold gradient-text mb-2">Free Consultation</div>
                <p className="text-sm text-muted-foreground mb-4">48-hour advance booking required</p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-yellow-500/50 hover:border-yellow-500 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Social Media</CardTitle>
                <CardDescription>Follow our journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold gradient-text mb-2">@AllLevelsAthletics</div>
                <p className="text-sm text-muted-foreground mb-4">TikTok & Instagram updates</p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Follow Us</Button>
              </CardContent>
            </Card>
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

      {/* Service Area & Availability */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Service Area & <span className="gradient-text">Availability</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Online coaching means we can work with clients anywhere in the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                      <Globe className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-xl">Nationwide Service</CardTitle>
                      <CardDescription>Online coaching available everywhere</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our online coaching platform allows us to work with clients across the United States and
                    internationally. Distance is no barrier to achieving your fitness goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-xl">Flexible Hours</CardTitle>
                      <CardDescription>Evenings & weekends preferred</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Hours:</span>
                      <span className="font-semibold">6:00 PM - 9:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekend Availability:</span>
                      <span className="font-semibold">Saturday & Sunday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Notice:</span>
                      <span className="font-semibold">48 hours required</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="font-heading text-xl">Response Time</CardTitle>
                      <CardDescription>Quick and reliable communication</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Response:</span>
                      <span className="font-semibold">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Text Messages:</span>
                      <span className="font-semibold">Same day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency Support:</span>
                      <span className="font-semibold">Available for clients</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-card border-2 border-orange-500 glow-orange">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4">
                    <MapPin className="w-10 h-10 text-black" />
                  </div>
                  <CardTitle className="font-heading text-2xl">Based in California</CardTitle>
                  <CardDescription>Serving clients nationwide through online coaching</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl mb-4">🌎</div>
                  <p className="text-muted-foreground">
                    While we're based in California, our online coaching platform allows us to work with dedicated
                    athletes anywhere. Join clients from coast to coast who are achieving incredible results.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">50</div>
                      <div className="text-sm text-muted-foreground">States Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">500+</div>
                      <div className="text-sm text-muted-foreground">Remote Clients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
                <CardHeader className="text-center">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <CardTitle className="font-heading text-xl">Quick Start Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm">
                        1
                      </div>
                      <span className="text-muted-foreground">Contact us via phone, email, or form</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm">
                        2
                      </div>
                      <span className="text-muted-foreground">Schedule your free consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm">
                        3
                      </div>
                      <span className="text-muted-foreground">Discuss goals and choose your program</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-orange-yellow flex items-center justify-center text-black font-bold text-sm">
                        4
                      </div>
                      <span className="text-muted-foreground">Start your transformation journey</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
