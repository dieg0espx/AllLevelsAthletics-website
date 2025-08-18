import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Zap, Heart, Brain } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="gradient-orange-yellow text-black font-bold mb-6 text-lg px-6 py-2">
              About All Levels Athletics
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transforming Lives Through
              <span className="block gradient-text">Elite Training</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Founded on the belief that every athlete deserves world-class training, regardless of their starting
              point. We combine cutting-edge science with personalized coaching to unlock your true potential.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-orange-500/30 glow-orange">
              <CardHeader className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-3xl mb-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize elite athletic training by making world-class coaching accessible to everyone,
                  everywhere. We believe that with the right guidance, tools, and mindset, anyone can achieve
                  extraordinary results regardless of their starting point or location.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-yellow-500/30 glow-yellow">
              <CardHeader className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-3xl mb-4">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a global community of empowered athletes who understand that true strength comes from
                  within. We envision a world where physical limitations become stepping stones to greatness, and every
                  individual has the tools to unlock their peak performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Meet <span className="gradient-text">Daniel Ledbetter</span>
              </h2>
              <p className="text-xl text-muted-foreground">Founder & Lead Performance Coach</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-full h-96 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-8xl">👨‍💼</div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Daniel's journey into elite performance coaching began with his own transformation. After years of
                  struggling with traditional training methods that left him frustrated and plateaued, he discovered the
                  revolutionary power of tension-based training and myofascial release techniques.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  What started as a personal breakthrough quickly evolved into a mission to help others. Daniel spent
                  years studying under world-renowned coaches, mastering the science of human movement, and developing
                  his unique methodology that combines cutting-edge training principles with personalized coaching.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, Daniel has helped over 500 athletes achieve their goals, from weekend warriors to elite
                  competitors. His innovative approach to online coaching has revolutionized how people think about
                  remote training, proving that distance is no barrier to exceptional results.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Certified Performance Coach
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Myofascial Release Specialist
                  </Badge>
                  <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30">
                    500+ Clients Transformed
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Heart className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-2xl">Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in honest, transparent coaching that meets you where you are, not where you think you
                  should be.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow text-center">
              <CardHeader>
                <Brain className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="font-heading text-2xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We constantly evolve our methods, incorporating the latest science and technology to deliver superior
                  results.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange text-center">
              <CardHeader>
                <Users className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <CardTitle className="font-heading text-2xl">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We foster a supportive environment where every athlete feels valued, challenged, and empowered to
                  succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats & Achievements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Proven <span className="gradient-text">Results</span>
            </h2>
            <p className="text-xl text-muted-foreground">Numbers that speak for themselves</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Users className="w-10 h-10 text-black" />
              </div>
              <div className="text-4xl font-bold gradient-text">500+</div>
              <div className="text-muted-foreground">Athletes Transformed</div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Award className="w-10 h-10 text-black" />
              </div>
              <div className="text-4xl font-bold gradient-text">98%</div>
              <div className="text-muted-foreground">Client Success Rate</div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Target className="w-10 h-10 text-black" />
              </div>
              <div className="text-4xl font-bold gradient-text">3</div>
              <div className="text-muted-foreground">Years of Excellence</div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Zap className="w-10 h-10 text-black" />
              </div>
              <div className="text-4xl font-bold gradient-text">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your <span className="gradient-text">Transformation?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the All Levels Athletics community and discover what you're truly capable of achieving.
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
