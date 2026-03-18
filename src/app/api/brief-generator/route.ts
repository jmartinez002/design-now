import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || 'mock_key';
const ai = new GoogleGenAI({ apiKey });

export async function GET() {
  try {
    if (apiKey === 'mock_key') {
      return NextResponse.json({ brief: "This is a mocked generated brief because GEMINI_API_KEY is not defined in .env.local." });
    }

    const prompt = `Generate a realistic small business client brief for a designer. Include:
• Brand name
• Industry
• Owner name and personality
• Background story
• What they need designed
• Target audience
• Creative direction
• Constraints

Keep tone realistic, not generic. Pick a random category from: Coffee shops, Sauces / food brands, Mezcal / beverage brands, Churches / nonprofits, Startups, Local businesses.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return NextResponse.json({ brief: response.text });
  } catch (error: any) {
    console.error('Gemini Error:', error);
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}
