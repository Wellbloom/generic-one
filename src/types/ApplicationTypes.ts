// Filename: ApplicationTypes.ts
// Role: Global TypeScript type definitions for application-wide use
// Purpose: Provides consistent type definitions for common data structures and interfaces
// Integration: Imported throughout the application for type safety and consistency

import type { ReactNode, ComponentType } from "react";

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =============================================================================
// FORM AND VALIDATION TYPES
// =============================================================================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  preventClose?: boolean;
}

export interface ButtonVariants {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// =============================================================================
// ROUTING AND NAVIGATION TYPES
// =============================================================================

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType;
  badge?: string | number;
  children?: NavigationItem[];
  requiresAuth?: boolean;
}

export interface RouteConfig {
  path: string;
  component: ComponentType;
  requiresAuth: boolean;
  layout?: ComponentType;
  title?: string;
  meta?: Record<string, any>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Status = "idle" | "loading" | "success" | "error";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  field: string;
  value: any;
  operator?: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "in";
}

// =============================================================================
// THEME AND STYLING TYPES
// =============================================================================

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: string;
  fontFamily: string;
}

// =============================================================================
// ERROR HANDLING TYPES
// =============================================================================

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

// =============================================================================
// ENVIRONMENT AND CONFIGURATION TYPES
// =============================================================================

export interface AppConfig {
  env: "development" | "staging" | "production";
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  appTitle: string;
  version: string;
}

// =============================================================================
// GENERIC UTILITY TYPES
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
