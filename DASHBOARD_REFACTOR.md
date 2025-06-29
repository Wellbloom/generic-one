# Dashboard Refactoring

## Overview
This refactor separates the client and admin dashboard functionality into distinct, organized components for better maintainability and separation of concerns.

## New Structure

### Client Dashboard
- **Location**: `src/components/client/dashboard/`
- **Main Component**: `ClientDashboard.tsx`
- **Purpose**: User-facing dashboard for clients to manage their therapy sessions
- **Features**:
  - Session booking interface
  - Session history and upcoming sessions view
  - Calendar integration
  - Responsive design for all device types

### Admin Dashboard
- **Location**: `src/components/admin/dashboard/`
- **Main Component**: `AdminDashboard.tsx`
- **Purpose**: Administrative interface for therapists
- **Features**:
  - Client management
  - Session oversight
  - System analytics
  - Administrative controls

## Key Improvements

1. **Separation of Concerns**: Client and admin functionality are now completely separate
2. **Better Organization**: Each dashboard type has its own dedicated folder structure
3. **Improved Maintainability**: Changes to client features won't affect admin features and vice versa
4. **Clean Imports**: Index files provide clean import paths
5. **Type Safety**: Proper TypeScript interfaces for component props

## Usage

### Client Dashboard
```tsx
import { ClientDashboard } from '@/components/client/dashboard';

<ClientDashboard onSwitchToAdmin={() => setAdminMode(true)} />
```

### Admin Dashboard
```tsx
import { AdminDashboard } from '@/components/admin/dashboard';

<AdminDashboard onSwitchToClient={() => setClientMode(true)} />
```

## File Structure
```
src/components/
├── client/
│   └── dashboard/
│       ├── ClientDashboard.tsx
│       └── index.ts
├── admin/
│   └── dashboard/
│       ├── AdminDashboard.tsx
│       └── index.ts
└── [existing components...]
```

## Migration Notes
- The main `Dashboard.tsx` now serves as a simple router between client and admin modes
- All session management logic has been moved to the appropriate dashboard components
- Modal states and handlers are now contained within their respective components
- The design matches the provided screenshot for the client dashboard
