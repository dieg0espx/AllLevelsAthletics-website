// Template Configuration for Different Projects
// Copy this file and customize it for your new project

export const siteConfig = {
  // Basic Site Information
  name: "Your Project Name",
  description: "Your project description",
  domain: "yourproject.com",
  
  // Branding & Colors - Change these for different color schemes
  colors: {
    primary: "blue",           // Change from "orange" to "blue", "purple", "green", etc.
    secondary: "cyan",          // Change from "yellow" to "cyan", "pink", "emerald", etc.
    accent: "blue-400",        // Change from "orange-400" to "blue-400", "purple-400", etc.
    accentHover: "blue-300",   // Change from "orange-300" to "blue-300", "purple-300", etc.
    primaryGradient: "from-blue-500 to-cyan-500",    // Change gradient colors
    accentGradient: "from-blue-400 to-cyan-400",     // Change gradient colors
    border: "blue-500/30",     // Change border color
    borderHover: "blue-400",   // Change hover border color
    ring: "blue-400/20",       // Change focus ring color
  },
  
  // Authentication Settings - Configure what features you want
  auth: {
    enableEmailConfirmation: true,    // Set to false if you don't want email verification
    enablePasswordReset: true,        // Set to false if you don't want password reset
    enableRememberMe: true,          // Set to false if you don't want remember me
    minPasswordLength: 8,            // Change minimum password length
    requireFullName: true,           // Set to false if you don't need full name
    termsOfService: true,            // Set to false if you don't have terms
    privacyPolicy: true,             // Set to false if you don't have privacy policy
  },
  
  // Form Labels & Text - Customize all text content
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
      title: "Join Your Project",           // Change this to your project name
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
      passwordTooShort: "Password must be at least 8 characters",  // Update this number
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
  
  // Navigation & UI - Configure what UI elements to show
  navigation: {
    showUserIcon: true,              // Set to false to hide login icon
    showStartTrial: true,            // Set to false to hide start trial button
    startTrialText: "Get Started",   // Change button text
    mobileMenuBreakpoint: "lg",      // Change breakpoint: "sm", "md", "lg", "xl"
  },
  
  // Styling Classes - Customize the visual appearance
  styles: {
    modal: {
      background: "bg-black/95 backdrop-blur-md",    // Change background
      border: "border border-blue-500/30",           // Change border (match colors.primary)
      shadow: "shadow-2xl",
    },
    button: {
      primary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold",  // Change gradient and text color
      secondary: "text-white/90 hover:text-blue-400 hover:bg-white/10",            // Change hover color
      rounded: "rounded-xl",
      hover: "hover:shadow-blue-500/25 hover:-translate-y-0.5",                    // Change shadow color
    },
    input: {
      background: "bg-black/50",
      border: "border-blue-500/30",                                                  // Change border (match colors.primary)
      focus: "focus:border-blue-400 focus:ring-blue-400/20",                        // Change focus colors
      text: "text-white",
      placeholder: "placeholder:text-white/50",
    },
    message: {
      success: "bg-green-500/20 border border-green-500/30 text-green-400",
      error: "bg-red-500/20 border border-red-500/30 text-red-400",
    },
  },
  
  // Contact Information - Update with your project's contact details
  contact: {
    email: "contact@yourproject.com",
    phone: "555-123-4567",
    address: "Your Address, City, State",
  },
  
  // Social Media - Update with your project's social media
  social: {
    twitter: "@YourProject",
    instagram: "@YourProject",
    linkedin: "YourProject",
  },
}

// Helper functions (keep these the same)
export function getConfigValue(path: string, fallback?: string): string {
  const keys = path.split('.')
  let value: any = siteConfig
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) break
  }
  
  return value || fallback || ''
}

export function replacePlaceholders(text: string, replacements: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return replacements[key] || match
  })
}
