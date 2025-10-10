/**
 * Site Configuration
 * 
 * Central configuration file for the All Levels Athletics website.
 * Modify these values to customize branding, colors, text, and behavior.
 * 
 * This approach makes the codebase reusable for other fitness businesses
 * by simply updating this configuration file.
 */

export const siteConfig = {
  // Basic Site Information
  name: "All Levels Athletics",
  description: "Elite Online Personal Training",
  domain: "alllevelsathletics.com",
  
  // Branding & Colors
  colors: {
    primary: "orange",
    secondary: "yellow",
    accent: "orange-400",
    accentHover: "orange-300",
    primaryGradient: "from-orange-500 to-yellow-500",
    accentGradient: "from-orange-400 to-yellow-400",
    border: "orange-500/30",
    borderHover: "orange-400",
    ring: "orange-400/20",
  },
  
  // Authentication Settings
  auth: {
    enableEmailConfirmation: true,
    enablePasswordReset: true,
    enableRememberMe: true,
    minPasswordLength: 6,
    requireFullName: true,
    termsOfService: true,
    privacyPolicy: true,
  },
  
  // Form Labels & Text
  labels: {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      button: "Sign In",
      loading: "Signing In...",
      switchText: "Don't have an account?",
      switchButton: "Sign up",
    },
    register: {
      title: "Join All Levels Athletics",
      subtitle: "Create your account to get started",
      button: "Create Account",
      loading: "Creating Account...",
      switchText: "Already have an account?",
      switchButton: "Sign in",
      successMessage: "Registration successful! Please check your email to verify your account.",
    },
    fields: {
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
    },
    placeholders: {
      fullName: "Enter your full name",
      email: "Enter your email",
      password: "Enter your password",
      confirmPassword: "Confirm your password",
    },
    validation: {
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 6 characters",
      fullNameRequired: "Full name is required",
      passwordsDontMatch: "Passwords do not match",
      unexpectedError: "An unexpected error occurred. Please try again.",
    },
    navigation: {
      loginButton: "Login / Register",
      welcomeMessage: "Welcome, {name}",
      signOut: "Sign Out",
    },
    legal: {
      termsText: "By creating an account, you agree to our",
      termsLink: "Terms of Service",
      andText: "and",
      privacyLink: "Privacy Policy",
    },
  },
  
  // Navigation & UI
  navigation: {
    showUserIcon: true,
    showStartTrial: true,
    startTrialText: "Book Consultation",
    mobileMenuBreakpoint: "lg",
  },
  
  // Styling Classes
  styles: {
    // Modal styling
    modal: {
      background: "bg-black/95 backdrop-blur-md",
      border: "border border-orange-500/30",
      shadow: "shadow-2xl",
    },
    // Button styling
    button: {
      primary: "bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold",
      secondary: "text-white/90 hover:text-orange-400 hover:bg-white/10",
      rounded: "rounded-xl",
      hover: "hover:shadow-orange-500/25 hover:-translate-y-0.5",
    },
    // Input styling
    input: {
      background: "bg-black/50",
      border: "border-orange-500/30",
      focus: "focus:border-orange-400 focus:ring-orange-400/20",
      text: "text-white",
      placeholder: "placeholder:text-white/50",
    },
    // Message styling
    message: {
      success: "bg-green-500/20 border border-green-500/30 text-green-400",
      error: "bg-red-500/20 border border-red-500/30 text-red-400",
    },
  },
  
  // Contact Information
  contact: {
    email: "AllLevelsAthletics@gmail.com",
    phone: "760-585-8832",
    address: "Online Business, California, CA",
  },
  
  // Social Media
  social: {
    tiktok: "@AllLevelsAthletics",
    instagram: "@AllLevelsAthletics",
  },
}

// Helper function to get dynamic values
export function getConfigValue(path: string, fallback?: string): string {
  const keys = path.split('.')
  let value: any = siteConfig
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) break
  }
  
  return value || fallback || ''
}

// Helper function to replace placeholders in text
export function replacePlaceholders(text: string, replacements: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return replacements[key] || match
  })
}
