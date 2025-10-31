import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <div data-testid="mock-connect-button" />,
}));

describe('<Header />', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('renders the brand name', () => {
    expect(screen.getByText(/IdentityChain/i)).toBeInTheDocument();
  });

  it('renders the navigation links', () => {
    expect(screen.getByText(/verify identity/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/About FHE/i)).toBeInTheDocument();
  });

  it('includes the mocked Connect button', () => {
    expect(screen.getByTestId('mock-connect-button')).toBeInTheDocument();
  });
});
