// Filename: colors.js
// Role: Centralized color configuration for the entire application
// Purpose: Provides consistent color palette and theming across all components
// Integration: Used throughout the application for consistent visual design

export const colors = {
  // Primary healing colors
  sage: {
    light: "hsl(142, 30%, 85%)",
    DEFAULT: "hsl(142, 30%, 70%)",
    dark: "hsl(142, 25%, 45%)",
  },
  forest: {
    light: "hsl(142, 72%, 45%)",
    DEFAULT: "hsl(142, 72%, 29%)",
    dark: "hsl(142, 45%, 55%)",
  },
  moss: {
    light: "hsl(120, 25%, 45%)",
    DEFAULT: "hsl(120, 25%, 25%)",
    dark: "hsl(120, 20%, 65%)",
  },

  // Action colors
  zoom: {
    light: "hsl(210, 100%, 65%)",
    DEFAULT: "hsl(210, 100%, 56%)",
    dark: "hsl(210, 100%, 50%)",
  },
  success: {
    light: "hsl(142, 70%, 50%)",
    DEFAULT: "hsl(142, 70%, 45%)",
    dark: "hsl(142, 70%, 40%)",
  },
  warning: {
    light: "hsl(35, 100%, 70%)",
    DEFAULT: "hsl(35, 100%, 65%)",
    dark: "hsl(35, 100%, 60%)",
  },
  danger: {
    light: "hsl(0, 70%, 60%)",
    DEFAULT: "hsl(0, 70%, 55%)",
    dark: "hsl(0, 70%, 50%)",
  },

  // Semantic colors
  primary: "hsl(142, 72%, 29%)", // Forest green
  secondary: "hsl(142, 30%, 85%)", // Sage
  accent: "hsl(35, 100%, 74%)", // Warm golden

  // Status colors
  completed: "hsl(142, 70%, 45%)",
  upcoming: "hsl(210, 100%, 56%)",
  cancelled: "hsl(0, 70%, 55%)",
  rescheduled: "hsl(35, 100%, 65%)",
};

// Color utility functions
export const getStatusColor = status => {
  switch (status) {
    case "completed":
      return colors.completed;
    case "upcoming":
      return colors.upcoming;
    case "cancelled":
      return colors.cancelled;
    case "rescheduled":
      return colors.rescheduled;
    default:
      return colors.moss.DEFAULT;
  }
};

export const getZoomButtonColor = () => colors.zoom.DEFAULT;

// Tailwind class mappings for easy use
export const tailwindClasses = {
  zoom: {
    bg: "bg-blue-600 hover:bg-blue-700",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  success: {
    bg: "bg-green-600 hover:bg-green-700",
    text: "text-green-600",
    border: "border-green-600",
  },
  warning: {
    bg: "bg-orange-600 hover:bg-orange-700",
    text: "text-orange-600",
    border: "border-orange-600",
  },
  danger: {
    bg: "bg-red-600 hover:bg-red-700",
    text: "text-red-600",
    border: "border-red-600",
  },
};
