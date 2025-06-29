// Filename: index.ts
// Role: Export barrel for admin components
// Purpose: Centralized exports for all admin-related components
// Integration: Used throughout the application to import admin components

export { default as AdminDashboard } from "../AdminDashboard";
export { default as AvailabilityManager } from "./AvailabilityManager";
export { default as TherapistProfile } from "./TherapistProfile";

// Export session components
export * from "./sessions";

// Export client components
export * from "./clients";
