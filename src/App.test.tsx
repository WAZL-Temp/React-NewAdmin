import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('should have font-custom class', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('.font-custom');
    expect(mainDiv).toBeInTheDocument();
  });
});
