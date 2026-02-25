import { describe, it, expect, vi, afterEach } from 'vitest';
import { getEnvApiKey, isEnvKeyPresent } from './env';

describe('Environment Utils', () => {
  // Save the original env property descriptor if it exists
  const originalEnvDescriptor = Object.getOwnPropertyDescriptor(window, 'env');

  afterEach(() => {
    // Restore original env
    if (originalEnvDescriptor) {
      Object.defineProperty(window, 'env', originalEnvDescriptor);
    } else {
      // If it didn't exist, delete it
      try {
        delete window.env;
      } catch {
        // In some environments, delete might fail if property is not configurable
        // but here we just try to clean up
      }
    }
    vi.restoreAllMocks();
  });

  it('should return undefined when no key is present', () => {
    // Ensure window.env is undefined
    if (window.env) {
      delete window.env;
    }
    
    expect(getEnvApiKey()).toBeUndefined();
    expect(isEnvKeyPresent()).toBe(false);
  });

  it('should prioritize window.env.OPENAI_API_KEY (Runtime)', () => {
    // Setup Runtime key
    Object.defineProperty(window, 'env', {
      value: {
        OPENAI_API_KEY: 'runtime-key',
      },
      writable: true,
      configurable: true,
    });

    expect(getEnvApiKey()).toBe('runtime-key');
    expect(isEnvKeyPresent()).toBe(true);
  });
});
