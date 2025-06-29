// Filename: constants/index.ts
// Role: Defines application-wide constants and mock data
// Purpose: Provides consistent names for therapist and client throughout the app
// Integration: Used across components that need to display therapist or client information

// Mock data for consistent naming throughout the app
export const MOCK_DATA = {
  therapist: {
    name: "Silvia Labra",
    fullName: "Silvia Labra Osuna",
  },
  client: {
    name: "Sam Arondekar",
    firstName: "Sam",
  },
} as const;

// Other application constants can be added here as needed
export const APP_CONFIG = {
  therapist: {
    phone: "+1234567890", // Replace with actual therapist phone
    availability: "Mon-Fri 9AM-6PM",
    responseTime: "Usually responds within 2 hours",
  },
} as const;

export const THERAPIST = {
  name: "Jean Grey",
  fullName: "Jean Grey",
} as const;
