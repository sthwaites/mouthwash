import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    const title = screen.getByText(/Mouthwash/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the input textarea', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Paste your transcribed text here/i);
    expect(input).toBeInTheDocument();
  });

  it('renders the audio recorder button', () => {
    render(<App />);
    const recorderButton = screen.getByTitle(/Start Recording/i);
    expect(recorderButton).toBeInTheDocument();
  });
});

