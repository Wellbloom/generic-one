// Filename: payAsYouGoSlice.ts
// Role: Redux state management for Recurring Sessions subscriptions
// Purpose: Centralized state management for recurring billing, scheduling, and subscription lifecycle with individual session billing
// Integration: Used by all Recurring Sessions components for consistent state management

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  PayAsYouGoSubscription,
  PayAsYouGoSetupState,
  SessionHistoryEntry,
  RecurringSchedule,
  PricingOption,
  PaymentMethodInfo,
  EmergencyContact,
  SetupStep,
  TherapeuticFrameStatus,
  SetupError,
  SessionPreview,
  SubscriptionAnalytics,
  PaymentResult,
} from "@/types/PayAsYouGoTypes";
import { PayAsYouGoService } from "@/services/PayAsYouGoService";

/**
 * Pay-as-You-Go state interface
 */
interface PayAsYouGoState {
  // Active subscriptions
  subscriptions: PayAsYouGoSubscription[];
  activeSubscription: PayAsYouGoSubscription | null;

  // Setup flow state
  setupState: PayAsYouGoSetupState;

  // Session management
  upcomingSessions: SessionHistoryEntry[];
  sessionHistory: SessionHistoryEntry[];
  sessionPreviews: SessionPreview[];

  // Billing and payments
  paymentMethods: PaymentMethodInfo[];
  billingHistory: SessionHistoryEntry[];
  nextPaymentAmount: number;
  nextPaymentDate: Date | null;

  // Analytics and insights
  analytics: SubscriptionAnalytics | null;

  // UI state
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;

  // Pricing options
  availablePricingOptions: PricingOption[];

  // Therapist availability
  therapistAvailability: any[]; // Will be populated from therapist service

  isSetupActive: boolean;
  currentStep: string;
  selectedSchedule: any;
  selectedPricing: any;
}

/**
 * Initial state
 */
const initialState: PayAsYouGoState = {
  subscriptions: [],
  activeSubscription: null,
  setupState: {
    currentStep: "schedule-selection",
    therapeuticFrameStatus: "pending",
    setupProgress: 0,
    errors: [],
    isProcessing: false,
  },
  upcomingSessions: [],
  sessionHistory: [],
  sessionPreviews: [],
  paymentMethods: [],
  billingHistory: [],
  nextPaymentAmount: 0,
  nextPaymentDate: null,
  analytics: null,
  isLoading: false,
  isProcessingPayment: false,
  error: null,
  availablePricingOptions: [
    {
      id: "standard",
      name: "Standard Recurring Sessions",
      pricePerSession: 175,
      description: "Pay for each session as scheduled. No commitment required.",
      features: [
        "Flexible scheduling",
        "Cancel anytime with 24h notice",
        "Full session recordings",
        "Email support",
        "Secure video sessions",
      ],
      isRecommended: false,
    },
    {
      id: "commitment-4",
      name: "4-Session Commitment",
      pricePerSession: 165,
      description: "Commit to 4 sessions and save $10 per session.",
      features: [
        "All standard features",
        "$10 savings per session",
        "Priority scheduling",
        "Session notes included",
        "Flexible rescheduling",
      ],
      isRecommended: false,
      minimumCommitment: 4,
      discountPercentage: 5.7,
    },
    {
      id: "commitment-8",
      name: "8-Session Commitment",
      pricePerSession: 155,
      description: "Commit to 8 sessions and save $20 per session.",
      features: [
        "All standard features",
        "$20 savings per session",
        "Priority scheduling",
        "Detailed progress tracking",
        "Emergency support access",
      ],
      isRecommended: true,
      minimumCommitment: 8,
      discountPercentage: 11.4,
    },
    {
      id: "commitment-12",
      name: "12-Session Commitment",
      pricePerSession: 145,
      description: "Commit to 12 sessions and save $30 per session.",
      features: [
        "All standard features",
        "$30 savings per session",
        "Dedicated therapist",
        "Comprehensive progress reports",
        "24/7 emergency support",
        "Family session included",
      ],
      isRecommended: false,
      minimumCommitment: 12,
      discountPercentage: 17.1,
    },
  ],
  therapistAvailability: [],
  isSetupActive: false,
  currentStep: "schedule-selection",
  selectedSchedule: null,
  selectedPricing: null,
};

/**
 * Async thunks for API calls
 */

// Create new Pay-as-You-Go subscription
export const createSubscription = createAsyncThunk(
  "payAsYouGo/createSubscription",
  async (subscriptionData: Partial<PayAsYouGoSubscription>) => {
    const response =
      await PayAsYouGoService.createSubscription(subscriptionData);
    return response;
  }
);

// Load user's subscriptions
export const loadSubscriptions = createAsyncThunk(
  "payAsYouGo/loadSubscriptions",
  async (userId: string) => {
    const response = await PayAsYouGoService.getUserSubscriptions(userId);
    return response;
  }
);

// Process payment for session
export const processPayment = createAsyncThunk(
  "payAsYouGo/processPayment",
  async (paymentData: {
    subscriptionId: string;
    sessionId: string;
    amount: number;
  }) => {
    const response = await PayAsYouGoService.processSessionPayment(paymentData);
    return response;
  }
);

