import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'mock_url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock_key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    if (supabaseUrl === 'mock_url' || supabaseKey === 'mock_key') {
      return NextResponse.json({ error: 'Missing API keys in Environment.' }, { status: 500 });
    }

    // Delete the designer from the 'designers' table to unsubscribe them
    const { error: dbError } = await supabase
      .from('designers')
      .delete()
      .eq('email', email);

    if (dbError) throw dbError;

    // Return a nice success HTML page
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed</title>
      </head>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9f9f9; color: #111;">
        <div style="text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 400px; width: 100%;">
          <h1 style="margin-top: 0; font-size: 24px; margin-bottom: 12px;">Unsubscribed Successfully</h1>
          <p style="color: #666; line-height: 1.5; margin-bottom: 24px;">
            The email address <strong>${email}</strong> has been removed from our list. You will no longer receive weekly briefs.
          </p>
          <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #111; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Return Home</a>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    console.error('Unsubscribe Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
