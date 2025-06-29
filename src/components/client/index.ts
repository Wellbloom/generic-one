// Filename: index.ts
// Role: Export barrel for all client components
// Purpose: Provides clean import paths for all client-related components
// Integration: Used throughout the application to import client components

export { default as ClientDashboard } from "./dashboard/ClientDashboard";
export { default as SessionTypeSelector } from "./SessionTypeSelector";
export * from "./sessions";
export * from "./recurring-sessions";
