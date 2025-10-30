# Testing Quick Start Guide

This is a quick reference for running tests in this React project.

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode (tests will re-run on file changes)
npm test

# Run all tests once (useful for CI/CD)
npm run test:run

# Run tests with a UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Writing Your First Test

### 1. Create a test file next to your component

If you have a component at `src/components/MyComponent.tsx`, create a test file at `src/components/MyComponent.test.tsx`

### 2. Write a basic test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    
    // Check that your component renders expected content
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 3. Run your test

```bash
npm test
```

## Common Testing Patterns

### Testing a button click

```typescript
import userEvent from '@testing-library/user-event';

it('should call onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await userEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Testing form input

```typescript
it('should update input value', async () => {
  render(<Input />);
  const input = screen.getByRole('textbox');
  
  await userEvent.type(input, 'Hello World');
  expect(input).toHaveValue('Hello World');
});
```

### Testing conditional rendering

```typescript
it('should show loading state', () => {
  render(<Component isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should show content when loaded', () => {
  render(<Component isLoading={false} />);
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

## Example Tests in This Project

Check out these example tests to learn more:

1. **Component Tests**:
   - `src/App.test.tsx` - Simple component test
   - `src/components/Loader.test.tsx` - Testing styling and rendering
   - `src/components/FormFieldError.test.tsx` - Testing conditional rendering

2. **Utility Function Tests**:
   - `src/test/examples/utility.example.test.ts` - Testing pure functions

3. **Async & Mocking Tests**:
   - `src/test/examples/async.example.test.ts` - Testing async code and mocking

## Need More Help?

- Read the comprehensive [TESTING.md](../TESTING.md) guide
- Check [Vitest Documentation](https://vitest.dev/)
- Check [React Testing Library Documentation](https://testing-library.com/react)

## Tips

- ✅ Test user behavior, not implementation details
- ✅ Write descriptive test names
- ✅ Keep tests simple and focused
- ✅ Run tests frequently while developing
- ❌ Don't test third-party libraries
- ❌ Don't test implementation details (like state or internal methods)
