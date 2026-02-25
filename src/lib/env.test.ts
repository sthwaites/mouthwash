import { describe, it, expect, vi, afterEach } from 'vitest';
import { getEnvApiKey, isEnvKeyPresent } from './env';

describe('Environment Utils', () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  it('should return undefined when no key is present', () => {
    // Ensure window.env is undefined
    if (typeof global.window !== 'undefined') {
        // @ts-ignore
        global.window.env = undefined;
    }
    // We can't easily modify import.meta.env in a running test without mocking the module, 
    // but assuming defaults are empty in test env.
    
    expect(getEnvApiKey()).toBeUndefined();
    expect(isEnvKeyPresent()).toBe(false);
  });

  it('should prioritize window.env.OPENAI_API_KEY (Runtime)', () => {
    // Setup Runtime key
    // @ts-ignore
    global.window = {
      env: {
        OPENAI_API_KEY: 'runtime-key'
      }
    };

    expect(getEnvApiKey()).toBe('runtime-key');
    expect(isEnvKeyPresent()).toBe(true);
  });
});
