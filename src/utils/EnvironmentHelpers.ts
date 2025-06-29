// Filename: EnvironmentHelpers.ts
// Role: Environment variable helpers and validation utilities
// Purpose: Provides type-safe access to environment variables with validation and defaults
// Integration: Used throughout the application for accessing configuration values

/**
 * Application environment configuration
 * Provides type-safe access to environment variables with validation
 */
export class EnvironmentConfig {
  // Supabase configuration
  static readonly SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  static readonly SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Application configuration
  static readonly APP_ENV = import.meta.env.VITE_APP_ENV || "development";
  static readonly APP_TITLE =
    import.meta.env.VITE_APP_TITLE || "Wellbloom Application";
  static readonly APP_BASE_URL =
    import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080";

  // Development configuration
  static readonly DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
  static readonly API_TIMEOUT = parseInt(
    import.meta.env.VITE_API_TIMEOUT || "10000"
  );

  /**
   * Validates that all required environment variables are present
   * @throws Error if any required variables are missing
   */
  static validateEnvironment(): void {
    const requiredVars = [
      { key: "VITE_SUPABASE_URL", value: this.SUPABASE_URL },
      { key: "VITE_SUPABASE_ANON_KEY", value: this.SUPABASE_ANON_KEY },
    ];

    const missingVars = requiredVars.filter(({ value }) => !value);

    if (missingVars.length > 0) {
      const missingKeys = missingVars.map(({ key }) => key).join(", ");
      throw new Error(
        `Missing required environment variables: ${missingKeys}. Please check your .env file.`
      );
    }
  }

  /**
   * Checks if the application is running in development mode
   */
  static isDevelopment(): boolean {
    return this.APP_ENV === "development";
  }

  /**
   * Checks if the application is running in production mode
   */
  static isProduction(): boolean {
    return this.APP_ENV === "production";
  }

  /**
   * Checks if the application is running in staging mode
   */
  static isStaging(): boolean {
    return this.APP_ENV === "staging";
  }

  /**
   * Gets the current environment name
   */
  static getEnvironment(): string {
    return this.APP_ENV;
  }

  /**
   * Gets the complete application configuration object
   */
  static getConfig() {
    return {
      supabase: {
        url: this.SUPABASE_URL,
        anonKey: this.SUPABASE_ANON_KEY,
      },
      app: {
        env: this.APP_ENV,
        title: this.APP_TITLE,
        baseUrl: this.APP_BASE_URL,
        devMode: this.DEV_MODE,
        apiTimeout: this.API_TIMEOUT,
      },
    };
  }
}

/**
 * Type-safe environment variable getter with fallback support
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key];

  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}

/**
 * Get boolean environment variable with fallback
 */
export function getBooleanEnvVar(key: string, fallback = false): boolean {
  const value = import.meta.env[key];

  if (value === undefined) {
    return fallback;
  }

  return value === "true" || value === "1";
}

/**
 * Get numeric environment variable with fallback
 */
export function getNumericEnvVar(key: string, fallback = 0): number {
  const value = import.meta.env[key];

  if (value === undefined) {
    return fallback;
  }

  const numericValue = parseInt(value, 10);
  return isNaN(numericValue) ? fallback : numericValue;
}

// Initialize environment validation on module load
EnvironmentConfig.validateEnvironment();
