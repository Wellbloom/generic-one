// Filename: PayAsYouGoService.ts
// Role: Service layer for Pay-as-You-Go API interactions
// Purpose: Handles all API calls for subscription management, billing, and scheduling
// Integration: Used by Redux actions and components for data operations

import {
  PayAsYouGoSubscription,
  RecurringSchedule,
  SessionPreview,
  PaymentResult,
  SubscriptionAnalytics,
  TherapistAvailability,
  SessionHistoryEntry,
} from "@/types/PayAsYouGoTypes";

/**
 * Mock API service for Pay-as-You-Go functionality
 * In production, this would connect to your backend API
 */
export class PayAsYouGoService {
  private static baseUrl = "/api/pay-as-you-go";

  /**
   * Create a new Pay-as-You-Go subscription
   */
  static async createSubscription(
    subscriptionData: Partial<PayAsYouGoSubscription>
  ): Promise<PayAsYouGoSubscription> {
    try {
      // Mock API call - replace with actual API integration
      const response = await fetch(`${this.baseUrl}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  /**
   * Get user's Pay-as-You-Go subscriptions
   */
  static async getUserSubscriptions(
    userId: string
  ): Promise<PayAsYouGoSubscription[]> {
    try {
      // Mock API call
      const response = await fetch(
        `${this.baseUrl}/users/${userId}/subscriptions`
      );

      if (!response.ok) {
        throw new Error("Failed to load subscriptions");
      }

      return await response.json();
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      throw error;
    }
  }

  /**
   * Process payment for a session
   */
  static async processSessionPayment(paymentData: {
    subscriptionId: string;
    sessionId: string;
    amount: number;
  }): Promise<PaymentResult> {
    try {
      // Mock payment processing - integrate with Stripe or other payment processor
      const response = await fetch(`${this.baseUrl}/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  /**
   * Update subscription schedule
   */
  static async updateSubscriptionSchedule(
    subscriptionId: string,
    newSchedule: Partial<RecurringSchedule>
  ): Promise<RecurringSchedule> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscriptions/${subscriptionId}/schedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSchedule),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    subscriptionId: string,
    reason: string,
    effectiveDate: Date
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason, effectiveDate }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  /**
   * Generate session previews for a given schedule
   */
  static async generateSessionPreviews(
    schedule: RecurringSchedule
  ): Promise<SessionPreview[]> {
    try {
      // Mock session preview generation
      const previews: SessionPreview[] = [];
      const startDate = new Date();
      const numberOfSessions = 12; // Generate 12 session previews

      for (let i = 0; i < numberOfSessions; i++) {
        const sessionDate = this.getNextSessionDate(startDate, schedule, i);
        const chargeDate = new Date(sessionDate);
        chargeDate.setHours(chargeDate.getHours() - 48); // Charge 48 hours before

        previews.push({
          date: sessionDate,
          time: schedule.timeSlot,
          duration: 60, // 60 minutes
          chargeDate,
          amount: 175, // Default amount - would come from pricing
          isConflict: false,
        });
      }

      return previews;
    } catch (error) {
      console.error("Error generating session previews:", error);
      throw error;
    }
  }

  /**
   * Get subscription analytics
   */
  static async getSubscriptionAnalytics(
    subscriptionId: string
  ): Promise<SubscriptionAnalytics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscriptions/${subscriptionId}/analytics`
      );

      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }

      return await response.json();
    } catch (error) {
      console.error("Error loading analytics:", error);
      throw error;
    }
  }

  /**
   * Get therapist availability
   */
  static async getTherapistAvailability(
    therapistId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TherapistAvailability[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/therapists/${therapistId}/availability?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to load therapist availability");
      }

      return await response.json();
    } catch (error) {
      console.error("Error loading therapist availability:", error);
      throw error;
    }
  }

  /**
   * Reschedule a session
   */
  static async rescheduleSession(
    sessionId: string,
    newDate: Date,
    newTime: string,
    reason?: string
  ): Promise<SessionHistoryEntry> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sessions/${sessionId}/reschedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newDate: newDate.toISOString(),
            newTime,
            reason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule session");
      }

      return await response.json();
    } catch (error) {
      console.error("Error rescheduling session:", error);
      throw error;
    }
  }

  /**
   * Cancel a session
   */
  static async cancelSession(
    sessionId: string,
    reason: string,
    refundAmount?: number
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sessions/${sessionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
            refundAmount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel session");
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  }

  /**
   * Pause subscription
   */
  static async pauseSubscription(
    subscriptionId: string,
    reason: string,
    pauseUntil?: Date
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscriptions/${subscriptionId}/pause`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
            pauseUntil: pauseUntil?.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pause subscription");
      }
    } catch (error) {
      console.error("Error pausing subscription:", error);
      throw error;
    }
  }

  /**
   * Resume subscription
   */
  static async resumeSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscriptions/${subscriptionId}/resume`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resume subscription");
      }
    } catch (error) {
      console.error("Error resuming subscription:", error);
      throw error;
    }
  }

  /**
   * Helper method to calculate next session date based on frequency
   */
  private static getNextSessionDate(
    startDate: Date,
    schedule: RecurringSchedule,
    sessionIndex: number
  ): Date {
    const date = new Date(startDate);

    // Find the next occurrence of the specified day of week
    const daysUntilTarget = (schedule.dayOfWeek - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysUntilTarget);

    // Apply frequency multiplier
    switch (schedule.frequency) {
      case "weekly":
        date.setDate(date.getDate() + sessionIndex * 7);
        break;
      case "biweekly":
        date.setDate(date.getDate() + sessionIndex * 14);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + sessionIndex);
        break;
      default:
        // Custom frequency handling would go here
        break;
    }

    // Set the time
    const [hours, minutes] = schedule.timeSlot.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date;
  }

  /**
   * Stripe integration methods
   */
  static async createPaymentIntent(
    amount: number,
    currency = "usd"
  ): Promise<any> {
    try {
      // This would integrate with your Stripe backend
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  /**
   * Setup recurring payments with Stripe
   */
  static async setupRecurringPayment(
    customerId: string,
    paymentMethodId: string,
    amount: number
  ): Promise<any> {
    try {
      const response = await fetch("/api/setup-recurring-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          paymentMethodId,
          amount: amount * 100, // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to setup recurring payment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error setting up recurring payment:", error);
      throw error;
    }
  }
}
