// Filename: PayAsYouGoTypes.ts
// Role: Type definitions for Pay-as-You-Go subscription system
// Purpose: Provides comprehensive TypeScript interfaces for recurring billing, scheduling, and therapeutic agreements
// Integration: Used throughout Pay-as-You-Go components and services

/**
 * Core Pay-as-You-Go subscription interface
 * Represents a complete recurring therapy subscription
 */
export interface PayAsYouGoSubscription {
  id: string;
  userId: string;
  therapistId: string;
  recurringSchedule: RecurringSchedule;
  billing: BillingConfiguration;
  sessionHistory: SessionHistoryEntry[];
  therapeuticFrameAccepted: TherapeuticFrameAgreement;
  isActive: boolean;
  isPaused: boolean;
  pausedReason?: string;
  pausedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  nextSessionDate: Date;
  emergencyContact?: EmergencyContact;
}

/**
 * Recurring schedule configuration
 * Defines when and how often sessions occur
 */
export interface RecurringSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string; // "14:00" format (24-hour)
  frequency: ScheduleFrequency;
  timezone: string;
  startDate: Date;
  endDate?: Date; // Optional end date for limited subscriptions
  skipHolidays: boolean;
  customSkipDates: Date[]; // Specific dates to skip (therapist vacation, etc.)
}

/**
 * Schedule frequency options
 */
export type ScheduleFrequency = "weekly" | "biweekly" | "monthly" | "custom";

/**
 * Billing configuration and payment details
 */
export interface BillingConfiguration {
  pricePerSession: number;
  currency: string;
  nextChargeDate: Date;
  lastChargedDate?: Date;
  paymentMethodId: string;
  billingAddress: BillingAddress;
  taxRate: number;
  taxIncluded: boolean;
  automaticRetry: boolean;
  retryAttempts: number;
  failedPaymentCount: number;
}

/**
 * Billing address information
 */
export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Individual session history entry
 */
export interface SessionHistoryEntry {
  id: string;
  subscriptionId: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: SessionStatus;
  chargedAmount: number;
  chargedDate?: Date;
  paymentIntentId?: string;
  refundAmount?: number;
  refundDate?: Date;
  rescheduleReason?: string;
  cancellationReason?: string;
  completionNotes?: string;
  zoomLink?: string;
  recordingUrl?: string;
}

/**
 * Session status types
 */
export type SessionStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no-show"
  | "payment-failed"
  | "refunded";

/**
 * Therapeutic frame agreement details
 */
export interface TherapeuticFrameAgreement {
  accepted: boolean;
  acceptedDate?: Date;
  documentVersion: string;
  digitalSignature?: string;
  ipAddress?: string;
  userAgent?: string;
  witnessEmail?: string;
  agreementText: string;
  keyTermsAcknowledged: KeyTermsAcknowledgment;
}

/**
 * Key terms that user must explicitly acknowledge
 */
export interface KeyTermsAcknowledgment {
  recurringBilling: boolean;
  cancellationPolicy: boolean;
  emergencyProtocol: boolean;
  confidentialityPolicy: boolean;
  recordingConsent: boolean;
  noShowPolicy: boolean;
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  canContactDuringTherapy?: boolean; // Made optional since UI no longer shows this
  notes?: string;
}

/**
 * Pay-as-You-Go setup flow state
 */
export interface PayAsYouGoSetupState {
  currentStep: SetupStep;
  selectedSchedule?: Partial<RecurringSchedule>;
  selectedPricing?: PricingOption;
  therapeuticFrameStatus: TherapeuticFrameStatus;
  paymentMethod?: PaymentMethodInfo;
  emergencyContact?: EmergencyContact;
  setupProgress: number; // 0-100 percentage
  errors: SetupError[];
  isProcessing: boolean;
}

/**
 * Setup flow steps
 */
