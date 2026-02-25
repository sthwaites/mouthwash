import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processText, validateConfiguration, transcribeAudio, DEFAULT_MODEL } from './openai';
import OpenAI from 'openai';

// Create mock functions
const mockCreate = vi.fn();
const mockAudioCreate = vi.fn();

// Mock OpenAI library
vi.mock('openai', () => {
  class APIError extends Error {
    status: number | undefined;
    constructor(status: number | undefined, error: any, message: string, headers: any) {
      super(message);
      this.status = status;
    }
  }

  return {
    default: class MockOpenAI {
      apiKey: string;
      dangerouslyAllowBrowser: boolean;

      constructor(config: { apiKey: string; dangerouslyAllowBrowser: boolean }) {
        this.apiKey = config.apiKey;
        this.dangerouslyAllowBrowser = config.dangerouslyAllowBrowser;
      }

      chat = {
        completions: {
          create: mockCreate,
        },
      };
      audio = {
        transcriptions: {
          create: mockAudioCreate,
        },
      };

      static APIError = APIError;
    },
    APIError: APIError,
  };
});

describe('OpenAI Library', () => {
  const apiKey = 'test-api-key';
  const systemPrompt = 'Test System Prompt';
  const userText = 'Test User Text';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processText', () => {
    it('should call OpenAI create completion with correct parameters', async () => {
      // Setup mock response
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Processed Text',
            },
          },
        ],
      });

      const result = await processText(userText, systemPrompt, apiKey);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText },
          ],
          model: DEFAULT_MODEL,
        })
      );
      expect(result).toBe('Processed Text');
    });

    it('should handle rearrange logic', async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Rearranged Text',
            },
          },
        ],
      });

      await processText(userText, systemPrompt, apiKey, DEFAULT_MODEL, true);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('Rearrange the content'),
            }),
            { role: 'user', content: userText },
          ],
        })
      );
    });

    it('should throw error if API key is missing', async () => {
      await expect(processText(userText, systemPrompt, '')).rejects.toThrow('API Key is required');
    });

    it('should handle OpenAI API errors in processText', async () => {
        const error401 = new OpenAI.APIError(401, {}, 'Invalid API Key', {} as any);
        mockCreate.mockRejectedValue(error401);
        await expect(processText(userText, systemPrompt, apiKey)).rejects.toThrow('Invalid API Key. Please check your settings.');

        const error429 = new OpenAI.APIError(429, {}, 'Rate limit', {} as any);
        mockCreate.mockRejectedValue(error429);
        await expect(processText(userText, systemPrompt, apiKey)).rejects.toThrow('Rate limit exceeded or insufficient quota.');

        const error500 = new OpenAI.APIError(500, {}, 'Server Error', {} as any);
        mockCreate.mockRejectedValue(error500);
        await expect(processText(userText, systemPrompt, apiKey)).rejects.toThrow('OpenAI service is currently unavailable.');
    });
  });

  describe('validateConfiguration', () => {
    it('should return valid result for successful completion', async () => {
      mockCreate.mockResolvedValue({}); // Simulate success

      const result = await validateConfiguration(apiKey, DEFAULT_MODEL);

      expect(result.isValid).toBe(true);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        })
      );
    });

    it('should return invalid result when OpenAI throws generic error', async () => {
      // Mock an error
      const mockError = new Error('Generic Error');
      mockCreate.mockRejectedValue(mockError);

      const result = await validateConfiguration(apiKey, DEFAULT_MODEL);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Generic Error');
    });

    it('should handle specific OpenAI API errors in validation', async () => {
      const error401 = new OpenAI.APIError(401, {}, 'Invalid API Key', {} as any);
      mockCreate.mockRejectedValue(error401);
      const result401 = await validateConfiguration(apiKey, DEFAULT_MODEL);
      expect(result401.isValid).toBe(false);
      expect(result401.message).toBe('Invalid API Key.');

      const error404 = new OpenAI.APIError(404, {}, 'Model not found', {} as any);
      mockCreate.mockRejectedValue(error404);
      const result404 = await validateConfiguration(apiKey, DEFAULT_MODEL);
      expect(result404.isValid).toBe(false);
      expect(result404.message).toContain(`Model '${DEFAULT_MODEL}' not accessible`);

      const error429 = new OpenAI.APIError(429, {}, 'Rate limit', {} as any);
      mockCreate.mockRejectedValue(error429);
      const result429 = await validateConfiguration(apiKey, DEFAULT_MODEL);
      expect(result429.isValid).toBe(false);
      expect(result429.message).toBe('Rate limit exceeded or insufficient quota.');
    });
  });

  describe('transcribeAudio', () => {
    const mockFile = new File([''], 'audio.webm', { type: 'audio/webm' });

    it('should call OpenAI transcribe with correct parameters', async () => {
      mockAudioCreate.mockResolvedValue({ text: 'Transcribed text' });

      const result = await transcribeAudio(mockFile, apiKey);

      expect(mockAudioCreate).toHaveBeenCalledWith(expect.objectContaining({
        file: mockFile,
        model: 'whisper-1',
      }));
      expect(result).toBe('Transcribed text');
    });

    it('should throw error if API key is missing', async () => {
      await expect(transcribeAudio(mockFile, '')).rejects.toThrow('API Key is required');
    });

    it('should handle OpenAI errors during transcription', async () => {
      const error = new OpenAI.APIError(500, {}, 'Server Error', {} as any);
      mockAudioCreate.mockRejectedValue(error);

      await expect(transcribeAudio(mockFile, apiKey)).rejects.toThrow('OpenAI Audio Error: Server Error');
    });
  });
});


