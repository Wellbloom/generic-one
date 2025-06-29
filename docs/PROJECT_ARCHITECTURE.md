# 🏗️ Project Architecture Documentation

## Overview

This document outlines the architectural decisions, patterns, and best practices implemented in the Wellbloom React application using the VIBE technology stack.

## 🎯 Design Principles

### 1. **Separation of Concerns**

- Clear boundaries between presentation, business logic, and data access
- Components focus on rendering, hooks handle state logic
- Services manage external API interactions

### 2. **Type Safety First**

- TypeScript throughout the entire application
- Strict type checking enabled
- Custom type definitions for all interfaces

### 3. **Developer Experience**

- Hot module replacement with Vite
- Consistent code formatting with Prettier
- Comprehensive linting with ESLint
- Path aliases for clean imports

### 4. **Performance Optimization**

- Lazy loading for code splitting
- Optimized bundle size with Vite
- Efficient re-rendering with React patterns

## 📁 Directory Structure Explained

### `/src/components/`

```
components/
├── ui/           # ShadCN base components (Button, Input, etc.)
├── auth/         # Authentication-specific components
├── common/       # Shared application components
└── [feature]/    # Feature-specific components
```

**Naming Convention**: PascalCase for components (`UserProfile.tsx`)

### `/src/hooks/`

Custom React hooks for reusable stateful logic:

- `useSupabaseAuth.ts` - Authentication state management
- `use-mobile.tsx` - Mobile device detection
- `use-toast.ts` - Toast notification management

**Naming Convention**: camelCase starting with "use" (`useCustomHook.ts`)

### `/src/services/`

Service layer for external API interactions:

- `SupabaseAuthService.ts` - Authentication operations
- Clear separation between data fetching and UI logic
- Consistent error handling patterns

**Naming Convention**: PascalCase ending with "Service" (`ApiService.ts`)

### `/src/utils/`

Pure utility functions and helpers:

- `EnvironmentHelpers.ts` - Environment variable management
- `ValidationHelpers.ts` - Form validation utilities
- No side effects, easily testable functions

### `/src/types/`

TypeScript type definitions:

- `ApplicationTypes.ts` - Global application types
- Interface definitions for data models
- Utility types for enhanced type safety

### `/src/integrations/`

Third-party service integrations:

- `supabase/` - Supabase client configuration and types
- Isolated integration logic
- Easy to swap or modify external services

## 🔧 Technology Stack Architecture

### **Frontend Layer**

```
┌─────────────────────────────────────┐
│             React 18+               │
│         (User Interface)            │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│           ShadCN UI +               │
│          Tailwind CSS               │
│          (Styling)                  │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│         TanStack Query              │
│       (State Management)            │
└─────────────────────────────────────┘
```

### **Build & Development Layer**

```
┌─────────────────────────────────────┐
│              Vite                   │
│        (Build Tool)                 │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│    TypeScript + ESLint + Prettier   │
│      (Code Quality & Types)         │
└─────────────────────────────────────┘
```

### **Backend Integration Layer**

```
┌─────────────────────────────────────┐
│            Supabase                 │
│   (Authentication & Database)       │
└─────────────────────────────────────┘
```

## 🔄 Data Flow Patterns

### 1. **Authentication Flow**

```
User Action → useSupabaseAuth Hook → SupabaseAuthService → Supabase Client → UI Update
```

### 2. **Form Handling Flow**

```
User Input → React Hook Form → Validation Helpers → API Service → Success/Error State
```

### 3. **Component Communication**

```
Parent Component → Props → Child Component
Child Component → Callback Props → Parent Component
Global State → Context/Hooks → Components
```

## 🛡️ Security Considerations

### **Environment Variables**

- All sensitive data stored in environment variables
- Runtime validation of required variables
- Separate configurations for different environments

### **Authentication**

- Secure session management with Supabase
- Protected routes implementation
- Automatic token refresh handling

### **Type Safety**

- Runtime type validation where appropriate
- Strict TypeScript configuration
- Input sanitization and validation

## 🎨 Styling Architecture

### **Tailwind CSS Configuration**

- Custom design tokens for brand consistency
- Responsive design utilities
- Dark mode support ready

### **Component Styling Patterns**

- CSS-in-JS avoided in favor of utility classes
- Consistent spacing and typography scales
- Reusable component variants with CVA

## 📊 State Management Strategy

### **Client State**

- Component-local state with `useState`
- Shared state with React Context
- Complex state with `useReducer`

### **Server State**

- TanStack Query for API data
- Automatic caching and synchronization
- Optimistic updates for better UX

### **Form State**

- React Hook Form for form management
- Zod schemas for validation
- Consistent error handling patterns

## 🧪 Testing Strategy (Future Implementation)

### **Unit Testing**

- Component testing with React Testing Library
- Utility function testing with Jest
- Hook testing with React Hooks Testing Library

### **Integration Testing**

- API integration testing
- Authentication flow testing
- Form submission testing

### **End-to-End Testing**

- Critical user journey testing
- Cross-browser compatibility testing

## 🚀 Performance Optimization

### **Bundle Optimization**

- Code splitting with React.lazy
- Tree shaking with ES modules
- Dynamic imports for large dependencies

### **Runtime Performance**

- Memoization with React.memo and useMemo
- Virtualization for large lists
- Image optimization and lazy loading

## 🔧 Development Workflow

### **Code Quality Pipeline**

1. TypeScript compilation
2. ESLint static analysis
3. Prettier code formatting
4. Pre-commit hooks validation

### **Environment Management**

- Development: Local development with HMR
- Staging: Pre-production testing environment
- Production: Optimized build with error tracking

## 📈 Scalability Considerations

### **Component Architecture**

- Atomic design principles
- Composable component patterns
- Clear component boundaries

### **Code Organization**

- Feature-based folder structure
- Consistent naming conventions
- Clear separation of concerns

### **Performance at Scale**

- Lazy loading strategies
- Efficient re-rendering patterns
- Memory leak prevention

---

This architecture provides a solid foundation for building maintainable, scalable React applications while maintaining developer productivity and code quality.
