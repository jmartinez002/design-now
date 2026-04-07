import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Allow this function to run up to 60 seconds since it might be emailing a lot of people!
export const maxDuration = 60;

const geminiApiKey = process.env.GEMINI_API_KEY || 'mock_key';
const supabaseUrl = process.env.SUPABASE_URL || 'mock_url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock_key';
const resendApiKey = process.env.RESEND_API_KEY || 'mock_key';
const cronSecret = process.env.CRON_SECRET || 'secret123'; // Define this in your .env.local

const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const testEmail = searchParams.get('testEmail'); // Allows safe testing

    // 1. SECURITY CHECK
    // Only allow this script to run if the secret code is passed in the URL
    if (secret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized. Wrong secret passed.' }, { status: 401 });
    }

    if (geminiApiKey === 'mock_key' || supabaseUrl === 'mock_url' || resendApiKey === 'mock_key') {
      return NextResponse.json({ error: 'Missing API keys in Environment.' }, { status: 500 });
    }

    // 2. GENERATE THE WEEKLY BRIEF USING GEMINI
    const prompt = `Generate a realistic email from a small business owner to a designer they want to hire.

Return the response as a JSON object with two fields:
1. "brandName": The name of the small business/client.
2. "emailBody": The actual email content.

The emailBody must follow these strict rules:
- It should read exactly like a real email from a client to a designer.
- Tone: realistic, natural, professional but approachable. NOT generic.
- Format with short paragraphs. 
- The generated brand name MUST be short (mainly 1-2 words).
- Do NOT include any greeting (like "Hi Name" or "Hello") at the beginning. It will be added automatically. Start immediately with the first paragraph.
- Order of information:
  1. The owner introducing themselves directly into the first paragraph.
  2. Them asking what they are looking for (their design needs).
  3. Their industry and business details.
  4. Additional information like their target audience, background, and owner personality.
- YOU MUST include this exact sentence near the end: "If you're interested in potentially collaborating, please submit your approach using this link: https://abiertostudio.com/submit"
- The email must be signed off by the business owner directly (e.g. "Best, [Owner Name]").
- Do NOT use markdown formatting, bolding, or asterisks (*). Just plain text.
- Do NOT mention anything about "generation", "prompt", AI, or that this is a brief. 

Pick a random category from: Coffee shops, Sauces / food brands, Mezcal / beverage brands, Churches / nonprofits, Startups, Local businesses.`;

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      return NextResponse.json({ error: "Failed to generate brief with Gemini (" + (error.message || "fetch failed") + ")" }, { status: 500 });
    }

    const aiText = aiResponse.text || "{}";
    let brandName = "A Local Business";
    let emailBody = "Hi, we are looking for a designer. Please let us know if you can help.";
    try {
      const parsed = JSON.parse(aiText);
      if (parsed.brandName) brandName = parsed.brandName;
      if (parsed.emailBody) emailBody = parsed.emailBody;
    } catch (e) {
      console.error("Failed to parse Gemini JSON", e);
      emailBody = aiText;
    }

    let designersToEmail = [];

    if (testEmail) {
      // 3A. TEST MODE: Only send to the provided test email
      designersToEmail = [{ email: testEmail, first_name: 'TestDesigner', studio_name: 'Test Studio' }];
    } else {
      // 3B. LIVE MODE: FETCH ALL USERS FROM SUPABASE
      let designers;
      try {
        const { data, error: dbError } = await supabase
          .from('designers')
          .select('email, first_name, studio_name');

        if (dbError) throw dbError;
        designers = data;
      } catch (error: any) {
        console.error("Supabase Database Error:", error);
        return NextResponse.json({ error: "Failed to connect to Supabase. Check if your project is paused or URL is correct in .env.local (" + (error.message || "fetch failed") + ")" }, { status: 500 });
      }

      if (!designers || designers.length === 0) {
        return NextResponse.json({ message: 'Success, but no designers found in the database.' });
      }

      designersToEmail = designers;
    }

    // 4. BLAST EMAILS USING RESEND
    // Format Gemini's plain text output into simple HTML paragraphs
    const paragraphs = emailBody
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p style="margin-bottom: 12px;">${p}</p>`)
      .join('');

    // Determine dynamic base URL for unsubscribe link
    const host = request.headers.get('host') || 'abiertostudio.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Loop through everyone and send individual emails simultaneously
    const emailPromises = designersToEmail.map((designer: any) => {
      const displayName = designer.studio_name && designer.studio_name.trim() !== ''
        ? designer.studio_name
        : designer.first_name;
      const subject = `${displayName} x ${brandName}`;

      // Create a nice HTML wrapper
      const htmlBody = `
        <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
          <p style="margin-bottom: 24px;">Hi ${designer.first_name},</p>
          ${paragraphs}
          
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #666; display: block;">
            <span style="font-weight: bold; font-size: 14px; letter-spacing: -0.5px; color: #111; margin-right: 12px; vertical-align: middle;">abiertostudio.</span>
            <a href="${baseUrl}/api/unsubscribe?email=${encodeURIComponent(designer.email)}" style="color: #666; text-decoration: underline; vertical-align: middle;">unsubscribe</a>
          </div>
        </div>
      `;

      return resend.emails.send({
        from: 'Abierto Briefs <hello@abiertostudio.com>',
        to: designer.email,
        subject,
        html: htmlBody,
      });
    });

    // Wait for all emails to finish sending
    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      sentCount: designersToEmail.length,
      brandName,
      briefPreview: emailBody.substring(0, 150) + "..."
    });

  } catch (error: any) {
    console.error('Weekly Blast Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
