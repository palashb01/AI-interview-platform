import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});