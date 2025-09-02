import { supabase } from './supabase'
import type { AuthError } from './supabase'

export interface RegisterData {
  email?: string
  phone?: string
  password: string
  full_name: string
}

export interface LoginData {
  email?: string
  phone?: string
  password: string
}

export const authService = {
  // Register a new user
  async register(data: RegisterData): Promise<{ user: any; error: AuthError | null }> {
    try {
      const signUpData: any = {
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      }

      // Add email or phone based on what's provided
      if (data.email) {
        signUpData.email = data.email
      } else if (data.phone) {
        signUpData.phone = data.phone
      }

      const { data: authData, error } = await supabase.auth.signUp(signUpData)

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return {
        user: authData.user,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        error: {
          message: 'An unexpected error occurred during registration.',
          status: 500,
        },
      }
    }
  },

  // Login user
  async login(data: LoginData): Promise<{ user: any; error: AuthError | null }> {
    try {
      const signInData: any = {
        password: data.password,
      }

      // Add email or phone based on what's provided
      if (data.email) {
        signInData.email = data.email
      } else if (data.phone) {
        signInData.phone = data.phone
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword(signInData)

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return {
        user: authData.user,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        error: {
          message: 'An unexpected error occurred during login.',
          status: 500,
        },
      }
    }
  },

  // Sign out user
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred during sign out.',
          status: 500,
        },
      }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        return { user: null, error }
      }

      return { user, error: null }
    } catch (error) {
      return { user, error }
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred during password reset.',
          status: 500,
        },
      }
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred while updating password.',
          status: 500,
        },
      }
    }
  },

  // Set session from tokens (for password reset)
  async setSessionFromTokens(accessToken: string, refreshToken: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status || 400,
          },
        }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'Failed to set session from tokens.',
          status: 500,
        },
      }
    }
  },

}
