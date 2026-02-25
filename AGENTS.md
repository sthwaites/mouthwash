# AI Agent Operational Guide: Voice Cleanup

This document outlines the operational protocols, coding standards, and architectural patterns for AI agents working within the `voice-cleanup` repository.

## 1. Project Architecture & Tech Stack

- **Framework**: React 19 + Vite (TypeScript)
- **Styling**: Tailwind CSS (v4)
- **State Management**: React `useState` + Custom Hooks (`useLocalStorage`)
- **API Integration**: OpenAI SDK (client-side implementation)
- **Containerization**: Docker (Multi-stage: Node.js build -> Nginx serve)
- **Package Manager**: npm

### Directory Structure
- `src/components/`: Reusable UI components. PascalCase filenames.
- `src/hooks/`: Custom React hooks. camelCase filenames (e.g., `useLocalStorage.ts`).
- `src/lib/`: Utility functions and API configurations (e.g., `openai.ts`).
- `src/assets/`: Static assets (images, icons).

## 2. Operational Commands

### Build & Development
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Start Development Server**:
  ```bash
  npm run dev
  ```
  *Note: Runs on port 5173 by default.*

- **Production Build**:
  ```bash
  npm run build
  ```
  *Output Directory: `dist/`*

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

### Linting & Code Quality
- **Run Linter**:
  ```bash
  npm run lint
  ```
  *Uses ESLint with TypeScript and React hooks plugins.*

### Testing
- **Framework**: Vitest + React Testing Library.
- **Run Tests**:
  ```bash
  npm test
  ```
- **Pattern**: Write tests ahead of implementation (TDD) where feasible, or at least concurrently. Ensure new features are covered by tests.
- **Smoke Tests**: Maintain basic smoke tests (e.g., App renders) to ensure the build is safe.

### Docker Operations
- **Build & Run**:
  ```bash
  docker-compose up -d --build
  ```
  *App accessible at `http://localhost:8080`*

## 3. Code Style & Standards

### file Naming
- **Components**: `PascalCase.tsx` (e.g., `ApiKeyInput.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `useLocalStorage.ts`)
- **Utilities**: `camelCase.ts` (e.g., `openai.ts`)
- **Constants**: `UPPER_SNAKE_CASE` for global constants.

### TypeScript & Typing
- **Strict Mode**: Enabled. No `any` types unless absolutely necessary (and commented).
- **Interfaces**: Prefer `interface` over `type` for object definitions.
- **Props**: Define component props explicitly via interfaces.
  ```typescript
  interface MyComponentProps {
    isActive: boolean;
    onToggle: (value: boolean) => void;
  }
  ```
- **Exports**: Use **Named Exports** for components and hooks to ensure consistent import naming.
  ```typescript
  export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => { ... };
  ```

### React Patterns
- **Functional Components**: Use `React.FC<Props>` typing.
- **Hooks**: Isolate complex logic into custom hooks in `src/hooks/`.
- **Effects**:
  - Always include dependency arrays.
  - Clean up side effects (event listeners, timers) in the return function.
- **imports**:
  - Group imports: External (React, libs) -> Internal (Components, Hooks, Utils) -> Styles/Assets.
  - Use relative paths (e.g., `../../components/Button`) as no path aliases are currently configured in `tsconfig.json`.

### Tailwind CSS
- **Utility First**: Use utility classes directly in JSX.
- **Ordering**: Follow logical ordering (Layout -> Box Model -> Typography -> Visuals -> Misc).
- **Dark Mode**: Support dark mode via standard Tailwind classes (project defaults to a dark theme).

### Error Handling
- **API Calls**: Wrap async operations in `try/catch` blocks.
- **UI Feedback**: Always provide visual feedback for loading states and errors (e.g., `isLoading` flags, error messages).
- **Logging**: Use `console.error` for caught exceptions.

## 4. Documentation
- **Comments**:
  - Use JSDoc for complex utility functions.
  - Comment *why* complex logic exists, not *what* it does.
- **Changes**: Update `CHANGELOG.md` for any notable feature additions or bug fixes using Keep a Changelog format.
- **README Updates**: Always revisit `README.md` after implementing significant architectural changes, new features, or setup instructions to ensure documentation remains accurate and up-to-date.

## 5. Security Protocols
- **API Keys**: NEVER commit API keys.
- **Storage**: API keys are stored in `localStorage` only.
- **Git**: Ensure `.env` and `dist/` are in `.gitignore`.
