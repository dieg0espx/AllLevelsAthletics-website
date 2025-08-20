"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Zap, Heart, Brain, ArrowRight, Instagram, MessageCircle, Play, Trophy } from "lucide-react"
import { useEffect, useState, useRef } from "react"

// Extend Window interface for TikTok embed
declare global {
  interface Window {
    TikTokEmbed?: {
      reloadEmbeds: () => void;
    };
  }
}

// TikTok Video Component using official embed
function TikTokVideo({ videoId, url }: { videoId: string; url: string }) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Load TikTok embed script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).TikTokEmbed) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => {
        // Reload embeds after script loads
        if ((window as any).TikTokEmbed) {
          (window as any).TikTokEmbed.reloadEmbeds();
        }
      };
      document.head.appendChild(script);
    } else if ((window as any).TikTokEmbed) {
      // If script is already loaded, reload embeds
      (window as any).TikTokEmbed.reloadEmbeds();
    }
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[800px] bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
        <div className="text-6xl">🎬</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[800px]" ref={containerRef}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: '100%', minWidth: '100%', height: '100%' }}
      >
        <section></section>
      </blockquote>
    </div>
  );
}



export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background">

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-gradient-to-br from-black via-gray-900 to-black">
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight">
              <span className="block text-white mb-2 sm:mb-4">Transforming Lives Through</span>
              <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Elite Training</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              Founded on the belief that every athlete deserves world-class training, regardless of their starting
              point. We combine cutting-edge science with personalized coaching to unlock your true potential.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                                            className="w-full h-full object-cover"
                />
                <img
                  src="/manexercising.jpg"
                  alt="Man exercising"
                                            className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src="/dumbell.jpg"
                  alt="Dumbbell training"
                                            className="absolute inset-0 w-full h-full object-cover"
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
                                                  <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors" data-target="500">500+</div>
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
                                                  <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors" data-target="98">98%</div>
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
                                                  <div className="text-4xl font-black text-orange-500 mb-1 group-hover:text-orange-400 transition-colors" data-target="3">3</div>
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
      <section className="gradient-bg-variant-a py-20 overflow-hidden">
        <div className="wave-pattern-a"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Purpose</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90 h-96">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-white">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize elite athletic training by making world-class coaching accessible to everyone,
                    everywhere. We believe that with the right guidance, tools, and mindset, anyone can achieve
                    extraordinary results regardless of their starting point or location.
                  </p>

                </CardContent>
              </Card>
            </div>

            {/* Vision */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90 h-96">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-white">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a global community of empowered athletes who understand that true strength comes from
                    within. We envision a world where physical limitations become stepping stones to greatness, and every
                    individual has the tools to unlock their peak performance.
                  </p>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recent TikTok Videos */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                Recent <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Transformations</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Watch real results and training tips from our TikTok community
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                <a 
                  href="https://www.tiktok.com/@alllevelsathletics?_t=ZS-8z0yXonAvtS&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline cursor-pointer"
                >
                  @AllLevelsAthletics
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* TikTok Video 1 */}
              <div className="h-[800px]">
                <TikTokVideo 
                  videoId="7483302730698607903"
                  url="https://www.tiktok.com/@alllevelsathletics/video/7483302730698607903?_r=1&_t=ZS-8z0yXonAvtS"
                />
              </div>

              {/* TikTok Video 2 */}
              <div className="h-[800px]">
                <TikTokVideo 
                  videoId="7480011972436692255"
                  url="https://www.tiktok.com/@alllevelsathletics/video/7480011972436692255"
                />
              </div>

              {/* TikTok Video 3 */}
              <div className="h-[800px]">
                <TikTokVideo 
                  videoId="7479345034266037535"
                  url="https://www.tiktok.com/@alllevelsathletics/video/7479345034266037535"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

                    {/* Founder Story */}
              <section className="gradient-bg-variant-a py-20 overflow-hidden">
                <div className="wave-pattern-a"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Meet <span className="gradient-text">Daniel Ledbetter</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">Founder & Lead Performance Coach</p>
            </div>

                                <div className="grid md:grid-cols-2 gap-12 items-stretch">
              <div className="space-y-6">
                                      <div className="relative group h-full">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                          <img
                            src="/gymTrainer.jpg"
                            alt="Daniel Ledbetter - Founder & Lead Performance Coach"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-yellow-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {/* Border glow */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:border-white/60 transition-all duration-500"></div>
                      </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-lg text-white/90 leading-relaxed">
                    Daniel's journey into elite performance coaching began with his own transformation. After years of
                    struggling with traditional training methods that left him frustrated and plateaued, he discovered the
                    revolutionary power of tension-based training and myofascial release techniques.
                  </p>

                  <p className="text-lg text-white/90 leading-relaxed">
                    What started as a personal breakthrough quickly evolved into a mission to help others. Daniel spent
                    years studying under world-renowned coaches, mastering the science of human movement, and developing
                    his unique methodology that combines cutting-edge training principles with personalized coaching.
                  </p>

                  <p className="text-lg text-white/90 leading-relaxed">
                    Today, Daniel has helped over 500 athletes achieve their goals, from weekend warriors to elite
                    competitors. His innovative approach to online coaching has revolutionized how people think about
                    remote training, proving that distance is no barrier to exceptional results.
                  </p>
                </div>

                                        <div className="space-y-6">
                          <h3 className="font-heading text-2xl font-bold text-white mb-6">Expertise & Achievements</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                  <Award className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-orange-400">Certified Performance Coach</h4>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-4 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                  <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-yellow-400">Myofascial Release Specialist</h4>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-600/10 to-orange-700/10 border border-orange-600/20 rounded-xl p-4 hover:from-orange-600/20 hover:to-orange-700/20 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-orange-300">500+ Clients Transformed</h4>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-700/10 border border-yellow-600/20 rounded-xl p-4 hover:from-yellow-600/20 hover:to-yellow-700/20 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-yellow-300">Elite Training Methods</h4>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-4 hover:from-orange-500/20 hover:to-yellow-500/20 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-orange-400">Online Coaching Pioneer</h4>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-8 py-4 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105">
                            <span className="flex items-center gap-3 text-lg">
                              <Users className="w-6 h-6" />
                              Start Your Transformation
                            </span>
                          </Button>
                          <p className="text-center text-sm text-muted-foreground mt-3">
                            Join 500+ athletes who've already transformed their lives
                          </p>
                        </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Authenticity */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-white">Authenticity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe in honest, transparent coaching that meets you where you are, not where you think you
                    should be.
                  </p>
                  <div className="mt-6 pt-4 border-t border-orange-500/20">
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Transparent Communication</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Innovation */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 text-center group-hover:bg-card/90">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-white">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We constantly evolve our methods, incorporating the latest science and technology to deliver superior
                    results.
                  </p>
                  <div className="mt-6 pt-4 border-t border-yellow-500/20">
                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Cutting-Edge Methods</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 text-center group-hover:bg-card/90">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-white">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We foster a supportive environment where every athlete feels valued, challenged, and empowered to
                    succeed.
                  </p>
                  <div className="mt-6 pt-4 border-t border-orange-500/20">
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Supportive Network</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg-variant-a py-20 overflow-hidden">
        <div className="wave-pattern-a"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Ready to Start Your <span className="gradient-text">Transformation?</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the All Levels Athletics community and discover what you're truly capable of achieving.
            </p>
            
            {/* Enhanced buttons with better styling */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold text-lg px-10 py-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border-2 border-orange-400/20"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Start Free 7-Day Trial
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-500 text-white hover:bg-yellow-500/10 hover:text-yellow-300 text-lg px-10 py-6 rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
              >
                <span className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" />
                  Schedule Consultation
                </span>
              </Button>
            </div>




          </div>
        </div>
      </section>
    </div>
  )
}
