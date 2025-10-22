"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, User, LogOut, ShoppingCart as ShoppingCartIcon } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { ShoppingCart } from "@/components/shopping-cart"
import CalendlyPopup from "@/components/calendly-popup"
import { useSafeAuth } from "@/contexts/safe-auth-context"
import { useCart } from "@/contexts/cart-context"
import { siteConfig, replacePlaceholders } from "@/lib/config"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, isHydrated } = useSafeAuth()
  const { toggleCart, getTotalItems } = useCart()

  // Don't render until hydrated to prevent SSR issues
  if (!isHydrated) {
    return null
  }

  // Preload Calendly script on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Check if script already exists
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const openAuthModal = () => {
    setIsAuthModalOpen(true)
    setIsOpen(false) // Close mobile menu if open
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      setIsOpen(false) // Close mobile menu
    } catch (error) {
      console.error('❌ Error in handleSignOut:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16 md:h-20">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt={siteConfig.name}
                  width={50}
                  height={50}
                  className="h-6 w-auto sm:h-10 md:h-12 group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${siteConfig.styles.button.primary} rounded-lg opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300`}></div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 xl:space-x-8">
              <Link 
                href="/" 
                className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                  isActive("/") 
                    ? `text-${siteConfig.colors.accent}` 
                    : "text-white/90 hover:text-orange-400"
                }`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${siteConfig.styles.button.primary} transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              <Link 
                href="/about" 
                className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                  isActive("/about") 
                    ? `text-${siteConfig.colors.accent}` 
                    : "text-white/90 hover:text-orange-400"
                }`}
              >
                About
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${siteConfig.styles.button.primary} transition-all duration-300 ${
                  isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              <Link 
                href="/services" 
                className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                  isActive("/services") 
                    ? `text-${siteConfig.colors.accent}` 
                    : "text-white/90 hover:text-orange-400"
                }`}
              >
                Services
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${siteConfig.styles.button.primary} transition-all duration-300 ${
                  isActive("/services") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              <Link 
                href="/programs" 
                className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                  isActive("/programs") 
                    ? `text-${siteConfig.colors.accent}` 
                    : "text-white/90 hover:text-orange-400"
                }`}
              >
                Programs
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${siteConfig.styles.button.primary} transition-all duration-300 ${
                  isActive("/programs") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              <Link 
                href="/contact" 
                className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                  isActive("/contact") 
                    ? `text-${siteConfig.colors.accent}` 
                    : "text-white/90 hover:text-orange-400"
                }`}
              >
                Contact
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${siteConfig.styles.button.primary} transition-all duration-300 ${
                  isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            </div>

            {/* Desktop CTA and Login */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Shopping Cart */}
              <button
                onClick={() => {
                  try {
                    toggleCart()
                  } catch (error) {
                  }
                }}
                className="text-white/90 hover:text-orange-400 transition-colors duration-300 p-3 rounded-full hover:bg-white/10 group"
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {getTotalItems() > 0 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </div>
                  )}
                </div>
              </button>
              
              {user ? (
                // User is logged in
                <div className="flex items-center space-x-3">
                  <div className="text-white/90 text-sm">
                    {replacePlaceholders(siteConfig.labels.navigation.welcomeMessage, {
                      name: user.user_metadata?.full_name || user.email
                    })}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`text-white/90 hover:text-${siteConfig.colors.accent} hover:bg-white/10 transition-all duration-300 rounded-full p-3 group disabled:opacity-50`}
                  >
                    {isSigningOut ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </Button>
                </div>
              ) : (
                // User is not logged in
                siteConfig.navigation.showUserIcon && (
                  <Button 
                    variant="ghost"
                    onClick={openAuthModal}
                    className={`text-white/90 hover:text-${siteConfig.colors.accent} hover:bg-white/10 transition-all duration-300 rounded-full p-4 group`}
                  >
                    <User className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                )
              )}
              
                             {/* Dashboard or Start Trial Button */}
               {user ? (
                 // User is logged in - show dashboard
                 <Button 
                   className={`${siteConfig.styles.button.primary} px-6 xl:px-8 py-2 xl:py-3 ${siteConfig.styles.button.rounded} ${siteConfig.styles.button.hover} transition-all duration-300 group text-sm xl:text-base`}
                   onClick={() => {
                     // Determine user role and redirect accordingly
                     const userRole = user.user_metadata?.role || 'client'
                     if (userRole === 'admin') {
                       router.push('/admin')
                     } else {
                       router.push('/dashboard')
                     }
                   }}
                 >
                                                                               <span>
                       {user.user_metadata?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                     </span>
                 </Button>
               ) : (
                 // User is not logged in - show start trial
                 siteConfig.navigation.showStartTrial && (
                   <Button 
                     className={`${siteConfig.styles.button.primary} px-6 xl:px-8 py-2 xl:py-3 ${siteConfig.styles.button.rounded} ${siteConfig.styles.button.hover} transition-all duration-300 group text-sm xl:text-base`}
                     onClick={() => setIsCalendlyOpen(true)}
                   >
                     <span className="flex items-center gap-2">
                       {siteConfig.navigation.startTrialText}
                       <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                     </span>
                   </Button>
                 )
               )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white/90 hover:text-orange-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10 active:scale-95 touch-manipulation"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-orange-500/30 bg-black/95 backdrop-blur-md shadow-2xl">
              <Link 
                href="/" 
                className={`block transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base ${
                  isActive("/") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`block transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base ${
                  isActive("/about") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/services" 
                className={`block transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base ${
                  isActive("/services") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/programs" 
                className={`block transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base ${
                  isActive("/programs") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Programs
              </Link>
              <Link 
                href="/contact" 
                className={`block transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base ${
                  isActive("/contact") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Shopping Cart */}
              <button
                onClick={() => {
                  toggleCart()
                  setIsOpen(false)
                }}
                className="block w-full text-left transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 active:scale-95 touch-manipulation text-base text-white/90 hover:text-orange-400"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCartIcon className="w-5 h-5" />
                  Shopping Cart
                  {getTotalItems() > 0 && (
                    <div className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </div>
                  )}
                </span>
              </button>
              
              {/* Mobile Login/Register or User Info */}
              {user ? (
                <div className="pt-3 space-y-2 border-t border-orange-500/20">
                  <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-white/90 text-sm truncate">
                      {replacePlaceholders(siteConfig.labels.navigation.welcomeMessage, {
                        name: user.user_metadata?.full_name || user.email
                      })}
                    </p>
                  </div>
                  <Button 
                    className={`w-full ${siteConfig.styles.button.primary} py-3 ${siteConfig.styles.button.rounded} shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all duration-300 touch-manipulation`}
                    onClick={() => {
                      // Determine user role and redirect accordingly
                      const userRole = user.user_metadata?.role || 'client'
                      if (userRole === 'admin') {
                        router.push('/admin')
                      } else {
                        router.push('/dashboard')
                      }
                      setIsOpen(false) // Close mobile menu
                    }}
                  >
                    <span className="text-base">
                      {user.user_metadata?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                    </span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`w-full text-white/90 hover:text-${siteConfig.colors.accent} hover:bg-white/10 transition-all duration-300 font-medium py-3 rounded-lg group disabled:opacity-50`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSigningOut ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {isSigningOut ? 'Signing out...' : siteConfig.labels.navigation.signOut}
                    </span>
                  </Button>
                </div>
              ) : (
                siteConfig.navigation.showUserIcon && (
                  <div className="pt-3 space-y-2 border-t border-orange-500/20">
                    <Button 
                      variant="ghost" 
                      onClick={openAuthModal}
                      className={`w-full text-white/90 hover:text-${siteConfig.colors.accent} hover:bg-white/10 transition-all duration-300 font-medium py-3 rounded-lg group`}
                    >
                      <span className="flex items-center justify-center gap-3">
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        {siteConfig.labels.navigation.loginButton}
                      </span>
                    </Button>
                  </div>
                )
              )}
              
              {/* Start Trial Button for Mobile (only for non-logged in users) */}
              {!user && siteConfig.navigation.showStartTrial && (
                <div className="pt-2">
                  <Button 
                    className={`w-full ${siteConfig.styles.button.primary} py-3 ${siteConfig.styles.button.rounded} shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all duration-300 touch-manipulation`}
                    onClick={() => {
                      setIsCalendlyOpen(true)
                      setIsOpen(false)
                    }}
                  >
                    <span className="flex items-center justify-center gap-2 text-base">
                      {siteConfig.navigation.startTrialText}
                      <Zap className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
              <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          redirectTo={pathname}
        />
      
      {/* Shopping Cart */}
      <ShoppingCart />

      {/* Calendly Popup */}
      <CalendlyPopup 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </>
  )
}
