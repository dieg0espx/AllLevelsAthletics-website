import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, Users, Target, Zap, Heart, Award } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">
              Premium Training Services
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Choose Your Path to
              <span className="block gradient-text">Peak Performance</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Our tier-based coaching system is designed to meet you exactly where you are and take you exactly where
              you want to go. Every program includes our revolutionary tension reset methodology and personalized
              approach.
            </p>
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
            {/* Comparison Table */}
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Features Column */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-2 border-muted h-full">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="font-semibold">Monthly Check-ins</div>
                      <div className="font-semibold">Custom Program Design</div>
                      <div className="font-semibold">Form Review & Feedback</div>
                      <div className="font-semibold">Video Analysis</div>
                      <div className="font-semibold">Tension Coaching</div>
                      <div className="font-semibold">Mobility Prioritization</div>
                      <div className="font-semibold">Email Support</div>
                      <div className="font-semibold">Priority Support</div>
                      <div className="font-semibold">Training Progression</div>
                      <div className="font-semibold">Nutrition Guidance</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Starter Tier */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-2 border-orange-500/50 hover:border-orange-500 transition-all hover:glow-orange h-full">
                  <CardHeader className="text-center">
                    <Badge className="w-fit mx-auto mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
                      STARTER
                    </Badge>
                    <CardTitle className="font-heading text-2xl mb-2">Foundation</CardTitle>
                    <div className="text-4xl font-bold gradient-text mb-2">$197</div>
                    <CardDescription className="text-muted-foreground">/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                        <span className="ml-2">1x per month</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Tier */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-2 border-yellow-500 hover:border-yellow-400 transition-all glow-yellow h-full relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-orange-yellow text-black font-bold px-4 py-1">MOST POPULAR</Badge>
                  </div>
                  <CardHeader className="text-center pt-8">
                    <Badge className="w-fit mx-auto mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      GROWTH
                    </Badge>
                    <CardTitle className="font-heading text-2xl mb-2">Accelerated</CardTitle>
                    <div className="text-4xl font-bold gradient-text mb-2">$297</div>
                    <CardDescription className="text-muted-foreground">/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                        <span className="ml-2">2x per month</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                    <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                      Choose Growth
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Elite Tier */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-2 border-orange-600/50 hover:border-orange-600 transition-all hover:glow-orange h-full">
                  <CardHeader className="text-center">
                    <Badge className="w-fit mx-auto mb-4 bg-orange-600/20 text-orange-300 border-orange-600/30">
                      ELITE
                    </Badge>
                    <CardTitle className="font-heading text-2xl mb-2">Premium</CardTitle>
                    <div className="text-4xl font-bold gradient-text mb-2">$497</div>
                    <CardDescription className="text-muted-foreground">/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                        <span className="ml-2">Weekly</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                    <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                      Go Elite
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              What's <span className="gradient-text">Included</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every tier includes our core methodology and proven systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Target className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-2xl">Custom Program Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every program is built specifically for your goals, experience level, available equipment, and time
                  constraints.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-2xl">Tension Reset Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our revolutionary approach to releasing muscle tension and optimizing movement patterns for maximum
                  results.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Users className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-2xl">Expert Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Direct access to Daniel Ledbetter and his proven methodology that has transformed 500+ athletes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-2xl">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work around your schedule with evening and weekend availability. 48-hour booking notice required.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Heart className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-2xl">Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Never train alone. Get the support and accountability you need to stay consistent and motivated.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-2xl">Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join the 98% of clients who achieve their goals with our systematic approach to transformation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Digital Products Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Digital <span className="gradient-text">Products</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Self-guided programs and professional tools for independent training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">🎯</div>
                </div>
                <CardTitle className="font-heading text-xl">Body Tension Reset Course</CardTitle>
                <CardDescription>30-Day Self-Guided Program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold gradient-text">$49</span>
                  <span className="text-sm text-muted-foreground line-through">$99</span>
                  <Badge className="bg-red-500/20 text-red-400">Launch Promo</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    30 days of guided exercises
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Video demonstrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Progress tracking tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Lifetime access
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Get Course</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">🔄</div>
                </div>
                <CardTitle className="font-heading text-xl">MFRoller</CardTitle>
                <CardDescription>Professional Myofascial Release Tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold gradient-text">$99</span>
                  <span className="text-sm text-muted-foreground">+ shipping</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Professional-grade construction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Targeted pressure zones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Instruction manual included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    30-day money-back guarantee
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Order Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="gradient-orange-yellow text-black font-bold px-4 py-1">BEST VALUE</Badge>
              </div>
              <CardHeader className="pt-8">
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">📦</div>
                </div>
                <CardTitle className="font-heading text-xl">Complete Bundle</CardTitle>
                <CardDescription>MFRoller + Course Package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold gradient-text">$149</span>
                  <span className="text-sm text-muted-foreground line-through">$199</span>
                </div>
                <p className="text-sm text-green-400 mb-4">Save $50!</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Everything from both products
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Bonus integration guide
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Free shipping
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Get Bundle</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Special <span className="gradient-text">Offers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Limited-time deals to get you started on your transformation journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-green-500/50 hover:border-green-500 transition-all hover:glow-green">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <CardTitle className="font-heading text-2xl">Free 7-Day Trial</CardTitle>
                <CardDescription>Experience our coaching risk-free</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Get full access to our Starter program for 7 days. No commitment, no credit card required.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-blue-500/50 hover:border-blue-500 transition-all hover:glow-blue">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">🎁</div>
                <CardTitle className="font-heading text-2xl">BOGO MFRoller</CardTitle>
                <CardDescription>Buy 2, Get 1 Free - Limited Time</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Perfect for training partners or family. Get three professional MFRollers for the price of two.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Claim Offer</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-purple-500/50 hover:border-purple-500 transition-all hover:glow-purple">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <CardTitle className="font-heading text-2xl">6-Month Discount</CardTitle>
                <CardDescription>Save 10% on any coaching tier</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Commit to your transformation with our 6-month packages and save 10% on your monthly rate.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Get Discount</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our services
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">How does online training work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our online training combines personalized program design with regular check-ins via video calls, form
                  reviews through video submissions, and ongoing support through our communication platform. You'll
                  receive your custom workout program and can reach out anytime for guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">What equipment do I need?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Programs are designed around your available equipment. Whether you have a full gym, basic home setup,
                  or just bodyweight, we'll create an effective program for you. We'll discuss your equipment during
                  your initial consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Can I change tiers anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can upgrade or downgrade your coaching tier at any time. Changes take effect at your next billing
                  cycle, and we'll adjust your program and support level accordingly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted">
              <CardHeader>
                <CardTitle className="font-heading text-xl">What is the tension reset method?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="gradient-text">Training?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of athletes who have already discovered the power of our proven methodology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 glow-orange hover:scale-105 transition-all"
              >
                Start Free 7-Day Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-500 text-white hover:bg-orange-500/10 text-lg px-8 py-4 bg-transparent"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
