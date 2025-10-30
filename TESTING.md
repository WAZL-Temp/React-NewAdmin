# Testing Guide for React Admin Project

This document provides comprehensive instructions on how to write and run tests for this React project.

## Table of Contents
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Testing Stack

This project uses the following testing tools:

- **Vitest**: Fast unit test framework for Vite projects
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom matchers for asserting on DOM nodes
- **jsdom**: JavaScript implementation of web standards for Node.js

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests once (no watch mode)
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Writing Tests

### Test File Naming Convention

Test files should be placed next to the component they test and follow this naming pattern:
- `ComponentName.test.tsx` for component tests
- `utilityName.test.ts` for utility function tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Test Structure

### Component Tests

Component tests should verify:
1. **Rendering**: Component renders without errors
2. **Content**: Expected content is displayed
3. **Styling**: CSS classes are applied correctly
4. **Props**: Component responds to different props
5. **User Interactions**: Component responds to user actions (clicks, input, etc.)

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Utility Function Tests

Test utility functions by:
1. Testing expected outputs for various inputs
2. Testing edge cases
3. Testing error handling

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './dateUtils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('January 1, 2024');
  });

  it('should handle invalid dates', () => {
    expect(() => formatDate(null)).toThrow();
  });
});
```

## Best Practices

### 1. Use Testing Library Queries Properly

Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Input elements
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

### 2. Test User Behavior, Not Implementation

❌ Bad:
```typescript
expect(component.state.isOpen).toBe(true);
```

✅ Good:
```typescript
expect(screen.getByText('Modal Content')).toBeVisible();
```

### 3. Keep Tests Simple and Focused

Each test should verify one behavior:

❌ Bad:
```typescript
it('should handle everything', () => {
  // Testing multiple unrelated things
});
```

✅ Good:
```typescript
it('should display error message when form is invalid', () => {
  // Single, clear test
});

it('should submit form when all fields are valid', () => {
  // Another focused test
});
```

### 4. Use Descriptive Test Names

Test names should clearly describe what is being tested:

```typescript
it('should display loading spinner when data is fetching')
it('should show error message when API call fails')
it('should disable submit button when form is invalid')
```

### 5. Clean Up After Tests

The testing setup automatically cleans up after each test using:
```typescript
afterEach(() => {
  cleanup();
});
```

### 6. Mock External Dependencies

Use Vitest's mocking capabilities for:
- API calls
- Browser APIs (localStorage, etc.)
- Third-party libraries

Example:
```typescript
import { vi } from 'vitest';

vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'John' }))
}));
```

## Examples

### Testing a Component with Props

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Alert from './Alert';

describe('Alert Component', () => {
  it('should render success alert', () => {
    render(<Alert type="success" message="Success!" />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('should render error alert', () => {
    render(<Alert type="error" message="Error occurred" />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  it('should increment counter when button is clicked', async () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });
    
    await userEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  it('should show loading state', () => {
    render(<UserProfile isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show user data when loaded', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile isLoading={false} user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  it('should submit form with user credentials', async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

If you encounter issues with tests:
1. Check that all dependencies are installed: `npm install`
2. Ensure tests follow the patterns in this guide
3. Check test output for specific error messages
4. Review existing test files for examples