// Update subscription schedule
export const updateSchedule = createAsyncThunk(
  "payAsYouGo/updateSchedule",
  async (data: {
    subscriptionId: string;
    newSchedule: Partial<RecurringSchedule>;
  }) => {
    const response = await PayAsYouGoService.updateSubscriptionSchedule(
      data.subscriptionId,
      data.newSchedule
    );
    return response;
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  "payAsYouGo/cancelSubscription",
  async (data: {
    subscriptionId: string;
    reason: string;
    effectiveDate: Date;
  }) => {
    const response = await PayAsYouGoService.cancelSubscription(
      data.subscriptionId,
      data.reason,
      data.effectiveDate
    );
    return response;
  }
);

// Generate session previews
export const generateSessionPreviews = createAsyncThunk(
  "payAsYouGo/generateSessionPreviews",
  async (schedule: RecurringSchedule) => {
    const response = await PayAsYouGoService.generateSessionPreviews(schedule);
    return response;
  }
);

// Load subscription analytics
export const loadAnalytics = createAsyncThunk(
  "payAsYouGo/loadAnalytics",
  async (subscriptionId: string) => {
    const response =
      await PayAsYouGoService.getSubscriptionAnalytics(subscriptionId);
    return response;
  }
);

/**
 * Pay-as-You-Go slice
 */
const payAsYouGoSlice = createSlice({
  name: "payAsYouGo",
  initialState,
  reducers: {
    // Setup flow management
    setSetupStep: (state, action: PayloadAction<SetupStep>) => {
      state.setupState.currentStep = action.payload;
      state.setupState.setupProgress = getStepProgress(action.payload);
    },

    setSelectedSchedule: (
      state,
      action: PayloadAction<Partial<RecurringSchedule>>
    ) => {
      state.setupState.selectedSchedule = action.payload;
    },

    setSelectedPricing: (state, action: PayloadAction<PricingOption>) => {
      state.setupState.selectedPricing = action.payload;
    },

    setTherapeuticFrameStatus: (
      state,
      action: PayloadAction<TherapeuticFrameStatus>
    ) => {
      state.setupState.therapeuticFrameStatus = action.payload;
    },

    setPaymentMethod: (state, action: PayloadAction<PaymentMethodInfo>) => {
      state.setupState.paymentMethod = action.payload;
    },

    setEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.setupState.emergencyContact = action.payload;
    },

    addSetupError: (state, action: PayloadAction<SetupError>) => {
      state.setupState.errors.push(action.payload);
    },

    clearSetupErrors: state => {
      state.setupState.errors = [];
    },

    setSetupProcessing: (state, action: PayloadAction<boolean>) => {
      state.setupState.isProcessing = action.payload;
    },

    // Session management
    addUpcomingSession: (state, action: PayloadAction<SessionHistoryEntry>) => {
      state.upcomingSessions.push(action.payload);
    },

    updateSessionStatus: (
      state,
      action: PayloadAction<{ sessionId: string; status: any; notes?: string }>
    ) => {
      const { sessionId, status, notes } = action.payload;

      // Update in upcoming sessions
      const upcomingIndex = state.upcomingSessions.findIndex(
        s => s.id === sessionId
      );
      if (upcomingIndex !== -1) {
        state.upcomingSessions[upcomingIndex].status = status;
        if (notes) {
          state.upcomingSessions[upcomingIndex].completionNotes = notes;
        }

        // Move to history if completed/cancelled
        if (status === "completed" || status === "cancelled") {
          const session = state.upcomingSessions.splice(upcomingIndex, 1)[0];
          state.sessionHistory.unshift(session);
        }
      }

      // Update in active subscription
      if (state.activeSubscription) {
        const sessionIndex = state.activeSubscription.sessionHistory.findIndex(
          s => s.id === sessionId
        );
        if (sessionIndex !== -1) {
          state.activeSubscription.sessionHistory[sessionIndex].status = status;
          if (notes) {
            state.activeSubscription.sessionHistory[
              sessionIndex
            ].completionNotes = notes;
          }
        }
      }
    },

    // Payment management
    addPaymentMethod: (state, action: PayloadAction<PaymentMethodInfo>) => {
      state.paymentMethods.push(action.payload);
    },

    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(
        pm => pm.id !== action.payload
      );
    },

    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods.forEach(pm => {
        pm.isDefault = pm.id === action.payload;
      });
    },

    updateNextPayment: (
      state,
      action: PayloadAction<{ amount: number; date: Date }>
    ) => {
      state.nextPaymentAmount = action.payload.amount;
      state.nextPaymentDate = action.payload.date;
    },

    // Subscription management
    setActiveSubscription: (
      state,
      action: PayloadAction<PayAsYouGoSubscription>
    ) => {
      state.activeSubscription = action.payload;
      state.upcomingSessions = action.payload.sessionHistory.filter(
        s => s.status === "scheduled"
      );
      state.sessionHistory = action.payload.sessionHistory.filter(
        s => s.status !== "scheduled"
      );
    },

    pauseSubscription: (
      state,
      action: PayloadAction<{ reason: string; until?: Date }>
    ) => {
      if (state.activeSubscription) {
        state.activeSubscription.isPaused = true;
        state.activeSubscription.pausedReason = action.payload.reason;
        state.activeSubscription.pausedUntil = action.payload.until;
      }
    },

    resumeSubscription: state => {
      if (state.activeSubscription) {
        state.activeSubscription.isPaused = false;
        state.activeSubscription.pausedReason = undefined;
        state.activeSubscription.pausedUntil = undefined;
      }
    },

    // UI state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setProcessingPayment: (state, action: PayloadAction<boolean>) => {
      state.isProcessingPayment = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: state => {
      state.error = null;
    },

    // Reset setup state
    resetSetupState: state => {
      state.setupState = {
        currentStep: "schedule-selection",
        therapeuticFrameStatus: "pending",
        setupProgress: 0,
        errors: [],
        isProcessing: false,
      };
    },

    // Session previews
    setSessionPreviews: (state, action: PayloadAction<SessionPreview[]>) => {
      state.sessionPreviews = action.payload;
    },

    clearSessionPreviews: state => {
      state.sessionPreviews = [];
    },

    startSetup: state => {
      state.isSetupActive = true;
    },

    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
    },
  },

  extraReducers: builder => {
    // Create subscription
    builder
      .addCase(createSubscription.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.push(action.payload);
        state.activeSubscription = action.payload;
        state.setupState.isProcessing = false;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create subscription";
        state.setupState.isProcessing = false;
      });

    // Load subscriptions
    builder
      .addCase(loadSubscriptions.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload;
        state.activeSubscription = action.payload.find(s => s.isActive) || null;
      })
      .addCase(loadSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load subscriptions";
      });

    // Process payment
    builder
      .addCase(processPayment.pending, state => {
        state.isProcessingPayment = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isProcessingPayment = false;
        // Update session with payment information
        const paymentResult = action.payload as PaymentResult;
        // Additional logic to update session status based on payment result
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isProcessingPayment = false;
        state.error = action.error.message || "Payment processing failed";
      });

    // Update schedule
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      if (state.activeSubscription) {
        state.activeSubscription.recurringSchedule = {
          ...state.activeSubscription.recurringSchedule,
          ...action.payload,
        };
      }
    });

    // Cancel subscription
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      const subscriptionId = action.meta.arg.subscriptionId;
      state.subscriptions = state.subscriptions.map(sub =>
        sub.id === subscriptionId ? { ...sub, isActive: false } : sub
      );
      if (state.activeSubscription?.id === subscriptionId) {
        state.activeSubscription.isActive = false;
      }
    });

    // Generate session previews
    builder.addCase(generateSessionPreviews.fulfilled, (state, action) => {
      state.sessionPreviews = action.payload;
    });

    // Load analytics
    builder.addCase(loadAnalytics.fulfilled, (state, action) => {
      state.analytics = action.payload;
    });
  },
});

