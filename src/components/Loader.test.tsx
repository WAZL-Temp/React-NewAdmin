import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  it('should render loader component', () => {
    const { container } = render(<Loader />);
    
    // Check if the loader container is present
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<Loader />);
    
    // Check for main container classes
    const loaderDiv = container.firstChild;
    expect(loaderDiv).toHaveClass('absolute', 'inset-0', 'z-20', 'flex', 'items-center', 'justify-center');
  });

  it('should render spinning animation elements', () => {
    const { container } = render(<Loader />);
    
    // Check that there are animated elements
    const animatedElements = container.querySelectorAll('.animate-spin, .animate-ping');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});
