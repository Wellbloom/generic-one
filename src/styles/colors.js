// Filename: colors.js
// Role: Centralized color configuration for the entire application
// Purpose: Provides consistent color palette and theming across all components
// Integration: Used throughout the application for consistent visual design

export const colors = {
  // Primary brand colors from logo
  orange: {
    light: "hsl(28, 95%, 75%)",
    DEFAULT: "hsl(28, 95%, 65%)",
    dark: "hsl(28, 95%, 55%)",
  },
  tangerine: {
    light: "hsl(28, 95%, 80%)",
    DEFAULT: "hsl(28, 95%, 70%)",
    dark: "hsl(28, 95%, 60%)",
  },
  peach: {
    light: "hsl(35, 100%, 85%)",
    DEFAULT: "hsl(35, 100%, 75%)",
    dark: "hsl(35, 100%, 65%)",
  },
  cream: {
    light: "hsl(40, 33%, 97%)",
    DEFAULT: "hsl(40, 33%, 94%)",
    dark: "hsl(40, 33%, 91%)",
  },

  // Legacy colors (keeping for existing functionality)
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

  // Action colors (keeping these for functionality)
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

  // Semantic colors - CHANGE THESE TO UPDATE THE THEME
  primary: "hsl(14, 89%, 55%)", // Orange - Main brand color
  secondary: "hsl(28, 95%, 55%)", // Tangerine - Secondary brand color
  accent: "hsl(35, 100%, 75%)", // Peach - Accent color

  // Status colors (keeping these for functionality)
  completed: "hsl(142, 70%, 45%)",
  upcoming: "hsl(210, 100%, 56%)",
  cancelled: "hsl(0, 70%, 55%)",
  rescheduled: "hsl(35, 100%, 65%)",
};

// Theme configuration - MAIN PLACE TO CHANGE COLORS
export const theme = {
  // Primary colors for buttons, headings, and main brand elements
  primary: {
    button: colors.orange.DEFAULT,
    buttonHover: colors.orange.dark,
    heading: colors.orange.DEFAULT,
    text: colors.orange.DEFAULT,
    background: colors.orange.light,
    backgroundLight: `${colors.orange.light}/10`,
  },
  
  // Secondary colors for secondary buttons and accents
  secondary: {
    button: colors.tangerine.DEFAULT,
    buttonHover: colors.tangerine.dark,
    text: colors.tangerine.DEFAULT,
    background: colors.tangerine.light,
    backgroundLight: `${colors.tangerine.light}/10`,
  },

  // Navigation and interactive elements
  navigation: {
    hover: colors.orange.DEFAULT,
    active: colors.orange.DEFAULT,
    arrows: colors.orange.DEFAULT,
  },

  // Backgrounds and gradients
  background: {
    hero: `from-${colors.peach.light} to-white`,
    section: colors.orange.light + "/10",
    card: "white",
  },

  // Bullet points and small accents
  accent: {
    bullet: colors.orange.DEFAULT,
    badge: colors.orange.light + "/90",
  },
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
  primary: {
    bg: "bg-orange hover:bg-orange-dark",
    text: "text-orange",
    border: "border-orange",
    hover: "hover:text-orange hover:border-orange",
  },
  secondary: {
    bg: "bg-tangerine hover:bg-tangerine-dark",
    text: "text-tangerine",
    border: "border-tangerine",
    hover: "hover:text-tangerine hover:border-tangerine",
  },
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
    bg: "bg-orange hover:bg-orange-dark",
    text: "text-orange",
    border: "border-orange",
  },
  danger: {
    bg: "bg-red-600 hover:bg-red-700",
    text: "text-red-600",
    border: "border-red-600",
  },
};
