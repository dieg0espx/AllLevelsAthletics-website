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
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <section className="relative h-screen flex items-center overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10 h-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full py-12">
            {/* Left Column - Text & CTA */}
            <div className="space-y-6">
              {/* Elite badge */}
              <div className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-6 py-3 rounded-full shadow-lg">
                <Trophy className="w-5 h-5" />
                Elite Online Training Since 2020
                <Star className="w-5 h-5" />
              </div>

              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight">
                  <span className="block text-foreground">ALL LEVELS</span>
                  <span className="block text-orange-500">ATHLETICS</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-orange-500 rounded-full" />
                  <Zap className="w-6 h-6 text-orange-500" />
                  <div className="w-12 h-1 bg-orange-500 rounded-full" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Transform your body with{" "}
                  <span className="text-orange-500 font-semibold">premium online personal training</span>
                </p>
                <div className="grid grid-cols-1 gap-3 text-base text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>Revolutionary Tension Reset Techniques</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span>Professional Recovery Tools & Methods</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>500+ Success Stories & 98% Success Rate</span>
                  </div>
                </div>
              </div>

              {/* CTA section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-orange-500 text-white font-bold text-base px-6 py-3 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg group"
                  >
                    <span className="flex items-center gap-3">
                      <Play className="w-4 h-4" />
                      Start Free 7-Day Trial
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-base px-6 py-3 rounded-full transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      <Trophy className="w-4 h-4" />
                      View Success Stories
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>

                <p className="text-muted-foreground text-sm">
                  ✨ No credit card required • Cancel anytime • Join 500+ satisfied clients
                </p>
              </div>

            </div>

            {/* Right Column - Square Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-square">
                <div className="absolute inset-0 bg-orange-500/20 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-yellow-500/10 rounded-2xl transform -rotate-2"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/athletic-person-gym.png"
                    alt="Professional athletic training"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Floating stats card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-orange-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-orange-500 font-bold text-base">Daniel Ledbetter</div>
                        <div className="text-muted-foreground text-xs">Certified Personal Trainer</div>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground font-bold text-lg">500+</div>
                        <div className="text-muted-foreground text-xs">Clients</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-card/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Real <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              See how our clients transformed their lives with All Levels Athletics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src="/smiling-fitness-woman-headshot.png"
                    alt="Jessica M. - Client Success Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Quote className="w-8 h-8 text-orange-500 mx-auto opacity-50" />
                <p className="text-lg italic text-white/90">
                  "Lost 30 pounds and gained incredible strength. Daniel's tension reset techniques changed everything
                  for me!"
                </p>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-white">Jessica M.</div>
                  <div>Marketing Executive</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src="/confident-man-athletic-wear-headshot.png"
                    alt="Robert K. - Client Success Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Quote className="w-8 h-8 text-orange-500 mx-auto opacity-50" />
                <p className="text-lg italic text-white/90">
                  "Finally found a program that works with my busy schedule. The online coaching is incredibly
                  effective!"
                </p>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-white">Robert K.</div>
                  <div>Software Engineer</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src="/athletic-woman-headshot.png"
                    alt="Amanda L. - Client Success Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Quote className="w-8 h-8 text-orange-500 mx-auto opacity-50" />
                <p className="text-lg italic text-white/90">
                  "The MFRoller and tension reset course eliminated my chronic back pain. Life-changing results!"
                </p>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-white">Amanda L.</div>
                  <div>Physical Therapist</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ... existing services section ... */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Premium <span className="gradient-text">Training Services</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose your path to peak performance with our tier-based coaching system
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full border border-green-500/30">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">7-Day Free Trial • No Credit Card Required</span>
            </div>
          </div>

          {/* ... existing service cards ... */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {/* Starter Tier */}
            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30 text-lg px-4 py-2">
                  STARTER
                </Badge>
                <CardTitle className="font-heading text-3xl mb-4">Foundation</CardTitle>
                <div className="space-y-2 mb-4">
                  <div className="text-5xl font-black gradient-text">$197</div>
                  <CardDescription className="text-lg text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-lg">Perfect for beginners ready to start their fitness journey</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">1x/month personalized check-ins</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Fully customized training program</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Email support & guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Access to exercise library</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Nutrition guidelines</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-6 hover:scale-105 transition-all group-hover:shadow-2xl">
                  Start Foundation Program
                </Button>
              </CardContent>
            </Card>

            {/* Growth Tier - Most Popular */}
            <Card className="bg-card/80 border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange group relative backdrop-blur-sm scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="gradient-orange-yellow text-black font-bold px-6 py-2 text-lg shadow-2xl">
                  🔥 MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-10">
                <Badge className="w-fit mx-auto mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
                  GROWTH
                </Badge>
                <CardTitle className="font-heading text-3xl mb-4">Accelerated</CardTitle>
                <div className="space-y-2 mb-4">
                  <div className="text-5xl font-black gradient-text">$297</div>
                  <CardDescription className="text-lg text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-lg">Ideal for committed individuals seeking faster results</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">2x/month detailed check-ins</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">Form review & video feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">Progressive training adjustments</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">Priority email support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">Meal planning assistance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-lg">Recovery optimization</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-6 hover:scale-105 transition-all shadow-2xl">
                  Choose Growth Program
                </Button>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-6 bg-orange-600/20 text-orange-300 border-orange-600/30 text-lg px-4 py-2">
                  ELITE
                </Badge>
                <CardTitle className="font-heading text-3xl mb-4">Premium</CardTitle>
                <div className="space-y-2 mb-4">
                  <div className="text-5xl font-black gradient-text">$497</div>
                  <CardDescription className="text-lg text-muted-foreground">/month</CardDescription>
                </div>
                <p className="text-white/80 text-lg">Maximum support for serious athletes and professionals</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Weekly personalized check-ins</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Complete tension reset coaching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Video analysis & technique review</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Mobility prioritization program</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">24/7 text support access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">Supplement recommendations</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-6 hover:scale-105 transition-all group-hover:shadow-2xl">
                  Go Elite Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ... existing service comparison table ... */}
          <div className="max-w-5xl mx-auto">
            <Card className="bg-card/80 border-2 border-orange-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-2xl">Service Comparison</CardTitle>
                <CardDescription>See what's included in each tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-4 px-4 text-lg font-semibold">Features</th>
                        <th className="py-4 px-4 text-center text-lg font-semibold text-orange-400">Foundation</th>
                        <th className="py-4 px-4 text-center text-lg font-semibold text-yellow-400">Growth</th>
                        <th className="py-4 px-4 text-center text-lg font-semibold text-orange-300">Elite</th>
                      </tr>
                    </thead>
                    <tbody className="text-base">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">Check-in Frequency</td>
                        <td className="py-3 px-4 text-center">Monthly</td>
                        <td className="py-3 px-4 text-center">Bi-weekly</td>
                        <td className="py-3 px-4 text-center">Weekly</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">Custom Training Program</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">Form Review & Feedback</td>
                        <td className="py-3 px-4 text-center text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">Tension Reset Coaching</td>
                        <td className="py-3 px-4 text-center text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">24/7 Text Support</td>
                        <td className="py-3 px-4 text-center text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-400">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Professional <span className="gradient-text">Recovery Tools</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Premium products designed to accelerate your recovery and performance
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full border border-blue-500/30">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">30-Day Money-Back Guarantee</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-56 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/body-tension-reset-course.png"
                    alt="Body Tension Reset Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-red-500/90 text-white">50% OFF</Badge>
                </div>
                <CardTitle className="font-heading text-2xl mb-2">Body Tension Reset Course</CardTitle>
                <CardDescription className="text-lg">30-Day Self-Guided Program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-white/80">
                    Learn Daniel's revolutionary tension reset techniques that have helped hundreds of clients eliminate
                    chronic pain and improve performance.
                  </p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>30 detailed video lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Downloadable exercise guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Progress tracking sheets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold gradient-text">$49</span>
                  <span className="text-lg text-muted-foreground line-through">$99</span>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Launch Promo</Badge>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-4 hover:scale-105 transition-all">
                  Get Course Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-56 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/placeholder-717a8.png"
                    alt="MFRoller Professional Tool"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-green-500/90 text-white">In Stock</Badge>
                </div>
                <CardTitle className="font-heading text-2xl mb-2">MFRoller</CardTitle>
                <CardDescription className="text-lg">Professional Myofascial Release Tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-white/80">
                    The professional-grade myofascial release tool designed by Daniel for maximum effectiveness and
                    durability.
                  </p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Medical-grade materials</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Ergonomic design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Instruction manual included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>2-year warranty</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold gradient-text">$99</span>
                  <span className="text-base text-muted-foreground">+ free shipping</span>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-4 hover:scale-105 transition-all">
                  Order MFRoller
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange group relative backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="gradient-orange-yellow text-black font-bold px-6 py-2 text-lg shadow-2xl">
                  💎 BEST VALUE
                </Badge>
              </div>
              <CardHeader className="pt-10">
                <div className="w-full h-56 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/mfroller-course-bundle.png"
                    alt="Complete Bundle Package"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-purple-500/90 text-white">Limited Time</Badge>
                </div>
                <CardTitle className="font-heading text-2xl mb-2">Complete Bundle</CardTitle>
                <CardDescription className="text-lg">MFRoller + Course Package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-white/80">
                    Get everything you need for complete body transformation and recovery optimization.
                  </p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Body Tension Reset Course</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Professional MFRoller</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Bonus: Recovery protocols</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Free shipping & handling</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold gradient-text">$149</span>
                    <span className="text-lg text-muted-foreground line-through">$199</span>
                  </div>
                  <p className="text-lg text-green-400 font-semibold">Save $50 + Free Shipping!</p>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold text-lg py-4 hover:scale-105 transition-all shadow-2xl">
                  Get Complete Bundle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ... existing product guarantee section ... */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/80 border-2 border-green-500/30 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h3>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  We're so confident in our products that we offer a full 30-day money-back guarantee. If you're not
                  completely satisfied, we'll refund your purchase - no questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-card/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Why Choose <span className="gradient-text">All Levels Athletics?</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover what sets us apart from other online fitness programs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="relative">
              <img
                src="/tension-reset-coaching.png"
                alt="Daniel Ledbetter Professional Training"
                className="w-full h-[600px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-heading text-xl font-bold mb-2 gradient-text">Daniel Ledbetter</h3>
                  <p className="text-white/90">Certified Personal Trainer & Tension Reset Specialist</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Target className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Personalized Approach</h3>
                  <p className="text-white/80">
                    Every program is tailored specifically to your goals, fitness level, and lifestyle. No cookie-cutter
                    solutions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Proven Results</h3>
                  <p className="text-white/80">
                    Over 500 successful transformations with a 98% client satisfaction rate. Our methods work.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Expert Guidance</h3>
                  <p className="text-white/80">
                    Work directly with Daniel Ledbetter, a certified professional with years of experience in body
                    transformation.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Clock className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Flexible Scheduling</h3>
                  <p className="text-white/80">
                    Train on your schedule with online coaching that fits your busy lifestyle. No gym required.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Ongoing Support</h3>
                  <p className="text-white/80">
                    Get continuous support and motivation throughout your journey. You're never alone in this process.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full gradient-orange-yellow mx-auto mb-6 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4">Innovative Methods</h3>
                  <p className="text-white/80">
                    Revolutionary tension reset techniques and cutting-edge recovery methods you won't find elsewhere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ... existing final CTA and footer sections remain unchanged ... */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                Ready to <span className="gradient-text">Transform?</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Get started with your free 7-day trial today - no credit card required
              </p>
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full border border-green-500/30">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Free Trial • No Commitment • Cancel Anytime</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="font-heading text-2xl font-bold gradient-text">Get In Touch</h3>

                  <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Call or Text</div>
                      <div className="text-muted-foreground">760-585-8832</div>
                      <div className="text-sm text-white/60">Available evenings & weekends</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Email</div>
                      <div className="text-muted-foreground">AllLevelsAthletics@gmail.com</div>
                      <div className="text-sm text-white/60">Response within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Service Area</div>
                      <div className="text-muted-foreground">Nationwide (Online Only)</div>
                      <div className="text-sm text-white/60">Serving clients across all time zones</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Availability</div>
                      <div className="text-muted-foreground">Evenings & Weekends</div>
                      <div className="text-sm text-white/60">48-hour booking notice required</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold">Follow Our Journey</h3>
                  <div className="flex gap-4">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400 px-4 py-2 text-base">
                      TikTok: @AllLevelsAthletics
                    </Badge>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 px-4 py-2 text-base">
                      Instagram: @AllLevelsAthletics
                    </Badge>
                  </div>
                </div>
              </div>

              <Card className="bg-card/80 border-2 border-orange-500/30 glow-orange backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="font-heading text-3xl mb-2">Start Your Journey</CardTitle>
                  <CardDescription className="text-lg">
                    Join hundreds of satisfied clients who transformed their lives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Button className="w-full gradient-orange-yellow text-black font-bold text-xl py-8 hover:scale-105 transition-all shadow-2xl group">
                      <span className="flex items-center gap-3">
                        <Play className="w-6 h-6" />
                        Start Free 7-Day Trial
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>

                    <div className="text-center space-y-3">
                      <div className="text-sm text-muted-foreground">✨ No credit card required • Cancel anytime</div>
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 border-2 border-background" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-background" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 border-2 border-background" />
                        </div>
                        <div className="text-sm text-white/70">
                          <span className="font-semibold text-white">500+</span> clients transformed
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="text-center space-y-3">
                      <div className="text-lg font-semibold">Questions? We're here to help!</div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                        <Button
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email Us
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <Image
                  src="/logo.png"
                  alt="All Levels Athletics"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
                <p className="text-muted-foreground">
                  Transforming lives through personalized online training and revolutionary recovery techniques.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    500+ Clients
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                    98% Success Rate
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Services</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/services" className="hover:text-orange-400 transition-colors">
                      Foundation Training
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="hover:text-orange-400 transition-colors">
                      Growth Program
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="hover:text-orange-400 transition-colors">
                      Elite Coaching
                    </a>
                  </li>
                  <li>
                    <a href="/programs" className="hover:text-orange-400 transition-colors">
                      Specialized Programs
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Products</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#products" className="hover:text-orange-400 transition-colors">
                      Tension Reset Course
                    </a>
                  </li>
                  <li>
                    <a href="#products" className="hover:text-orange-400 transition-colors">
                      MFRoller
                    </a>
                  </li>
                  <li>
                    <a href="#products" className="hover:text-orange-400 transition-colors">
                      Complete Bundle
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="hover:text-orange-400 transition-colors">
                      Free Resources
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/about" className="hover:text-orange-400 transition-colors">
                      About Daniel
                    </a>
                  </li>
                  <li>
                    <a href="/team" className="hover:text-orange-400 transition-colors">
                      Our Team
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-orange-400 transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="hover:text-orange-400 transition-colors">
                      Blog & Resources
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <div className="text-muted-foreground mb-2">
                    © 2024 All Levels Athletics LLC. All rights reserved.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Website: AllLevelsAthletics.com | Email: AllLevelsAthletics@gmail.com
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    TikTok: @AllLevelsAthletics
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                    Instagram: @AllLevelsAthletics
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
