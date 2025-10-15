"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { authService } from "@/lib/auth"
import { siteConfig } from "@/lib/config"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)

  // Check if we have the necessary tokens from the URL and set up Supabase session
  useEffect(() => {
    // Debug: Log full URL
    console.log('🔍 Full URL:', window.location.href)
    console.log('🔍 Hash:', window.location.hash)
    console.log('🔍 Search:', window.location.search)
    
    // Supabase sends tokens in the hash fragment (#), not query params (?)
    // First try to get from hash fragment
    const hash = window.location.hash
    let accessToken = null
    let refreshToken = null
    let type = null
    
    if (hash) {
      console.log('📍 Raw hash:', hash)
      const hashParams = new URLSearchParams(hash.substring(1)) // Remove the '#'
      accessToken = hashParams.get('access_token')
      refreshToken = hashParams.get('refresh_token')
      type = hashParams.get('type')
      console.log('📍 Hash Parameters:', { 
        accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null, 
        refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null, 
        type 
      })
    } else {
      console.log('⚠️ No hash fragment found')
    }
    
    // Fallback to query params if not in hash
    if (!accessToken) {
      accessToken = searchParams.get('access_token')
      refreshToken = searchParams.get('refresh_token')
      type = searchParams.get('type')
      console.log('📍 Query Parameters:', { 
        accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null, 
        refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null, 
        type 
      })
    }
    
    // Supabase password reset includes these parameters
    if (accessToken && refreshToken && type === 'recovery') {
      // Set up the Supabase session with the tokens from the URL
      const setupSession = async () => {
        try {
          const { error } = await authService.setSessionFromTokens(accessToken, refreshToken)
          if (error) {
            console.error('Session setup error:', error)
            setMessage({ 
              type: 'error', 
              text: 'Failed to validate reset link. Please request a new password reset.' 
            })
          } else {
            console.log('✅ Session setup successful')
            setIsValidToken(true)
          }
        } catch (error) {
          console.error('Session setup exception:', error)
          setMessage({ 
            type: 'error', 
            text: 'Invalid or expired reset link. Please request a new password reset.' 
          })
        }
      }
      
      setupSession()
    } else if (accessToken && refreshToken) {
      // Fallback for other auth flows
      console.log('Using fallback validation')
      setIsValidToken(true)
    } else {
      // For testing purposes, let's check if we're in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Allowing access for testing')
        setIsValidToken(true)
        setIsTestMode(true)
      } else {
        console.log('No valid tokens found')
        setMessage({ 
          type: 'error', 
          text: 'Invalid or expired reset link. Please request a new password reset.' 
        })
      }
    }
  }, [searchParams])

  const validateForm = (): string | null => {
    if (!newPassword) return "New password is required"
    if (newPassword.length < siteConfig.auth.minPasswordLength) {
      return `Password must be at least ${siteConfig.auth.minPasswordLength} characters long`
    }
    if (newPassword !== confirmPassword) return "Passwords don't match"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setMessage({ type: 'error', text: validationError })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (isTestMode) {
        // Test mode - simulate success
        setMessage({ 
          type: 'success', 
          text: 'Test mode: Password would be updated successfully! Redirecting to login...' 
        })
        
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        // Real mode - update the user's password using Supabase
        const { error } = await authService.updatePassword(newPassword)
        
        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Password updated successfully! Redirecting to login...' 
          })
          
          // Redirect to login after successful password reset
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update password. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Password Reset</h1>
            <p className="text-white/70">Invalid or expired reset link</p>
          </div>
          
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

                  <div className="text-center space-y-4">
          {/* Test Mode Toggle for Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-white/70 text-sm mb-2">Development Mode</p>
              <Button
                onClick={() => {
                  setIsTestMode(!isTestMode)
                  setIsValidToken(!isTestMode)
                  setMessage(null)
                }}
                variant="outline"
                size="sm"
                className="text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-black"
              >
                {isTestMode ? 'Disable Test Mode' : 'Enable Test Mode'}
              </Button>
            </div>
          )}
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-white/70">Enter your new password below</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white/90 font-medium">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="pl-10 pr-10 bg-white/10 border border-orange-500/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400/20 h-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="pl-10 pr-10 bg-white/10 border border-orange-500/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400/20 h-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-black hover:bg-orange-400 border-orange-400 hover:border-orange-300 transition-all duration-300 h-12 font-medium shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
