// Filename: client.ts
// Role: Supabase client initialization and configuration
// Purpose: Creates and exports a properly configured Supabase client with TypeScript support
// Integration: Used throughout the application for database operations and authentication

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Debug logging
console.log("🔌 [DEBUG] Initializing Supabase client...");

// Temporarily using hardcoded values for debugging
const supabaseUrl = "https://dmmhdoivqudsuarziamb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbWhkb2l2cXVkc3VhcnppYW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzI3NjksImV4cCI6MjA2NTgwODc2OX0.iV_l2Xat0lA2yim2qvv7kvMhMH9m572OQ75PR4gxODI";

console.log("🔌 [DEBUG] Supabase URL:", supabaseUrl);
console.log(
  "🔌 [DEBUG] Supabase Key:",
  supabaseAnonKey ? "Present" : "Missing"
);

// Validate credentials
if (!supabaseUrl) {
  console.error("❌ [ERROR] Missing Supabase URL");
  throw new Error("Missing VITE_SUPABASE_URL environment variable.");
}

if (!supabaseAnonKey) {
  console.error("❌ [ERROR] Missing Supabase anon key");
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable.");
}

console.log("🔌 [DEBUG] Creating Supabase client...");

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

console.log("✅ [SUCCESS] Supabase client created successfully!");

// Type-safe helper for checking if user is authenticated
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching current user:", error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

// Helper for sign out with proper error handling
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Error in signOut:", error);
    throw error;
  }
};

// Export types for use throughout the application
export type { Database } from "./types";
