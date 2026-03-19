import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Allow this function to run up to 60 seconds since it might be emailing a lot of people!
export const maxDuration = 60;

const geminiApiKey = process.env.GEMINI_API_KEY || 'mock_key';
const supabaseUrl = process.env.SUPABASE_URL || 'mock_url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock_key';
const resendApiKey = process.env.RESEND_API_KEY || 'mock_key';
const cronSecret = process.env.CRON_SECRET || 'secret123'; // Define this in your .env.local

const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // 1. SECURITY CHECK
    // Only allow this script to run if the secret code is passed in the URL
    if (secret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized. Wrong secret passed.' }, { status: 401 });
    }

    if (geminiApiKey === 'mock_key' || supabaseUrl === 'mock_url' || resendApiKey === 'mock_key') {
      return NextResponse.json({ error: 'Missing API keys in Environment.' }, { status: 500 });
    }

    // 2. GENERATE THE WEEKLY BRIEF USING GEMINI
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

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const briefText = aiResponse.text || "Weekly Brief Generation Failed.";

    // 3. FETCH ALL USERS FROM SUPABASE
    const { data: designers, error: dbError } = await supabase
      .from('designers')
      .select('email, first_name');

    if (dbError) throw dbError;

    if (!designers || designers.length === 0) {
      return NextResponse.json({ message: 'Success, but no designers found in the database.' });
    }

    // 4. BLAST EMAILS USING RESEND
    // Format Gemini's plain text output into simple HTML paragraphs
    const formattedHtml = `<div style="font-family: sans-serif; white-space: pre-wrap; line-height: 1.5; color: #111;">${briefText}</div>`;

    // Loop through everyone and send individual emails simultaneously
    const emailPromises = designers.map((designer) => {
      // Create a nice HTML wrapper
      const htmlBody = `
        <p>Hi ${designer.first_name},</p>
        <p>Your new weekly brief has arrived. Good luck.</p>
        <hr style="border: 1px solid #eee; margin: 24px 0;" />
        ${formattedHtml}
      `;

      return resend.emails.send({
        from: 'Abierto Briefs <hello@abiertostudio.com>',
        to: designer.email,
        subject: 'Your Sunday Design Brief is Here 🎯',
        html: htmlBody,
      });
    });

    // Wait for all emails to finish sending
    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      sentCount: designers.length,
      briefPreview: briefText.substring(0, 150) + "..."
    });

  } catch (error: any) {
    console.error('Weekly Blast Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
