// Filename: SupabaseAuthService.ts
// Role: Authentication service layer for Supabase operations
// Purpose: Provides a clean API for authentication operations with proper error handling
// Integration: Used by components and hooks for user authentication management

import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError, AuthResponse } from "@supabase/supabase-js";

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
}

export interface AuthServiceResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Comprehensive authentication service for Supabase operations
 * Provides type-safe methods for all authentication-related functionality
 */
export class SupabaseAuthService {
  /**
   * Sign up a new user with email and password
   * @param credentials - User signup credentials
   * @returns Promise with user data or error information
   */
  static async signUp(
    credentials: SignUpCredentials
  ): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName || "",
            last_name: credentials.lastName || "",
          },
        },
      });

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data.user,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred during signup",
        success: false,
      };
    }
  }

  /**
   * Sign in an existing user with email and password
   * @param credentials - User signin credentials
   * @returns Promise with authentication response
   */
  static async signIn(
    credentials: SignInCredentials
  ): Promise<AuthServiceResponse<AuthResponse>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred during signin",
        success: false,
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with success/error information
   */
  static async signOut(): Promise<AuthServiceResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred during signout",
        success: false,
      };
    }
  }

  /**
   * Get the current authenticated user
   * @returns Promise with current user data
   */
  static async getCurrentUser(): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data.user,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred while fetching user",
        success: false,
      };
    }
  }

  /**
   * Send password reset email
   * @param resetData - Email for password reset
   * @returns Promise with success/error information
   */
  static async resetPassword(
    resetData: ResetPasswordData
  ): Promise<AuthServiceResponse<null>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetData.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred during password reset",
        success: false,
      };
    }
  }

  /**
   * Update user password
   * @param updateData - New password data
   * @returns Promise with success/error information
   */
  static async updatePassword(
    updateData: UpdatePasswordData
  ): Promise<AuthServiceResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: updateData.password,
      });

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data.user,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: "An unexpected error occurred during password update",
        success: false,
      };
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns Promise with boolean indicating authentication status
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getUser();
      return !!data.user;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  }
}
