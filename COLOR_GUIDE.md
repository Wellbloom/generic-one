# Color System Guide

## Overview
The application uses a centralized color system located in `src/styles/colors.js`. This makes it easy to change the entire theme by modifying colors in one place.

## How to Change Colors

### Quick Theme Change
To change the main theme colors, edit the `theme` object in `src/styles/colors.js`:

```javascript
export const theme = {
  // Primary colors for buttons, headings, and main brand elements
  primary: {
    button: colors.orange.DEFAULT,        // Main button color
    buttonHover: colors.orange.dark,      // Button hover color
    heading: colors.orange.DEFAULT,       // Main heading color
    text: colors.orange.DEFAULT,          // Primary text color
    background: colors.orange.DEFAULT,    // Primary background color
    backgroundLight: `${colors.orange.DEFAULT}/10`, // Light background
  },
  
  // Secondary colors for secondary buttons and accents
  secondary: {
    button: colors.tangerine.DEFAULT,     // Secondary button color
    buttonHover: colors.tangerine.dark,   // Secondary button hover
    text: colors.tangerine.DEFAULT,       // Secondary text color
    background: colors.tangerine.DEFAULT, // Secondary background
    backgroundLight: `${colors.tangerine.DEFAULT}/10`, // Light background
  },

  // Navigation and interactive elements
  navigation: {
    hover: colors.orange.DEFAULT,         // Navigation hover color
    active: colors.orange.DEFAULT,        // Active navigation color
    arrows: colors.orange.DEFAULT,        // Arrow/icon colors
  },

  // Bullet points and small accents
  accent: {
    bullet: colors.orange.DEFAULT,        // Bullet point color
    badge: colors.orange.DEFAULT + "/90", // Badge background color
  },
};
```

### Changing Base Colors
To change the base color palette, edit the `colors` object:

```javascript
export const colors = {
  // Primary brand colors - EDIT THESE TO CHANGE THE THEME
  orange: {
    light: "hsl(14, 89%, 65%)",
    DEFAULT: "hsl(14, 89%, 55%)",  // Main orange color
    dark: "hsl(14, 89%, 45%)",
  },
  tangerine: {
    light: "hsl(28, 95%, 65%)",
    DEFAULT: "hsl(28, 95%, 55%)",  // Secondary orange color
    dark: "hsl(28, 95%, 45%)",
  },
  // ... other colors
};
```

## Examples

### Change to Blue Theme
```javascript
// In colors.js
orange: {
  light: "hsl(210, 100%, 65%)",
  DEFAULT: "hsl(210, 100%, 55%)",  // Blue instead of orange
  dark: "hsl(210, 100%, 45%)",
},
tangerine: {
  light: "hsl(220, 100%, 65%)",
  DEFAULT: "hsl(220, 100%, 55%)",  // Darker blue
  dark: "hsl(220, 100%, 45%)",
},
```

### Change to Green Theme
```javascript
// In colors.js
orange: {
  light: "hsl(142, 70%, 55%)",
  DEFAULT: "hsl(142, 70%, 45%)",  // Green instead of orange
  dark: "hsl(142, 70%, 35%)",
},
tangerine: {
  light: "hsl(152, 70%, 55%)",
  DEFAULT: "hsl(152, 70%, 45%)",  // Different green shade
  dark: "hsl(152, 70%, 35%)",
},
```

## Components Using the Color System

All major components now use the centralized color system:
- `Hero.tsx` - Uses `tailwindClasses.primary` for buttons and headings
- `Header.tsx` - Uses `tailwindClasses.primary` for navigation and buttons
- `Work.tsx` - Uses `tailwindClasses.primary` for buttons and interactive elements
- `Testimonials.tsx` - Uses `tailwindClasses.primary` for navigation arrows and buttons
- `Pricing.tsx` - Uses `tailwindClasses.primary` for bullet points and accents

## Tailwind Configuration

The colors are also added to `tailwind.config.ts` so you can use them directly in Tailwind classes:
- `bg-orange` / `text-orange` / `border-orange`
- `bg-tangerine` / `text-tangerine` / `border-tangerine`
- `bg-peach` / `text-peach` / `border-peach`

## Best Practices

1. **Always use the centralized colors** - Don't hardcode colors in components
2. **Use the `theme` object** for consistent theming across components
3. **Test your changes** - After changing colors, check all pages to ensure consistency
4. **Update Tailwind config** if you add new base colors

## File Structure
```
src/
├── styles/
│   └── colors.js          # Main color configuration
├── components/
│   ├── Hero.tsx           # Uses tailwindClasses.primary
│   ├── Header.tsx         # Uses tailwindClasses.primary
│   ├── Work.tsx           # Uses tailwindClasses.primary
│   ├── Testimonials.tsx   # Uses tailwindClasses.primary
│   └── Pricing.tsx        # Uses tailwindClasses.primary
└── tailwind.config.ts     # Tailwind color definitions
``` 