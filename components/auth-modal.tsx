"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Lock, Mail, Eye, EyeOff, Zap, CheckCircle, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth"
import type { RegisterData, LoginData } from "@/lib/auth"
import { siteConfig, replacePlaceholders } from "@/lib/config"
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string // Optional redirect path
}

export function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear message when user starts typing
    if (message) setMessage(null)
  }

  // Password strength validation
  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    if (!password) return { score: 0, text: '', color: '' }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++ // lowercase
    if (/[A-Z]/.test(password)) score++ // uppercase
    if (/[0-9]/.test(password)) score++ // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++ // special characters
    
    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score, text: 'Fair', color: 'bg-yellow-500' }
    if (score <= 5) return { score, text: 'Good', color: 'bg-green-500' }
    return { score, text: 'Strong', color: 'bg-green-600' }
  }

  const passwordStrength = !isLogin ? getPasswordStrength(formData.password) : null

  const validateForm = (): string | null => {
    if (!formData.email) return siteConfig.labels.validation.emailRequired
    
    if (!formData.password) return siteConfig.labels.validation.passwordRequired
    
    if (!isLogin) {
      // Stronger password requirements for registration
      if (formData.password.length < 8) {
        return 'Password must be at least 8 characters long'
      }
      if (!/[a-z]/.test(formData.password)) {
        return 'Password must contain at least one lowercase letter'
      }
      if (!/[A-Z]/.test(formData.password)) {
        return 'Password must contain at least one uppercase letter'
      }
      if (!/[0-9]/.test(formData.password)) {
        return 'Password must contain at least one number'
      }
      if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        return 'Password must contain at least one special character (!@#$%^&*)'
      }
      if (!formData.full_name) return siteConfig.labels.validation.fullNameRequired
      if (formData.password !== formData.confirmPassword) return siteConfig.labels.validation.passwordsDontMatch
    } else {
      // For login, just check minimum length
      if (formData.password.length < siteConfig.auth.minPasswordLength) {
        return siteConfig.labels.validation.passwordTooShort.replace('6', siteConfig.auth.minPasswordLength.toString())
      }
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isLoading) {
      return
    }
    
    const validationError = validateForm()
    if (validationError) {
      setMessage({ type: 'error', text: validationError })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (isLogin) {
        const { user, error } = await authService.login({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ type: 'success', text: 'Successfully logged in!' })
          // Close modal and redirect immediately for better UX
          onClose();
          setFormData({ email: '', password: '', confirmPassword: '', full_name: '' });
          setMessage(null);
          
          // Immediate redirect - no delay
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            // Check user role and redirect accordingly
            const userRole = user?.user_metadata?.role || 'client'
            if (userRole === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          }
        }
      } else {
        const { user, error } = await authService.register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
        })

        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ 
            type: 'success', 
            text: `Verification email sent to ${formData.email}! Please check your inbox (and spam folder) to verify your account before logging in.` 
          })
          // Keep modal open longer so user can read the message
          setTimeout(() => {
            onClose()
            setFormData({ email: '', password: '', confirmPassword: '', full_name: '' })
            setMessage(null)
          }, 6000) // Increased from 2000ms to 6000ms
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: siteConfig.labels.validation.unexpectedError })
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setMessage(null)
    setFormData({ email: '', password: '', confirmPassword: '', full_name: '' })
    setShowForgotPassword(false)
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email address first' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { success, error } = await authService.resetPassword(formData.email)
      
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox for further instructions.' })
        setTimeout(() => {
          setShowForgotPassword(false)
          setMessage(null)
        }, 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send password reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose();
    setFormData({ email: '', password: '', confirmPassword: '', full_name: '' });
    setMessage(null);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${siteConfig.styles.modal.background} ${siteConfig.styles.modal.border} ${siteConfig.styles.modal.shadow}`}>
        <DialogHeader className="text-center">
          <DialogTitle className={`text-2xl font-bold bg-gradient-to-r ${siteConfig.styles.button.primary} bg-clip-text text-transparent`}>
            {isLogin ? siteConfig.labels.login.title : siteConfig.labels.register.title}
          </DialogTitle>
          <DialogDescription className="text-white/70 mt-2">
            {isLogin ? siteConfig.labels.login.subtitle : siteConfig.labels.register.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? siteConfig.styles.message.success
              : siteConfig.styles.message.error
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-6">

          {!isLogin && siteConfig.auth.requireFullName && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90 font-medium">
                {siteConfig.labels.fields.fullName}
              </Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${siteConfig.colors.accent}`} />
                <Input
                  id="name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder={siteConfig.labels.placeholders.fullName}
                  className={`pl-10 ${siteConfig.styles.input.background} ${siteConfig.styles.input.border} ${siteConfig.styles.input.text} ${siteConfig.styles.input.placeholder} ${siteConfig.styles.input.focus} h-12`}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90 font-medium">
              {siteConfig.labels.fields.email}
            </Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${siteConfig.colors.accent}`} />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={siteConfig.labels.placeholders.email}
                className={`pl-10 ${siteConfig.styles.input.background} ${siteConfig.styles.input.border} ${siteConfig.styles.input.text} ${siteConfig.styles.input.placeholder} ${siteConfig.styles.input.focus} h-12`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90 font-medium">
              {siteConfig.labels.fields.password}
            </Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${siteConfig.colors.accent}`} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={siteConfig.labels.placeholders.password}
                className={`pl-10 pr-10 ${siteConfig.styles.input.background} ${siteConfig.styles.input.border} ${siteConfig.styles.input.text} ${siteConfig.styles.input.placeholder} ${siteConfig.styles.input.focus} h-12`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} transition-colors`}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator (only for registration) */}
            {!isLogin && formData.password && passwordStrength && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Password Strength:</span>
                  <span className={`font-semibold ${
                    passwordStrength.text === 'Weak' ? 'text-red-400' :
                    passwordStrength.text === 'Fair' ? 'text-yellow-400' :
                    passwordStrength.text === 'Good' ? 'text-green-400' :
                    'text-green-500'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-white/60 space-y-1">
                  <p className="flex items-center gap-1">
                    {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                  </p>
                  <p className="flex items-center gap-1">
                    {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? '✓' : '○'} Uppercase & lowercase letters
                  </p>
                  <p className="flex items-center gap-1">
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} At least one number
                  </p>
                  <p className="flex items-center gap-1">
                    {/[^a-zA-Z0-9]/.test(formData.password) ? '✓' : '○'} At least one special character
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
                {siteConfig.labels.fields.confirmPassword}
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${siteConfig.colors.accent}`} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder={siteConfig.labels.placeholders.confirmPassword}
                  className={`pl-10 pr-10 ${siteConfig.styles.input.background} ${siteConfig.styles.input.border} ${siteConfig.styles.input.text} ${siteConfig.styles.input.placeholder} ${siteConfig.styles.input.focus} h-12`}
                  required={!isLogin}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} transition-colors`}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {isLogin && siteConfig.auth.enableRememberMe && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className={`w-4 h-4 text-${siteConfig.colors.primary}-500 ${siteConfig.styles.input.background} ${siteConfig.styles.input.border} rounded focus:ring-${siteConfig.colors.accent} focus:ring-2`}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-white/70 text-sm">
                  {siteConfig.labels.fields.rememberMe}
                </Label>
              </div>
                             {siteConfig.auth.enablePasswordReset && (
                 <button
                   type="button"
                   onClick={handleForgotPassword}
                   className={`text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} text-sm font-medium transition-colors disabled:opacity-50`}
                   disabled={isLoading}
                 >
                   {siteConfig.labels.fields.forgotPassword}
                 </button>
               )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full ${siteConfig.styles.button.primary} ${siteConfig.styles.button.rounded} ${siteConfig.styles.button.hover} transition-all duration-300 group h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95`}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? siteConfig.labels.login.loading : siteConfig.labels.register.loading}
                </>
              ) : (
                <>
                  {isLogin ? siteConfig.labels.login.button : siteConfig.labels.register.button}
                  <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                </>
              )}
            </span>
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            {isLogin ? siteConfig.labels.login.switchText : siteConfig.labels.register.switchText}
            <button
              onClick={switchMode}
              className={`ml-2 text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} font-medium transition-colors`}
              disabled={isLoading}
            >
              {isLogin ? siteConfig.labels.login.switchButton : siteConfig.labels.register.switchButton}
            </button>
          </p>
        </div>

        {!isLogin && siteConfig.auth.termsOfService && (
          <div className="mt-4 text-center">
            <p className="text-white/60 text-xs">
              {siteConfig.labels.legal.termsText}{" "}
              <button className={`text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} underline`}>
                {siteConfig.labels.legal.termsLink}
              </button>{" "}
              {siteConfig.labels.legal.andText}{" "}
              <button className={`text-${siteConfig.colors.accent} hover:text-${siteConfig.colors.accentHover} underline`}>
                {siteConfig.labels.legal.privacyLink}
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
