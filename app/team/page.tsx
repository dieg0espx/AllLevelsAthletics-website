import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Users, Target, Heart, Phone, Mail, Calendar } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">Meet Our Team</Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Expert Coaches Dedicated to
              <span className="block gradient-text">Your Success</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Our team combines decades of experience, cutting-edge knowledge, and genuine passion for helping athletes
              at every level achieve their peak performance.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-orange-500 glow-orange overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="gradient-orange-yellow text-black font-bold px-4 py-2">
                      FOUNDER & LEAD COACH
                    </Badge>
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gradient-text">Daniel Ledbetter</h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Certified Performance Coach & Myofascial Release Specialist
                  </p>

                  <div className="space-y-4 mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      Daniel's revolutionary approach to training has transformed over 500 athletes, from weekend
                      warriors to elite competitors. His unique methodology combines cutting-edge science with
                      personalized coaching to unlock each client's true potential.
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                      After discovering the power of tension-based training through his own transformation journey,
                      Daniel dedicated years to mastering the science of human movement and developing his signature
                      tension reset methodology.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-2">500+</div>
                      <div className="text-sm text-muted-foreground">Athletes Transformed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-2">3+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-2">5★</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                      Book Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-orange-500 text-white hover:bg-orange-500/10 bg-transparent"
                    >
                      View Credentials
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 flex items-center justify-center mb-6">
                      <div className="text-8xl">👨‍💼</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">760-585-8832</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">AllLevelsAthletics@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications & Expertise */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Certifications & <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our team maintains the highest standards of professional development and continuing education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Award className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-xl">Certified Performance Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced certification in performance coaching with specialization in strength and conditioning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Target className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-xl">Myofascial Release Specialist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Expert-level training in myofascial release techniques and tension reset methodologies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Heart className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-xl">Movement Restoration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Specialized training in corrective exercise and injury prevention protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Users className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-xl">Online Coaching Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced certification in remote coaching techniques and virtual training methodologies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Star className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-xl">Nutrition Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Certified in sports nutrition and dietary coaching for optimal performance and recovery.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-xl">Continuing Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Committed to ongoing professional development and staying current with industry best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
              Our <span className="gradient-text">Philosophy</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
                <CardHeader className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <CardTitle className="font-heading text-xl">Authenticity First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We meet you where you are, not where you think you should be. Honest, transparent coaching that
                    respects your journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
                <CardHeader className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <CardTitle className="font-heading text-xl">Science-Based</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every method we use is backed by research and proven results. We combine cutting-edge science with
                    practical application.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <CardTitle className="font-heading text-xl">Community Focused</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in the power of community. Every client becomes part of a supportive network of
                    like-minded athletes.
                  </p>
                </CardContent>
              </Card>
            </div>

            <blockquote className="text-2xl md:text-3xl font-heading italic text-muted-foreground mb-8 leading-relaxed">
              "True strength isn't just physical—it's the confidence that comes from knowing you can overcome any
              challenge life throws your way."
            </blockquote>
            <div className="text-lg gradient-text font-semibold">— Daniel Ledbetter, Founder</div>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              What Our Clients <span className="gradient-text">Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real transformations from real people who trusted us with their fitness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 flex items-center justify-center">
                    <span className="text-xl font-bold">S</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sarah M.</CardTitle>
                    <CardDescription>Marathon Runner</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Daniel's tension reset method completely changed my running. I PR'd in my marathon and haven't had an
                  injury in over a year. His approach is revolutionary."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 flex items-center justify-center">
                    <span className="text-xl font-bold">M</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mike T.</CardTitle>
                    <CardDescription>Busy Executive</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "As a busy executive, I needed something that worked with my schedule. Daniel's online coaching gave
                  me the flexibility I needed and results I never thought possible."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 flex items-center justify-center">
                    <span className="text-xl font-bold">J</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jessica L.</CardTitle>
                    <CardDescription>Former Injury Recovery</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "After years of chronic pain, I thought I'd never be active again. Daniel's movement restoration
                  program gave me my life back. I'm stronger now than I was before my injury."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Growing Team */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Growing Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              As All Levels Athletics continues to grow, we're always looking for passionate coaches who share our
              values
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-2 border-orange-500/30 glow-orange">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-3xl mb-4">Join Our Mission</CardTitle>
                <CardDescription className="text-lg">
                  We're building a team of world-class coaches who are passionate about transforming lives through
                  fitness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-heading text-xl text-orange-400">What We Look For:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Certified fitness professionals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Passion for helping others succeed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Experience with online coaching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Commitment to continuous learning</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-heading text-xl text-yellow-400">What We Offer:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Competitive compensation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Flexible remote work</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Professional development opportunities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Supportive team environment</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text-center pt-6">
                  <Button className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 hover:scale-105 transition-all">
                    Apply to Join Our Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to Work with <span className="gradient-text">Our Team?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a consultation with Daniel and discover how our proven methodology can transform your training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 glow-orange hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-500 text-white hover:bg-orange-500/10 text-lg px-8 py-4 bg-transparent"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
