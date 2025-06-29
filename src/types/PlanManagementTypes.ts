// Filename: PlanManagementTypes.ts
// Role: Type definitions for pay-as-you-go plan management
// Purpose: Provides TypeScript interfaces for Pay-as-You-Go plan functionality only
// Integration: Used throughout pay-as-you-go components and services

export type PlanType = "pay-as-you-go" | "individual-session";

export interface CurrentPlanStatus {
  planType: PlanType;
  isActive: boolean;
  planDetails: PayAsYouGoPlanDetails | IndividualSessionDetails;
}

export interface PayAsYouGoPlanDetails {
  subscriptionId: string;
  isActive: boolean;
  isPaused: boolean;
  recurringSchedule: {
    dayOfWeek: number;
    timeSlot: string;
    frequency: string;
  };
  pricePerSession: number;
  nextSessionDate: Date;
  nextChargeDate: Date;
}

export interface IndividualSessionDetails {
  sessionsBooked: number;
  upcomingSessions: number;
  completedSessions: number;
  pricePerSession: number;
}

export interface SessionInfo {
  sessionId: string;
  date: Date;
  time: string;
  status: string;
  amount: number;
}

export interface BillingInfo {
  type: "recurring" | "one-time";
  amount: number;
  frequency?: string;
  nextCharge?: Date;
}

export interface PlanStatus {
  isActive: boolean;
  isPaused?: boolean;
  nextPaymentDate?: Date;
  nextSessionDate?: Date;
  pricePerSession: number;
}

export interface PricingInfo {
  basePrice: number;
  pricePerSession: number;
  billingFrequency: string;
  commitmentRequired: boolean;
}

// Utility types for session management
export interface SessionBookingResult {
  success: boolean;
  sessionDetails?: SessionInfo;
  error?: string;
}
