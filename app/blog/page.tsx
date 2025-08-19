import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Play, Download, Clock, User, ArrowRight, Search, Filter, Star } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">
              Blog & Resources
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Knowledge That
              <span className="block gradient-text">Transforms</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Dive deep into the science of training, recovery, and performance optimization. Get expert insights,
              practical tips, and proven strategies to accelerate your fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10 bg-background" />
              </div>
              <Button className="gradient-orange-yellow text-black font-bold">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Articles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our most popular and impactful content to help you train smarter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange relative group">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="gradient-orange-yellow text-black font-bold px-4 py-1">FEATURED</Badge>
              </div>
              <CardHeader className="pt-8">
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-orange-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>8 min read</span>
                  <User className="w-4 h-4 ml-2" />
                  <span>Daniel Ledbetter</span>
                </div>
                <CardTitle className="font-heading text-xl group-hover:gradient-text transition-all">
                  The Science Behind Tension Reset: Why It Works
                </CardTitle>
                <CardDescription>
                  Discover the revolutionary methodology that's transforming how athletes approach training and
                  recovery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Training
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Science
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange group">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>12 min read</span>
                  <User className="w-4 h-4 ml-2" />
                  <span>Daniel Ledbetter</span>
                </div>
                <CardTitle className="font-heading text-xl group-hover:gradient-text transition-all">
                  5 Common Training Mistakes That Kill Progress
                </CardTitle>
                <CardDescription>
                  Avoid these critical errors that keep most people from reaching their true potential in the gym.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Mistakes
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Tips
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow group">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <Star className="w-16 h-16 text-orange-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>15 min read</span>
                  <User className="w-4 h-4 ml-2" />
                  <span>Daniel Ledbetter</span>
                </div>
                <CardTitle className="font-heading text-xl group-hover:gradient-text transition-all">
                  From Beginner to Elite: A Complete Roadmap
                </CardTitle>
                <CardDescription>
                  The step-by-step progression system that takes athletes from their first workout to peak performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Progression
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Guide
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for with our organized content categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center group cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Training Science</CardTitle>
                <CardDescription>Evidence-based training principles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text mb-2">24</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center group cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Recovery & Mobility</CardTitle>
                <CardDescription>Optimize rest and movement quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text mb-2">18</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center group cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Success Stories</CardTitle>
                <CardDescription>Real transformations and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text mb-2">12</div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center group cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="font-heading text-xl">Free Resources</CardTitle>
                <CardDescription>Downloadable guides and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text mb-2">8</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Recent <span className="gradient-text">Articles</span>
              </h2>
              <p className="text-xl text-muted-foreground">Stay up to date with our latest insights and tips</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-orange-500 text-white hover:bg-orange-500/10 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <div className="grid md:grid-cols-4 gap-6 p-6">
                <div className="md:col-span-1">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>6 min read</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold hover:gradient-text transition-all cursor-pointer">
                    The Role of Sleep in Athletic Performance
                  </h3>
                  <p className="text-muted-foreground">
                    Discover how optimizing your sleep can dramatically improve your training results, recovery speed,
                    and overall performance metrics.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Recovery
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sleep
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <div className="grid md:grid-cols-4 gap-6 p-6">
                <div className="md:col-span-1">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Play className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>10 min read</span>
                    <span>•</span>
                    <span>5 days ago</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold hover:gradient-text transition-all cursor-pointer">
                    Building Mental Resilience Through Physical Training
                  </h3>
                  <p className="text-muted-foreground">
                    Learn how structured physical challenges can develop the mental toughness needed to overcome any
                    obstacle in life.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Mindset
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Mental Health
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <div className="grid md:grid-cols-4 gap-6 p-6">
                <div className="md:col-span-1">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>7 min read</span>
                    <span>•</span>
                    <span>1 week ago</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold hover:gradient-text transition-all cursor-pointer">
                    Nutrition Timing: When to Eat for Maximum Results
                  </h3>
                  <p className="text-muted-foreground">
                    Master the art of nutrient timing to fuel your workouts, optimize recovery, and accelerate your
                    transformation.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Nutrition
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Timing
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 hover:scale-105 transition-all">
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Free Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Free <span className="gradient-text">Resources</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Download our comprehensive guides and tools to accelerate your fitness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <Download className="w-12 h-12 text-orange-500" />
                </div>
                <CardTitle className="font-heading text-xl">Complete Beginner's Guide</CardTitle>
                <CardDescription>Everything you need to start your fitness journey right</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 30-page comprehensive guide</li>
                  <li>• Exercise demonstrations</li>
                  <li>• Nutrition basics</li>
                  <li>• Goal setting framework</li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-yellow-500" />
                </div>
                <CardTitle className="font-heading text-xl">Tension Reset Workbook</CardTitle>
                <CardDescription>Master our signature methodology with this detailed workbook</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Step-by-step protocols</li>
                  <li>• Assessment tools</li>
                  <li>• Progress tracking sheets</li>
                  <li>• Video access links</li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <Star className="w-12 h-12 text-orange-500" />
                </div>
                <CardTitle className="font-heading text-xl">Recovery Optimization Toolkit</CardTitle>
                <CardDescription>Advanced strategies for faster recovery and better results</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Sleep optimization guide</li>
                  <li>• Stress management techniques</li>
                  <li>• Recovery tracking templates</li>
                  <li>• Supplement recommendations</li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-2 border-orange-500/30 glow-orange">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-3xl mb-4">Stay Updated</CardTitle>
                <CardDescription className="text-lg">
                  Get the latest articles, tips, and exclusive content delivered straight to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input placeholder="Enter your email address" className="bg-background flex-1" />
                  <Button className="gradient-orange-yellow text-black font-bold">Subscribe</Button>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Join 2,500+ athletes getting weekly insights</p>
                  <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                    <span>✓ No spam, ever</span>
                    <span>✓ Unsubscribe anytime</span>
                    <span>✓ Exclusive content</span>
                  </div>
                </div>
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
              Ready to Apply This <span className="gradient-text">Knowledge?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Reading is just the first step. Let's put these proven strategies to work in your personalized training
              program.
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
