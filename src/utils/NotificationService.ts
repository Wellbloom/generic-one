// Filename: NotificationService.ts
// Role: Centralized notification system for consistent toast messages
// Purpose: Provides standardized notification functions for all user actions (cancellations, purchases, bookings, etc.)
// Integration: Used throughout the application for consistent user feedback

import { toast } from "@/hooks/use-toast";

// Session-specific notifications
export const SessionNotifications = {
  // Session cancellation notifications
  cancelledFree: (sessionType: string, date: string, time: string) => {
    toast({
      title: "Session cancelled successfully",
      description: `Your ${sessionType.toLowerCase()} on ${date} at ${time} has been cancelled. No fee was charged.`,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  cancelledWithFee: (
    sessionType: string,
    date: string,
    time: string,
    fee: number
  ) => {
    toast({
      title: "Session cancelled with fee",
      description: `Your ${sessionType.toLowerCase()} on ${date} at ${time} has been cancelled. A $${fee.toFixed(2)} cancellation fee has been charged.`,
      duration: 5000,
      className:
        "border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    });
  },

  cancellationError: () => {
    toast({
      title: "Cancellation failed",
      description:
        "There was an error cancelling your session. Please try again or contact support.",
      duration: 6000,
      variant: "destructive",
    });
  },

  // Session rescheduling notifications
  rescheduledFree: (sessionType: string, oldDate: string, oldTime: string) => {
    toast({
      title: "Session rescheduled successfully",
      description: `Your ${sessionType.toLowerCase()} has been moved from ${oldDate} at ${oldTime}. You can now select a new time slot.`,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  rescheduledWithFee: (
    sessionType: string,
    oldDate: string,
    oldTime: string,
    fee: number
  ) => {
    toast({
      title: "Session rescheduled with fee",
      description: `Your ${sessionType.toLowerCase()} has been moved from ${oldDate} at ${oldTime}. A $${fee.toFixed(2)} rescheduling fee has been charged. You can now select a new time slot.`,
      duration: 5000,
      className:
        "border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    });
  },

  reschedulingError: () => {
    toast({
      title: "Rescheduling failed",
      description:
        "There was an error rescheduling your session. Please try again or contact support.",
      duration: 6000,
      variant: "destructive",
    });
  },

  // Session booking notifications
  booked: (sessionType: string, date: string, time: string) => {
    toast({
      title: "Session booked successfully!",
      description: `Your ${sessionType.toLowerCase()} is scheduled for ${date} at ${time}. You'll receive a confirmation email shortly.`,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  bookingError: () => {
    toast({
      title: "Booking failed",
      description:
        "There was an error booking your session. Please try again or contact support.",
      duration: 6000,
      variant: "destructive",
    });
  },
};

// Package-specific notifications
export const PackageNotifications = {
  purchased: (packageName: string, sessions: number) => {
    toast({
      title: "Package purchased successfully!",
      description: `Your ${packageName} (${sessions} sessions) has been added to your account. You can now schedule your sessions.`,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  purchaseError: () => {
    toast({
      title: "Purchase failed",
      description:
        "There was an error processing your purchase. Please try again or contact support.",
      duration: 6000,
      variant: "destructive",
    });
  },

  expired: (packageName: string) => {
    toast({
      title: "Package expired",
      description: `Your ${packageName} has expired. Purchase a new package to continue booking sessions.`,
      duration: 5000,
      className:
        "border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    });
  },

  nearExpiry: (packageName: string, daysLeft: number) => {
    toast({
      title: "Package expiring soon",
      description: `Your ${packageName} expires in ${daysLeft} days. Consider purchasing additional sessions.`,
      duration: 5000,
      className:
        "border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    });
  },
};

// General application notifications
export const AppNotifications = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 6000,
      variant: "destructive",
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 5000,
      className:
        "border-orange-200 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 4000,
      className:
        "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
    });
  },

  // Payment notifications
  paymentProcessed: (amount: number, description: string) => {
    toast({
      title: "Payment processed",
      description: `$${amount.toFixed(2)} has been charged for ${description}.`,
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  paymentFailed: (amount: number) => {
    toast({
      title: "Payment failed",
      description: `Unable to process $${amount.toFixed(2)} payment. Please check your payment method.`,
      duration: 6000,
      variant: "destructive",
    });
  },

  // Account notifications
  profileUpdated: () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  passwordChanged: () => {
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },

  // Agreement notifications
  agreementSigned: () => {
    toast({
      title: "Therapeutic Agreement Signed",
      description:
        "Your therapeutic agreement has been securely saved. Proceeding to payment setup...",
      duration: 4000,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    });
  },
};
