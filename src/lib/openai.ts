import OpenAI from "openai";

// Define available models
export const AVAILABLE_MODELS = [
  "gpt-5-nano",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-3.5-turbo",
] as const;

export type AIModel = (typeof AVAILABLE_MODELS)[number];

// Default model
export const DEFAULT_MODEL: AIModel = "gpt-5-nano";

export interface PromptConfig {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
}

export const DEFAULT_PROMPTS: PromptConfig[] = [
  {
    id: "cleanup",
    name: "Clean-up",
    description: "Removes hesitations and fixes errors.",
    systemPrompt:
      "You are a transcription editor. Rewrite the provided text to remove hesitations (um, ah, like, you know, repeated words), fix grammar and punctuation, and correct obvious transcription errors. Do not add new ideas, respond to the content, or change the meaning. Output only the cleaned-up text.",
  },
  {
    id: "chat",
    name: "Chat",
    description: "Brief, friendly, emojis & bullets.",
    systemPrompt:
      "You are reformatting a voice transcription into a casual chat message. Rewrite the provided text in a friendly, warm tone using informal language and appropriate emojis. Use bullet points where helpful for brevity. Do not reply to or comment on the content — only rewrite it.",
  },
  {
    id: "email",
    name: "E-mail",
    description: "Friendly, readable, action-oriented.",
    systemPrompt:
      "You are reformatting a voice transcription into a professional but friendly email. Rewrite the provided text into a well-structured email with a natural greeting, clear body, and appropriate sign-off. Keep the tone approachable and action-oriented. Do not reply to the content — only rewrite it.",
  },
  {
    id: "prompt",
    name: "Prompt",
    description: "Optimizes for LLMs (Claude, Gemini, etc.)",
    systemPrompt:
      "You are an expert prompt engineer. Rewrite the provided text into a high-quality AI prompt suitable for LLMs like Claude, Gemini, or ChatGPT. Add context, constraints, and clear instructions where appropriate to make it more effective. Output only the improved prompt — do not explain or comment on it.",
  },
];

export async function processText(
  text: string,
  systemPrompt: string,
  apiKey: string,
  model: string = DEFAULT_MODEL,
  rearrange: boolean = false
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Client-side only app requirement
  });

  let finalSystemPrompt = systemPrompt;
  if (rearrange) {
    finalSystemPrompt += " Additionally, identify long passages that contain multiple points and subclauses. Rearrange the content to enhance its impact while ensuring that the original tone and substance remain unchanged.";
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: text },
      ],
      model: model,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          throw new Error("Invalid API Key. Please check your settings.");
        case 429:
          throw new Error("Rate limit exceeded or insufficient quota. Please check your OpenAI plan.");
        case 500:
        case 503:
          throw new Error("OpenAI service is currently unavailable. Please try again later.");
        default:
          throw new Error(`OpenAI Error: ${error.message}`);
      }
    }

    throw error;
  }
}

export async function transcribeAudio(
  audioFile: File,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("OpenAI Audio Error:", error);
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI Audio Error: ${error.message}`);
    }
    throw error;
  }
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export async function validateConfiguration(
  apiKey: string,
  model: string
): Promise<ValidationResult> {
  if (!apiKey) {
    return { isValid: false, message: "API Key is missing." };
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    // Attempt a minimal completion to verify both Key validity AND Model access
    await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 1,
    });

    return { isValid: true };
  } catch (error) {
    console.error("Validation Error:", error);

    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          return { isValid: false, message: "Invalid API Key." };
        case 404:
          return {
            isValid: false,
            message: `Model '${model}' not accessible with this key.`,
          };
        case 429:
          return {
            isValid: false,
            message: "Rate limit exceeded or insufficient quota.",
          };
        default:
          return { isValid: false, message: error.message };
      }
    }

    return {
      isValid: false,
      message: error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}
