import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormFieldError from './FormFieldError';

describe('FormFieldError Component', () => {
  it('should render error message when field has error', () => {
    const errors = { username: 'Username is required' };
    render(<FormFieldError field="username" errors={errors} />);
    
    const errorMessage = screen.getByText('Username is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should not render when field has no error', () => {
    const errors = { email: 'Email is required' };
    const { container } = render(<FormFieldError field="username" errors={errors} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when errors object is empty', () => {
    const errors = {};
    const { container } = render(<FormFieldError field="username" errors={errors} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have correct styling classes for error text', () => {
    const errors = { password: 'Password is too short' };
    render(<FormFieldError field="password" errors={errors} />);
    
    const errorMessage = screen.getByText('Password is too short');
    expect(errorMessage).toHaveClass('text-xs', 'py-2', 'pl-2');
  });
});
