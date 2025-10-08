"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Target,
  Lock,
  Users,
  Award,
  BookOpen,
  Zap,
  Heart,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  Star
} from "lucide-react"
import { courseVideos, CourseVideo } from "@/lib/course-videos"

export default function TensionReleaseProgramPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { canAccessContent, loading: subscriptionLoading } = useSubscription()
  const [isLoading, setIsLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<CourseVideo | null>(null)
  const [watchedVideos, setWatchedVideos] = useState<Set<number>>(new Set())
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    // Ensure user has the program in their database record and load progress
    ensureUserProgram()
    loadUserProgress()
    
    // Set first video as current if none selected
    if (!currentVideo && courseVideos.length > 0) {
      setCurrentVideo(courseVideos[0])
    }
    
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router, currentVideo])

  const handleVideoSelect = (video: CourseVideo) => {
    setCurrentVideo(video)
    setCurrentVideoIndex(courseVideos.findIndex(v => v.id === video.id))
    setShowWelcome(false)
  }

  const handleVideoComplete = (videoId: number) => {
    const newWatched = new Set(watchedVideos)
    newWatched.add(videoId)
    setWatchedVideos(newWatched)
    const newProgress = (newWatched.size / courseVideos.length) * 100
    setProgress(newProgress)
    
    // Save to localStorage (user-specific)
    if (user?.id) {
      const userSpecificKey = `tension-release-watched-${user.id}`
      localStorage.setItem(userSpecificKey, JSON.stringify([...newWatched]))
    }
    
    // Sync progress with backend
    syncProgressWithBackend(newProgress, [...newWatched])
  }

  const handleManualComplete = (videoId: number) => {
    handleVideoComplete(videoId)
  }

  const loadUserProgress = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/user-programs?userId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        const program = data.programs?.find((p: any) => p.program_id === 'tension-release-program')
        
        if (program && program.watched_videos && program.watched_videos.length > 0) {
          // Load from database
          const watched = new Set<number>(program.watched_videos)
          setWatchedVideos(watched)
          setProgress(program.progress || 0)
          
          // Also save to localStorage for offline access
          const userSpecificKey = `tension-release-watched-${user.id}`
          localStorage.setItem(userSpecificKey, JSON.stringify(program.watched_videos))
        } else {
          // Fallback to localStorage if database doesn't have data yet
          const userSpecificKey = `tension-release-watched-${user.id}`
          const savedWatched = localStorage.getItem(userSpecificKey)
          if (savedWatched) {
            const watched = new Set<number>(JSON.parse(savedWatched) as number[])
            setWatchedVideos(watched)
            const progressValue = (watched.size / courseVideos.length) * 100
            setProgress(progressValue)
            
            // Sync to database
            if (watched.size > 0) {
              syncProgressWithBackend(progressValue, [...watched])
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
      
      // Fallback to localStorage
      const userSpecificKey = `tension-release-watched-${user.id}`
      const savedWatched = localStorage.getItem(userSpecificKey)
      if (savedWatched) {
        const watched = new Set<number>(JSON.parse(savedWatched) as number[])
        setWatchedVideos(watched)
        const progressValue = (watched.size / courseVideos.length) * 100
        setProgress(progressValue)
      }
    }
  }

  const ensureUserProgram = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch('/api/add-user-program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          programId: 'tension-release-program',
          programName: 'Comprehensive Tension Release & Performance Enhancement',
          programType: 'premium'
        })
      })
      
      if (response.ok) {
        console.log('User program ensured successfully')
      } else {
        console.error('Failed to ensure user program')
      }
    } catch (error) {
      console.error('Error ensuring user program:', error)
    }
  }

  const syncProgressWithBackend = async (progress: number, watchedVideos: number[]) => {
    if (!user?.id) return
    
    try {
      const response = await fetch('/api/update-program-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          programId: 'tension-release-program',
          progress: progress,
          watchedVideos: watchedVideos
        })
      })
      
      if (response.ok) {
        console.log('Progress synced with backend successfully')
      } else {
        console.error('Failed to sync progress with backend')
      }
    } catch (error) {
      console.error('Error syncing progress with backend:', error)
    }
  }

  const isVideoWatched = (videoId: number) => watchedVideos.has(videoId)

  const nextVideo = () => {
    if (currentVideoIndex < courseVideos.length - 1) {
      const nextIndex = currentVideoIndex + 1
      setCurrentVideoIndex(nextIndex)
      setCurrentVideo(courseVideos[nextIndex])
    }
  }

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1
      setCurrentVideoIndex(prevIndex)
      setCurrentVideo(courseVideos[prevIndex])
    }
  }

  const getNextUncompletedVideo = () => {
    return courseVideos.findIndex(video => !watchedVideos.has(video.id))
  }

  const startCourse = () => {
    setShowWelcome(false)
    
    // Find the next uncompleted video
    const nextUncompletedIndex = getNextUncompletedVideo()
    
    if (nextUncompletedIndex !== -1) {
      // Go to the next uncompleted video
      setCurrentVideo(courseVideos[nextUncompletedIndex])
      setCurrentVideoIndex(nextUncompletedIndex)
    } else {
      // All videos completed, go to the last video
      setCurrentVideo(courseVideos[courseVideos.length - 1])
      setCurrentVideoIndex(courseVideos.length - 1)
    }
  }

  if (subscriptionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Program...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Access control check
  if (!canAccessContent) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/programs')}
                  className="text-white/90 hover:text-orange-400 hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Programs
                </Button>
                <h1 className="text-2xl font-bold text-orange-400">Premium Program</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Premium Content Access Required</h2>
              <p className="text-xl text-white/70 mb-8">
                This comprehensive program requires an active subscription to access.
              </p>
            </div>

            <Card className="bg-white/5 border-orange-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Comprehensive Tension Release & Performance Enhancement</CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Transform your running performance through our scientifically-backed methodology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Program Includes:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">18 comprehensive video modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">Tension release techniques</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">Performance enhancement methods</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">Progress tracking</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Target Audience:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">All fitness levels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">Runners & athletes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">Performance-focused individuals</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:scale-105 transition-all"
                    onClick={() => router.push('/dashboard/coaching')}
                  >
                    Get Premium Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/programs')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10 text-xs sm:text-sm flex-shrink-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Programs</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400 truncate min-w-0">Tension Release Program</h1>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs sm:text-sm flex-shrink-0">
                  Premium
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {showWelcome && (
        <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-500/30 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                Welcome to the Tension Release Program!
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your running performance through our comprehensive 18-module program. 
                Learn scientifically-backed techniques to release tension, increase work capacity, 
                and optimize your movement patterns.
              </p>
              
              {/* Progress Overview */}
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <span className="text-white/70 text-sm sm:text-base md:text-lg">Your Progress</span>
                  <span className="text-orange-400 font-bold text-lg sm:text-xl">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 sm:h-3 bg-white/10 mb-2 sm:mb-3 md:mb-4">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </Progress>
                <p className="text-white/60 text-xs sm:text-sm">
                  {watchedVideos.size} of {courseVideos.length} modules completed
                </p>
              </div>

              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:scale-105 transition-all px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto"
                onClick={startCourse}
              >
                {watchedVideos.size > 0 ? 
                  (getNextUncompletedVideo() !== -1 ? 'Continue Learning' : 'Review Program') : 
                  'Start the Program'
                }
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Video Player Section */}
        {!showWelcome && currentVideo && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-500/30">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {/* Video Player */}
                <div className="lg:col-span-3 order-1 lg:order-1">
                  <div className="relative">
                    <div 
                      className="bg-black/50 rounded-xl overflow-hidden cursor-pointer relative sm:aspect-[16/9]"
                      onClick={(e) => {
                        // Don't prevent default, let the video handle it
                        const video = e.currentTarget.querySelector('video') as HTMLVideoElement;
                        if (video) {
                          if (video.paused) {
                            video.play();
                          } else {
                            video.pause();
                          }
                        }
                      }}
                    >
                      <video
                        key={currentVideo.id}
                        className="w-full h-auto sm:h-full sm:object-contain cursor-pointer"
                        controls
                        preload="metadata"
                        onEnded={() => handleVideoComplete(currentVideo.id)}
                        onLoadedMetadata={(e) => {
                          const video = e.target as HTMLVideoElement;
                          // Only apply auto sizing on mobile
                          if (window.innerWidth < 640) {
                            video.style.width = '100%';
                            video.style.height = 'auto';
                          } else {
                            video.style.width = '100%';
                            video.style.height = '100%';
                            video.style.objectFit = 'contain';
                          }
                        }}
                        onClick={(e) => {
                          // Don't prevent default, let the video handle it naturally
                          const video = e.target as HTMLVideoElement;
                          if (video.paused) {
                            video.play();
                          } else {
                            video.pause();
                          }
                        }}
                      >
                        <source src={currentVideo.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {/* Video Navigation */}
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevVideo}
                        disabled={currentVideoIndex === 0}
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs sm:text-sm"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-xs sm:text-sm">
                          {currentVideoIndex + 1} of {courseVideos.length}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextVideo}
                        disabled={currentVideoIndex === courseVideos.length - 1}
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Video Info & Controls */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-2">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                      {currentVideo.title}
                    </h3>
                    <p className="text-orange-300/90 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {currentVideo.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                      {isVideoWatched(currentVideo.id) && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                        Module {currentVideo.id}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Manual Complete Button */}
                  {!isVideoWatched(currentVideo.id) && (
                    <Button
                      onClick={() => handleManualComplete(currentVideo.id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:scale-105 transition-all text-sm sm:text-base py-2 sm:py-3"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                
                {/* Progress */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs sm:text-sm">Program Progress</span>
                    <span className="text-orange-400 font-semibold text-xs sm:text-sm">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/10">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </Progress>
                  <p className="text-xs sm:text-sm text-white/60">
                    {watchedVideos.size} of {courseVideos.length} modules completed
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Downloadable Resources */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            Downloadable Resources
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all">
              <CardHeader className="pb-0">
                <CardTitle className="text-white text-sm sm:text-base">Weekly Routine Tracker</CardTitle>
                <CardDescription className="text-white/70 text-xs">PDF download</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <a
                  href="/files/Tension Score Weekly Homework Routine Sheet.pdf"
                  download
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Download
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all">
              <CardHeader className="pb-0">
                <CardTitle className="text-white text-sm sm:text-base">Assessment Sheet</CardTitle>
                <CardDescription className="text-white/70 text-xs">PDF download</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <a
                  href="/files/Tension Score Sheet w logo.pdf.pdf"
                  download
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Download
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-orange-500/30 hover:border-orange-400/50 transition-all">
              <CardHeader className="pb-0">
                <CardTitle className="text-white text-sm sm:text-base">Runner's Tracker</CardTitle>
                <CardDescription className="text-white/70 text-xs">PDF download</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <a
                  href="/files/Tension Score Sheet for Runners.pdf"
                  download
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Download
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Modules - Improved Layout */}
        {!showWelcome && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              Course Modules
            </h3>
            
            {/* Progress Overview */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-white/70 text-xs sm:text-sm">Course Progress</span>
                <span className="text-orange-400 font-semibold text-xs sm:text-sm">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/10">
                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </Progress>
              <p className="text-xs text-white/60 mt-2">
                {watchedVideos.size} of {courseVideos.length} modules completed
              </p>
            </div>

            {/* Compact Module List */}
            <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent">
              {courseVideos.map((video) => (
                <div 
                  key={video.id} 
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentVideo?.id === video.id 
                      ? 'bg-orange-500/20 border border-orange-500/50' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30'
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-orange-400 font-semibold text-xs sm:text-sm">{video.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-xs sm:text-sm truncate">
                      {video.title}
                    </h4>
                    <p className="text-orange-300/80 text-xs truncate mb-1">
                      {video.subtitle}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:inline">Video Module</span>
                      <span className="sm:hidden">Module</span>
                      {isVideoWatched(video.id) && (
                        <>
                          <span>•</span>
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Completed</span>
                            <span className="sm:hidden">Done</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {isVideoWatched(video.id) ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Program Components */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-hidden">
          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-orange-yellow mx-auto mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h4 className="font-heading text-xs sm:text-sm font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Tension Release</h4>
            <p className="text-white/80 leading-relaxed text-xs sm:text-sm">Increase work capacity through targeted tension release techniques</p>
          </Card>

          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-orange-yellow mx-auto mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h4 className="font-heading text-xs sm:text-sm font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Stretching</h4>
            <p className="text-white/80 leading-relaxed text-xs sm:text-sm">Improve range of motion with progressive stretching protocols</p>
          </Card>

          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-orange-yellow mx-auto mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h4 className="font-heading text-xs sm:text-sm font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Activation</h4>
            <p className="text-white/80 leading-relaxed text-xs sm:text-sm">Wake up weak muscles with targeted activation exercises</p>
          </Card>

          <Card className="bg-card/90 border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:glow-orange group backdrop-blur-sm p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-orange-yellow mx-auto mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <h4 className="font-heading text-xs sm:text-sm font-bold mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">Compound Reintegration</h4>
            <p className="text-white/80 leading-relaxed text-xs sm:text-sm">Connect muscles together and scale strength</p>
          </Card>
        </div>

        {/* Completion Status */}
        {!showWelcome && progress === 100 && (
          <div className="text-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border-2 border-green-500/30">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
            <p className="text-white/80 text-lg mb-4">
              You've completed the Comprehensive Tension Release & Performance Enhancement program!
            </p>
            <p className="text-white/60">
              You've mastered all 18 modules and are ready to apply these techniques to your training.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}


