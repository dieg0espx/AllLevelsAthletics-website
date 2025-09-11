// Example: Blue Theme Configuration for "TechCorp" Project
// This shows how easy it is to completely rebrand the system

export const siteConfig = {
  // Basic Site Information
  name: "TechCorp Solutions",
  description: "Enterprise Technology Solutions",
  domain: "techcorp.com",
  
  // Branding & Colors - Changed from orange to blue
  colors: {
    primary: "blue",
    secondary: "cyan",
    accent: "blue-400",
    accentHover: "blue-300",
    primaryGradient: "from-blue-500 to-cyan-500",
    accentGradient: "from-blue-400 to-cyan-400",
    border: "blue-500/30",
    borderHover: "blue-400",
    ring: "blue-400/20",
  },
  
  // Authentication Settings - Customized for TechCorp
  auth: {
    enableEmailConfirmation: true,
    enablePasswordReset: true,
    enableRememberMe: true,
    minPasswordLength: 8,        // Stronger passwords for enterprise
    requireFullName: true,
    termsOfService: true,
    privacyPolicy: true,
  },
  
  // Form Labels & Text - Customized for TechCorp
  labels: {
    login: {
      title: "Welcome to TechCorp",
      subtitle: "Sign in to your enterprise account",
      button: "Sign In",
      loading: "Signing In...",
      switchText: "Don't have an account?",
      switchButton: "Sign up",
    },
    register: {
      title: "Join TechCorp Solutions",
      subtitle: "Create your enterprise account",
      button: "Create Account",
      loading: "Creating Account...",
      switchText: "Already have an account?",
      switchButton: "Sign in",
      successMessage: "Account created successfully! Please check your email to verify your account.",
    },
    fields: {
      fullName: "Full Name",
      email: "Work Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Keep me signed in",
      forgotPassword: "Forgot password?",
    },
    placeholders: {
      fullName: "Enter your full name",
      email: "Enter your work email",
      password: "Enter your password",
      confirmPassword: "Confirm your password",
    },
    validation: {
      emailRequired: "Work email is required",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 8 characters",
      fullNameRequired: "Full name is required",
      passwordsDontMatch: "Passwords do not match",
      unexpectedError: "An unexpected error occurred. Please try again.",
    },
    navigation: {
      loginButton: "Sign In / Register",
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
  
  // Navigation & UI - Customized for TechCorp
  navigation: {
    showUserIcon: true,
    showStartTrial: true,
    startTrialText: "Start Free Trial",
    mobileMenuBreakpoint: "lg",
  },
  
  // Styling Classes - Blue theme styling
  styles: {
    modal: {
      background: "bg-slate-900/95 backdrop-blur-md",  // Darker background for enterprise
      border: "border border-blue-500/30",
      shadow: "shadow-2xl",
    },
    button: {
      primary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold",
      secondary: "text-white/90 hover:text-blue-400 hover:bg-white/10",
      rounded: "rounded-xl",
      hover: "hover:shadow-blue-500/25 hover:-translate-y-0.5",
    },
    input: {
      background: "bg-slate-800/50",
      border: "border-blue-500/30",
      focus: "focus:border-blue-400 focus:ring-blue-400/20",
      text: "text-white",
      placeholder: "placeholder:text-white/50",
    },
    message: {
      success: "bg-green-500/20 border border-green-500/30 text-green-400",
      error: "bg-red-500/20 border border-red-500/30 text-red-400",
    },
  },
  
  // Contact Information - TechCorp contact details
  contact: {
    email: "contact@techcorp.com",
    phone: "1-800-TECH-CORP",
    address: "123 Tech Street, Silicon Valley, CA",
  },
  
  // Social Media - TechCorp social media
  social: {
    twitter: "@TechCorp",
    linkedin: "TechCorp-Solutions",
    github: "TechCorp",
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

/*
🎯 WHAT CHANGED IN 5 MINUTES:

1. Colors: Orange → Blue theme
2. Branding: "All Levels Athletics" → "TechCorp Solutions"
3. Messaging: Fitness-focused → Enterprise-focused
4. Styling: Lighter background → Darker enterprise background
5. Contact: Fitness contact → TechCorp contact
6. Social: Fitness social → Tech social

The entire authentication system now looks and feels like it was built specifically for TechCorp!
*/
