"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Zap, Heart, Brain, ArrowRight } from "lucide-react"
import { useEffect } from "react"

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Check if this element has already been animated
          if (target.getAttribute('data-animated') === 'true') {
            return;
          }
          
          const finalValue = parseInt(target.getAttribute('data-target') || '0');
          const suffix = target.textContent?.includes('+') ? '+' : 
                        target.textContent?.includes('%') ? '%' : '';
          
          // Mark as animated immediately
          target.setAttribute('data-animated', 'true');
          
          let currentValue = 0;
          const increment = finalValue / 50;
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              currentValue = finalValue;
              clearInterval(timer);
            }
            target.textContent = Math.floor(currentValue) + suffix;
          }, 30);
          
          // Stop observing this element since it's been animated
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    const countElements = document.querySelectorAll('.animate-count-up');
    countElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-50 pb-42 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/woman.jpg"
            alt="Athletic woman background"
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
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="block text-white mb-4">Transforming Lives Through</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Elite Training</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Founded on the belief that every athlete deserves world-class training, regardless of their starting
              point. We combine cutting-edge science with personalized coaching to unlock your true potential.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ease-out shadow-xl group hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Your Journey
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-orange-500/50 text-orange-400 font-semibold text-base px-6 py-4 rounded-full transition-all duration-300 ease-out hover:bg-orange-500/10 hover:border-orange-500/70 hover:text-orange-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Meet Our Team
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.08),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Statistics Section */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto relative">
            {/* Shared background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 rounded-3xl"></div>
            
            {/* Left side - Image Slideshow */}
            <div className="relative overflow-hidden rounded-2xl h-auto shadow-2xl">
              <div className="relative w-full h-full">
                <img
                  src="/athletic-person-gym.png"
                  alt="Athletic training"
                  className="w-full h-full object-cover animate-fade-in-out"
                />
                <img
                  src="/manexercising.jpg"
                  alt="Man exercising"
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in-out-delayed"
                />
                <img
                  src="/dumbell.jpg"
                  alt="Dumbbell training"
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in-out-delayed-2"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Right side - Statistics */}
            <div className="space-y-10 relative">
              <div>
                <h3 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                  Proven <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Results</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Numbers that speak for themselves</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Primary Stats - Top Row */}
                <Card className="bg-black border border-orange-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors animate-count-up" data-target="500">0+</div>
                      <div className="text-white/80 font-semibold text-sm">Athletes Transformed</div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black border border-orange-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors animate-count-up" data-target="98">0%</div>
                      <div className="text-white/80 font-semibold text-sm">Client Success Rate</div>
                    </div>
                  </div>
                </Card>

                {/* Secondary Stats - Bottom Row */}
                <Card className="bg-black border border-orange-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors animate-count-up" data-target="3">0</div>
                      <div className="text-white/80 font-semibold text-sm">Years of Excellence</div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black border border-orange-500/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors">24/7</div>
                      <div className="text-white/80 font-semibold text-sm">Support Available</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.08),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Purpose</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Driving transformation through innovative coaching and unwavering commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20">
            {/* Mission Card */}
            <Card className="group bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 relative overflow-hidden h-96">
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                  <Target className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-heading text-3xl mb-4 text-white group-hover:text-orange-400 transition-colors duration-300">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  To democratize elite athletic training by making world-class coaching accessible to everyone,
                  everywhere. We believe that with the right guidance, tools, and mindset, anyone can achieve
                  extraordinary results regardless of their starting point or location.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="group bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden h-96">
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/30 transition-all duration-300">
                  <Zap className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-heading text-3xl mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  To create a global community of empowered athletes who understand that true strength comes from
                  within. We envision a world where physical limitations become stepping stones to greatness, and every
                  individual has the tools to unlock their peak performance.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
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
