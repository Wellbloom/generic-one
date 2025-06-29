# 🌟 Wellbloom React Application

A professional-grade web application built with the **VIBE** technology stack: **V**ite, **I**ntegration with React, **B**uilding with Tailwind CSS, and **E**nabling backend functionality with Supabase.

## 🚀 Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (latest stable version)
- **Styling Framework**: Tailwind CSS with ShadCN UI components
- **Backend Service**: Supabase (authentication, database, real-time)
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Package Manager**: npm

## 📁 Project Structure

```
wellbloom-app/
├── public/                     # Static assets and favicon
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # ShadCN base UI components
│   │   ├── auth/              # Authentication-specific components
│   │   └── common/            # Shared application components
│   ├── pages/                 # Page-level components
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions and helpers
│   ├── services/              # API calls and external services
│   ├── types/                 # TypeScript type definitions
│   ├── integrations/          # Third-party service integrations
│   │   └── supabase/         # Supabase client and types
│   ├── contexts/              # React context providers
│   └── assets/                # Images, icons, and other media
├── supabase/                  # Supabase configuration and migrations
└── docs/                      # Project documentation
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Add your Supabase credentials to .env
   # VITE_SUPABASE_URL=your_supabase_url
   # VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`

## 📜 Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run build:staging` - Build for staging environment
- `npm run preview` - Preview production build locally

### Code Quality

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix auto-fixable ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run type-check` - Run TypeScript type checking

### Maintenance

- `npm run clean` - Clean build artifacts and cache
- `npm run prepare` - Run all quality checks (type-check, lint, format)

## ⚙️ Configuration

### Environment Variables

| Variable                 | Description                  | Required |
| ------------------------ | ---------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL    | ✅       |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key  | ✅       |
| `VITE_APP_ENV`           | Application environment      | ❌       |
| `VITE_APP_TITLE`         | Application title            | ❌       |
| `VITE_APP_BASE_URL`      | Base URL for the application | ❌       |

### Code Style

- **ESLint**: Modern flat config with React and TypeScript rules
- **Prettier**: Consistent code formatting with custom rules
- **TypeScript**: Strict type checking enabled
- **Path Aliases**: Use `@/` for `src/` imports

### Tailwind CSS

The project uses a custom Tailwind configuration with:

- **Custom Colors**: Sage, forest, and moss theme colors
- **Typography**: Inter (sans-serif) and Playfair Display (serif)
- **Animations**: Custom accordion animations
- **Components**: ShadCN UI component library

## 🔐 Authentication Setup

The project includes a complete Supabase authentication system:

### Features

- Email/password authentication
- Password reset functionality
- Session management
- Protected routes
- Authentication state management

### Usage Example

```typescript
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

function LoginComponent() {
  const { signIn, user, loading, error } = useSupabaseAuth();

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.success) {
      // Handle successful login
    }
  };

  // Component logic...
}
```

## 🧩 Components Architecture

### ShadCN UI Integration

The project uses ShadCN UI for consistent, accessible components:

- Pre-built components in `src/components/ui/`
- Customizable with Tailwind CSS
- Full TypeScript support
- Accessibility built-in

### Custom Components

Follow these patterns when creating components:

```typescript
// Component file header (required)
// Filename: ComponentName.tsx
// Role: Brief description of component purpose
// Purpose: Detailed explanation of functionality
// Integration: How/where this component is used

interface ComponentProps {
  // Define props with TypeScript
}

export function ComponentName({ ...props }: ComponentProps) {
  // Component implementation
}
```

## 📊 State Management

### Server State

- **TanStack Query** for API calls and caching
- Automatic background refetching
- Optimistic updates
- Error handling

### Client State

- React's built-in `useState` and `useReducer`
- Context providers for global state
- Custom hooks for state logic

## 🧪 Development Guidelines for Testing

### Code Quality Standards

- Use TypeScript throughout with strict type checking
- Follow React best practices and hooks rules
- Implement proper error boundaries
- Use semantic HTML and accessibility features

### Performance Optimization

- Lazy load components and routes
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper loading states

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Environment Configuration

- **Development**: Local development with hot reload
- **Staging**: Pre-production environment for testing
- **Production**: Live application environment

## 📝 Contributing

### Code Standards

1. Run `npm run prepare` before committing
2. Follow the established file naming conventions
3. Add comprehensive comments to new files
4. Use descriptive component and variable names
5. Maintain consistency with existing code patterns

### Git Workflow

1. Create feature branches from `main`
2. Make small, focused commits
3. Write clear commit messages
4. Test thoroughly before submitting PRs

## 📞 Support

For technical support or questions about the project setup:

1. Check the documentation in the `docs/` directory
2. Review the TypeScript types in `src/types/`
3. Examine existing components for patterns
4. Check the Supabase integration in `src/integrations/supabase/`

## 🎯 Next Steps

After setting up the project:

1. ✅ Environment variables configured
2. ✅ Development server running
3. ✅ Authentication system ready
4. ✅ UI components available
5. 🔄 Start building your application features!

---

**Built with ❤️ using the VIBE stack for optimal developer experience and production performance.**