export type SetupStep =
  | "schedule-selection"
  | "pricing-confirmation"
  | "therapeutic-frame"
  | "payment-setup"
  | "emergency-contact"
  | "final-confirmation";

/**
 * Therapeutic frame agreement status
 */
export type TherapeuticFrameStatus =
  | "pending"
  | "reviewing"
  | "signed"
  | "declined";

/**
 * Pricing options for Pay-as-You-Go
 */
export interface PricingOption {
  id: string;
  name: string;
  pricePerSession: number;
  description: string;
  features: string[];
  isRecommended: boolean;
  minimumCommitment?: number; // Minimum number of sessions
  discountPercentage?: number;
}

/**
 * Payment method information
 */
export interface PaymentMethodInfo {
  id: string;
  type: PaymentMethodType;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  billingAddress: BillingAddress;
}

/**
 * Payment method types
 */
export type PaymentMethodType = "card" | "bank_account" | "digital_wallet";

/**
 * Setup validation errors
 */
export interface SetupError {
  field: string;
  message: string;
  code: string;
}

/**
 * Notification preferences for Pay-as-You-Go
 */
export interface NotificationPreferences {
  paymentReminder: NotificationSetting;
  sessionReminder: NotificationSetting;
  scheduleChanges: NotificationSetting;
  emergencyAlerts: NotificationSetting;
  billingUpdates: NotificationSetting;
}

/**
 * Individual notification setting
 */
export interface NotificationSetting {
  email: boolean;
  sms: boolean;
  push: boolean;
  timingHours: number; // Hours before event
}

/**
 * Payment processing result
 */
export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  amount: number;
  currency: string;
  error?: PaymentError;
  requiresAction?: boolean;
  clientSecret?: string;
}

/**
 * Payment error details
 */
export interface PaymentError {
  code: string;
  message: string;
  type: PaymentErrorType;
  retryable: boolean;
}

/**
 * Payment error types
 */
export type PaymentErrorType =
  | "card_declined"
  | "insufficient_funds"
  | "expired_card"
  | "processing_error"
  | "network_error"
  | "authentication_required";

/**
 * Session preview for calendar display
 */
export interface SessionPreview {
  date: Date;
  time: string;
  duration: number; // minutes
  chargeDate: Date;
  amount: number;
  isConflict: boolean;
  conflictReason?: string;
}

/**
 * Subscription analytics data
 */
export interface SubscriptionAnalytics {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  totalRevenue: number;
  averageSessionCost: number;
  retentionRate: number;
  paymentSuccessRate: number;
  monthlyUsage: MonthlyUsageData[];
}

/**
 * Monthly usage data for analytics
 */
export interface MonthlyUsageData {
  month: string;
  year: number;
  sessionsCompleted: number;
  revenue: number;
  paymentFailures: number;
}

/**
 * Subscription modification request
 */
export interface SubscriptionModification {
  type: ModificationType;
  effectiveDate: Date;
  newSchedule?: Partial<RecurringSchedule>;
  newPricing?: number;
  reason: string;
  requestedBy: string;
  approvalRequired: boolean;
}

/**
 * Modification types
 */
export type ModificationType =
  | "schedule_change"
  | "pricing_change"
  | "pause_subscription"
  | "resume_subscription"
  | "cancel_subscription"
  | "payment_method_change";

/**
 * Therapist availability for scheduling
 */
export interface TherapistAvailability {
  therapistId: string;
  dayOfWeek: number;
  timeSlots: TimeSlot[];
  timezone: string;
  exceptions: AvailabilityException[];
}

/**
 * Available time slot
 */
export interface TimeSlot {
  startTime: string; // "14:00" format
  endTime: string;
  isAvailable: boolean;
  isReserved: boolean;
  reservedBy?: string;
}

/**
 * Availability exceptions (holidays, vacation, etc.)
 */
export interface AvailabilityException {
  date: Date;
  reason: string;
  isUnavailable: boolean;
  alternativeSlots?: TimeSlot[];
}
