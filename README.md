# React Admin - TypeScript + Vite

This is a React admin dashboard application built with TypeScript, Vite, and modern development tools.

## Features

- ⚡️ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React features
- 🔷 **TypeScript** - Type safety
- 🎨 **TailwindCSS** - Utility-first styling
- 🧪 **Vitest** - Unit testing framework
- 🔍 **ESLint** - Code linting
- 🌐 **i18next** - Internationalization
- 🔥 **Firebase** - Backend services
- 📊 **React Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Testing

This project uses Vitest and React Testing Library for testing.

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

For detailed testing instructions, see [TESTING.md](./TESTING.md).

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── store/           # State management (Zustand)
├── core/            # Core utilities and configurations
├── sharedBase/      # Shared utilities and services
├── types/           # TypeScript type definitions
├── schema/          # Validation schemas
└── test/            # Test setup and utilities
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **PrimeReact** - UI component library
- **React Router** - Routing
- **Zustand** - State management
- **React Query** - Server state management
- **Zod** - Schema validation
- **i18next** - Internationalization
- **Firebase** - Authentication and database
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Available Plugins

Currently, two official Vite plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
