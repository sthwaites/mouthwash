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
      "You are a helpful assistant that cleans up transcribed text. Remove any hesitations (um, ah, like, repeated words) and fix obvious transcription errors. Make the text coherent and properly punctuated without changing the meaning or style significantly.",
  },
  {
    id: "chat",
    name: "Chat",
    description: "Brief, friendly, emojis & bullets.",
    systemPrompt:
      "You are a helpful assistant crafting chat messages. Your goal is to be friendly, warm, and approachable. Use informal language, appropriate emojis, and bullet points for brevity. Keep messages concise and clear.",
  },
  {
    id: "email",
    name: "E-mail",
    description: "Friendly, readable, action-oriented.",
    systemPrompt:
      "You are drafting a professional but friendly email. The tone should be approachable, very readable, and focused on getting things done. Avoid overly formal language.",
  },
  {
    id: "prompt",
    name: "Prompt",
    description: "Optimizes for LLMs (Claude, Gemini, etc.)",
    systemPrompt:
      "You are an expert prompt engineer. Convert the following text into a high-quality, best-practice AI prompt suitable for LLMs like Claude, Gemini, or ChatGPT. Include context, constraints, and specific instructions where appropriate.",
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
