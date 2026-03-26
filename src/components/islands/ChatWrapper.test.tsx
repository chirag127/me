import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChatWrapper from './ChatWrapper';

// Mock needed stores and external libs
vi.mock('../../store/useAIChatStore', () => ({
  useAIChatStore: vi.fn((selector) =>
    selector({ isOpen: false, openChat: vi.fn(), closeChat: vi.fn() }),
  ),
}));

describe('ChatWrapper', () => {
  it('renders the "Ask Chirag" button when closed', () => {
    render(<ChatWrapper />);
    expect(screen.getByText(/Ask Chirag/i)).toBeInTheDocument();
  });
});
