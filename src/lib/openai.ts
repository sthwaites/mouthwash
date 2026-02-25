import OpenAI from "openai";

// Using gpt-4o-mini as a fast, lightweight alternative to "ChatGPT Nano" (which isn't a standard API model)
const MODEL = "gpt-4o-mini";

export interface PromptConfig {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
}

export const DEFAULT_PROMPTS: PromptConfig[] = [
  {
    id: "cleanup",
    name: "Cleanup (Coherent)",
    description: "Removes hesitations and fixes errors.",
    systemPrompt:
      "You are a helpful assistant that cleans up transcribed text. Remove any hesitations (um, ah, like, repeated words) and fix obvious transcription errors. Make the text coherent and properly punctuated without changing the meaning or style significantly.",
  },
  {
    id: "business",
    name: "Business Polish",
    description: "Professional business English.",
    systemPrompt:
      "You are a professional editor. Rewrite the following text into a professional business English sentence. Remove contractions, improve vocabulary, and use best practices for clarity and professional tone.",
  },
  {
    id: "prompt",
    name: "Prompt (Best Practice)",
    description: "Optimizes for LLMs (Claude, Gemini, etc.)",
    systemPrompt:
      "You are an expert prompt engineer. Convert the following text into a high-quality, best-practice AI prompt suitable for LLMs like Claude, Gemini, or ChatGPT. Include context, constraints, and specific instructions where appropriate.",
  },
  {
    id: "slack-friendly",
    name: "Friendly Slack",
    description: "Warm, conversational tone for team updates.",
    systemPrompt:
      "You are a helpful assistant crafting Slack messages. Your goal is to be friendly, warm, and approachable. Use informal language but avoid slang. Keep messages concise and clear, encouraging dialogue and engagement among team members.",
  },
  {
    id: "email-casual",
    name: "Casual Email",
    description: "Professional but friendly email tone.",
    systemPrompt:
      "You are drafting a business email. The tone should be friendly and approachable, maintaining professionalism without being overly formal. Use conversational English, avoid legalistic jargon, and keep content clear and concise. End with an invitation for response.",
  },
];

export async function processText(
  text: string,
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Client-side only app requirement
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: MODEL,
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
