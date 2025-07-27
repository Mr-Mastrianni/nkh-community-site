# Technology Stack & Development Guidelines

## Core Technologies

### Frontend Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** with modern hooks and patterns

### Styling & Design
- **Tailwind CSS** with custom cosmic theme configuration
- **Styled Components** for complex 3D animations
- **Custom CSS** for glassmorphism effects and cosmic animations

### 3D Graphics & Animation
- **Three.js** for WebGL cosmic backgrounds and 3D effects
- **GSAP** with ScrollTrigger for smooth animations and parallax
- **Framer Motion** for React component animations

### State Management
- **Redux Toolkit** for global state
- **React Context API** for component-level state
- **React Hook Form** for form state management

### Additional Libraries
- **Socket.io Client** for real-time features (planned)
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Date-fns** for date manipulation
- **UUID** for unique identifiers

## Build System & Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Configuration Files
- `next.config.js` - Next.js configuration with styled-components compiler
- `tailwind.config.js` - Custom cosmic color palette and animations
- `tsconfig.json` - TypeScript configuration with path aliases
- `.eslintrc.js` - ESLint rules with TypeScript support

## Code Style Guidelines

### ESLint Rules
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Unused variables as warnings
- React in JSX scope not required (Next.js handles this)

### TypeScript Standards
- Strict mode enabled
- Proper type definitions for all props and functions
- Use of interfaces over types where appropriate
- Path aliases configured (`@/*` for root imports)

### Component Patterns
- Functional components with hooks
- Client components marked with `'use client'` directive
- Proper prop typing with TypeScript interfaces
- Consistent file naming (PascalCase for components)

## Performance Considerations

### 3D Graphics Optimization
- Adaptive particle counts based on device capabilities
- Hardware acceleration detection and fallbacks
- Proper disposal of Three.js geometries and materials
- Frame rate optimization (60fps desktop, 30fps+ mobile)

### Next.js Optimizations
- Image optimization enabled
- SWC minification
- React Strict Mode
- Proper static/dynamic imports

## Architecture Patterns

### File Organization
- App Router structure in `/app` directory
- Reusable components in `/components`
- Business logic in `/lib` with organized subdirectories
- Type definitions centralized in `/lib/types`
- Services and API calls in `/lib/services`

### Component Structure
- Single responsibility principle
- Proper separation of concerns
- Consistent prop interfaces
- Error boundaries for 3D components