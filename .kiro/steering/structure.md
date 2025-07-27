# Project Structure & Organization

## Directory Structure

```
nkh-community-site/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── subscribe/            # Newsletter subscription
│   │   └── test-kit/             # Testing endpoints
│   ├── cart/                     # Shopping cart page
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Authentication pages
│   ├── onboarding/               # Spiritual onboarding flow
│   ├── profile/                  # User profile management
│   ├── signup/                   # User registration
│   ├── globals.css               # Global styles and cosmic theme
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage with content sections
│   ├── loading.tsx               # Global loading component
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx             # 404 page
├── components/                   # Reusable React components
│   ├── onboarding/               # Specialized onboarding components
│   │   ├── AyurvedicOnboarding.tsx
│   │   └── JyotishOnboarding.tsx
│   ├── social/                   # Social media components (planned)
│   ├── CosmicBackground.tsx      # Three.js cosmic background
│   ├── Header.tsx                # Navigation sidebar
│   ├── HeroSection.tsx           # Landing hero section
│   ├── ContentSection.tsx        # 3D flip cards
│   ├── NewsletterSection.tsx     # Email subscription
│   ├── Footer.tsx                # Site footer
│   └── LoadingScreen.tsx         # Cosmic loading animation
├── lib/                          # Business logic and utilities
│   ├── models/                   # Data models and schemas
│   ├── services/                 # API services and external integrations
│   ├── store/                    # Redux store configuration
│   ├── types/                    # TypeScript type definitions
│   └── index.ts                  # Library exports
├── public/                       # Static assets
│   └── images/                   # Image assets for content sections
└── .kiro/                        # Kiro AI configuration
    └── steering/                 # AI guidance documents
```

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `CosmicBackground.tsx`)
- **Pages**: lowercase with hyphens (e.g., `not-found.tsx`)
- **Directories**: lowercase, descriptive names
- **API Routes**: RESTful naming in `app/api/`

### Code Conventions
- **Interfaces**: PascalCase with descriptive names
- **Functions**: camelCase, descriptive and action-oriented
- **Constants**: UPPER_SNAKE_CASE for global constants
- **CSS Classes**: Tailwind utility classes + custom cosmic classes

## Component Organization

### Layout Components
- `Header.tsx` - Glassmorphism sidebar navigation
- `Footer.tsx` - Site footer with social links
- `CosmicBackground.tsx` - Three.js animated background

### Page Components
- `HeroSection.tsx` - Landing page hero with 3D text
- `ContentSection.tsx` - Interactive 3D flip cards
- `NewsletterSection.tsx` - Email subscription form
- `LoadingScreen.tsx` - 7-phase cosmic loading animation

### Specialized Components
- `onboarding/` - Jyotish and Ayurvedic assessment flows
- `social/` - Community and social features (planned)

## State Management Structure

### Global State (Redux)
- User authentication state
- Onboarding progress tracking
- Cart and shopping state
- Community features state (planned)

### Local State (React Hooks)
- Component-specific UI state
- Form state with React Hook Form
- 3D animation states

## API Structure

### Current Endpoints
- `/api/subscribe` - Newsletter subscription
- `/api/test-kit` - Development testing utilities

### Planned Endpoints
- `/api/auth` - Authentication and user management
- `/api/onboarding` - Spiritual assessment data
- `/api/community` - Social features and interactions
- `/api/services` - Healing services and bookings

## Asset Organization

### Images
- Content section images in `/public/images/`
- Optimized for web delivery
- Descriptive filenames (e.g., `hero_spiritual_transformation.jpg`)

### Fonts
- Google Fonts: Cinzel (serif) for headings, Inter (sans-serif) for body
- Font Awesome icons for UI elements

## Development Patterns

### Page Structure
1. Client-side components marked with `'use client'`
2. Proper TypeScript interfaces for all props
3. Consistent error handling and loading states
4. Responsive design with mobile-first approach

### Component Patterns
1. Single responsibility principle
2. Proper prop drilling vs context usage
3. Performance optimization for 3D components
4. Accessibility considerations (ARIA labels, keyboard navigation)

### Styling Patterns
1. Tailwind utility classes for rapid development
2. Custom cosmic color palette and animations
3. Glassmorphism effects for spiritual aesthetic
4. Responsive breakpoints and adaptive design