/**
 * Helper function to calculate setup progress percentage
 */
function getStepProgress(step: SetupStep): number {
  const stepOrder: SetupStep[] = [
    "schedule-selection",
    "pricing-confirmation",
    "therapeutic-frame",
    "payment-setup",
    "emergency-contact",
    "final-confirmation",
  ];

  const currentIndex = stepOrder.indexOf(step);
  return Math.round(((currentIndex + 1) / stepOrder.length) * 100);
}

// Export actions
export const {
  setSetupStep,
  setSelectedSchedule,
  setSelectedPricing,
  setTherapeuticFrameStatus,
  setPaymentMethod,
  setEmergencyContact,
  addSetupError,
  clearSetupErrors,
  setSetupProcessing,
  addUpcomingSession,
  updateSessionStatus,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  updateNextPayment,
  setActiveSubscription,
  pauseSubscription,
  resumeSubscription,
  setLoading,
  setProcessingPayment,
  setError,
  clearError,
  resetSetupState,
  setSessionPreviews,
  clearSessionPreviews,
  startSetup,
  setCurrentStep,
} = payAsYouGoSlice.actions;

// Export selectors
export const selectPayAsYouGoState = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo;
export const selectActiveSubscription = (state: {
  payAsYouGo: PayAsYouGoState;
}) => state.payAsYouGo.activeSubscription;
export const selectSetupState = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.setupState;
export const selectUpcomingSessions = (state: {
  payAsYouGo: PayAsYouGoState;
}) => state.payAsYouGo.upcomingSessions;
export const selectSessionHistory = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.sessionHistory;
export const selectPaymentMethods = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.paymentMethods;
export const selectPricingOptions = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.availablePricingOptions;
export const selectSessionPreviews = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.sessionPreviews;
export const selectAnalytics = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.analytics;
export const selectIsLoading = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.isLoading;
export const selectError = (state: { payAsYouGo: PayAsYouGoState }) =>
  state.payAsYouGo.error;

export default payAsYouGoSlice.reducer;
