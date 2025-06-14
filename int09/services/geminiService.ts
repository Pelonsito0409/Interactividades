
import { GoogleGenAI, GenerateContentResponse, GenerateContentStreamResult } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || (process.env.NODE_ENV === 'development' ? process.env.API_KEY : undefined);

class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    } else {
      console.warn("Gemini API Key not found. Gemini features will be disabled.");
    }
  }

  public isAvailable(): boolean {
    return this.ai !== null;
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error("Gemini API not initialized. API Key might be missing.");
    }
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      return response.text;
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      throw error;
    }
  }

  async generateTextStream(prompt: string): Promise<GenerateContentStreamResult> {
    if (!this.ai) {
      throw new Error("Gemini API not initialized. API Key might be missing.");
    }
    try {
      return this.ai.models.generateContentStream({
        model: GEMINI_TEXT_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    } catch (error) {
      console.error("Error generating text stream with Gemini:", error);
      throw error;
    }
  }

  // Add other methods like generateImages, chat, etc. as needed following the guidelines
}

export const geminiService = new GeminiService();
