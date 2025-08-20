import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Target, Zap, Heart, Award, Calendar, Play } from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-50 pb-42 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/manexercising.jpg"
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
              Training Programs & Classes
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <span className="block text-white mb-4">Specialized Programs for</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Every Goal</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              From foundational movement patterns to elite performance training, discover the perfect program to match
              your current level and ambitious goals.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ease-out shadow-xl group hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-3">
                  <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  View All Programs
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

      {/* Featured Programs */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our most popular and effective training programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-orange-500 hover:border-yellow-500 transition-all glow-orange relative overflow-hidden group hover:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="gradient-orange-yellow text-black font-bold px-4 py-1">MOST POPULAR</Badge>
              </div>
              <CardHeader className="pt-8 p-0">
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src="/womanexcercising.jpg"
                    alt="Total Body Transformation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Target className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <CardTitle className="font-heading text-2xl">Total Body Transformation</CardTitle>
                  <CardDescription>12-Week Complete Overhaul Program</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">12 weeks • 4-5 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">All fitness levels</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Full body strength & conditioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Tension reset protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Nutrition guidance included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Progress tracking system</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                  Start Program
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange overflow-hidden group hover:scale-105">
              <CardHeader className="p-0">
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src="/manexercising3.jpg"
                    alt="Athletic Performance"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <CardTitle className="font-heading text-2xl">Athletic Performance</CardTitle>
                  <CardDescription>Elite Sports Performance Enhancement</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">16 weeks • 5-6 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Intermediate to advanced</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Sport-specific training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Power & explosiveness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Injury prevention protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Recovery optimization</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                  Start Program
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow overflow-hidden group hover:scale-105">
              <CardHeader className="p-0">
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src="/womanexcercising2.jpg"
                    alt="Movement Restoration"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full gradient-orange-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Heart className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <CardTitle className="font-heading text-2xl">Movement Restoration</CardTitle>
                  <CardDescription>Injury Recovery & Pain Relief</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">8 weeks • 3-4 sessions/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">All levels • Injury recovery</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Pain reduction techniques</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Mobility restoration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Corrective exercises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Gradual strength building</span>
                  </li>
                </ul>
                <Button className="w-full gradient-orange-yellow text-black font-bold hover:scale-105 transition-all">
                  Start Program
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Program <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect program category for your specific goals and experience level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center">
                    <Target className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-2xl">Strength & Conditioning</CardTitle>
                    <CardDescription>Build power, endurance, and resilience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">Beginner Programs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Foundation Builder (6 weeks)</li>
                      <li>• Bodyweight Basics (4 weeks)</li>
                      <li>• Movement Fundamentals (8 weeks)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-400">Advanced Programs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Elite Strength (12 weeks)</li>
                      <li>• Power Development (10 weeks)</li>
                      <li>• Competition Prep (16 weeks)</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  Explore Strength Programs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center">
                    <Heart className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-2xl">Recovery & Mobility</CardTitle>
                    <CardDescription>Restore function and prevent injury</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">Recovery Programs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Tension Reset (30 days)</li>
                      <li>• Active Recovery (4 weeks)</li>
                      <li>• Sleep Optimization (6 weeks)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-400">Mobility Programs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Daily Mobility (ongoing)</li>
                      <li>• Desk Worker Relief (8 weeks)</li>
                      <li>• Athletic Flexibility (12 weeks)</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  Explore Recovery Programs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center">
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-2xl">Sport-Specific Training</CardTitle>
                    <CardDescription>Tailored for your sport or activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">Team Sports</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Basketball Performance</li>
                      <li>• Soccer Conditioning</li>
                      <li>• Football Strength</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-400">Individual Sports</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Running Performance</li>
                      <li>• Tennis Agility</li>
                      <li>• Golf Mobility</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Explore Sport Programs</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-orange-yellow flex items-center justify-center">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-2xl">Specialized Programs</CardTitle>
                    <CardDescription>Unique approaches for specific needs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">Age-Specific</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Youth Athletics (13-18)</li>
                      <li>• Masters Training (50+)</li>
                      <li>• Senior Fitness (65+)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-400">Lifestyle-Based</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Busy Professional</li>
                      <li>• New Parent Fitness</li>
                      <li>• Travel Warrior</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full gradient-orange-yellow text-black font-bold">
                  Explore Specialized Programs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Virtual Classes */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Virtual <span className="gradient-text">Classes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join live virtual classes and connect with the All Levels Athletics community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Mon, Wed, Fri</span>
                  </div>
                </div>
                <CardTitle className="font-heading text-xl">Morning Movement</CardTitle>
                <CardDescription>Start your day with energy and focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">7:00 AM - 7:30 AM PST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Max 20 participants</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dynamic warm-up, mobility work, and energizing movements to kickstart your day.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Join Class</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-yellow-500/50 transition-all hover:glow-yellow">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">RECORDED</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-4 h-4" />
                    <span>On-Demand</span>
                  </div>
                </div>
                <CardTitle className="font-heading text-xl">Tension Reset Workshop</CardTitle>
                <CardDescription>Master the fundamentals of tension release</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">45 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">All levels welcome</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn the core principles of our tension reset methodology with hands-on practice.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Watch Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-muted hover:border-orange-500/50 transition-all hover:glow-orange">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PREMIUM</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Saturdays</span>
                  </div>
                </div>
                <CardTitle className="font-heading text-xl">Elite Performance Lab</CardTitle>
                <CardDescription>Advanced training for serious athletes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">10:00 AM - 11:00 AM PST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Max 10 participants</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  High-intensity training session with personalized coaching and real-time feedback.
                </p>
                <Button className="w-full gradient-orange-yellow text-black font-bold">Join Elite Lab</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Why Choose Our <span className="gradient-text">Programs?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every program is built on proven principles and personalized to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Target className="w-10 h-10 text-black" />
              </div>
              <h3 className="font-heading text-xl font-bold">Personalized Approach</h3>
              <p className="text-muted-foreground">
                Every program is customized to your goals, experience level, and available time.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Award className="w-10 h-10 text-black" />
              </div>
              <h3 className="font-heading text-xl font-bold">Proven Results</h3>
              <p className="text-muted-foreground">
                Based on methods that have transformed 500+ athletes across all levels.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Users className="w-10 h-10 text-black" />
              </div>
              <h3 className="font-heading text-xl font-bold">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Direct access to professional coaching and ongoing support throughout your journey.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-orange-yellow flex items-center justify-center">
                <Zap className="w-10 h-10 text-black" />
              </div>
              <h3 className="font-heading text-xl font-bold">Progressive System</h3>
              <p className="text-muted-foreground">
                Structured progression that adapts as you grow stronger and more capable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your <span className="gradient-text">Perfect Program?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take our quick assessment to discover which program will help you achieve your goals fastest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-orange-yellow text-black font-bold text-lg px-8 py-4 glow-orange hover:scale-105 transition-all"
              >
                Take Program Assessment
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
