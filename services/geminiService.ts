
import { GoogleGenAI } from "@google/genai";
import { Platform } from '../types';
import { Tone } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContent = async (
  coreMessage: string,
  platform: Platform,
  tone: Tone
): Promise<string> => {
  const prompt = `
    You are an expert content creator and social media manager. Your task is to generate a "${platform}" post with a "${tone}" tone.

    A critical and mandatory rule is that you MUST include the following "Core Message" verbatim (exactly as written, word-for-word) somewhere in your response:
    "${coreMessage}"

    Now, please generate the complete and ready-to-publish content for the ${platform}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Sorry, I encountered an error while generating the content. Please try again.";
  }
};
