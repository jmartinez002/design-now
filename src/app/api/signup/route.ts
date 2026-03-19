import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.SUPABASE_URL || 'mock_url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock_key ';
const resendApiKey = process.env.RESEND_API_KEY || 'mock_key';

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, studioName } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (supabaseUrl !== 'mock_url') {
      const { error: dbError } = await supabase
        .from('designers')
        .insert([{ first_name: firstName, last_name: lastName, email, studio_name: studioName }]);

      if (dbError) throw dbError;
    }

    if (resendApiKey !== 'mock_key') {
      await resend.emails.send({
        from: 'Abierto Briefs <hello@abiertostudio.com>',
        to: email,
        subject: 'You’re in. Your first brief lands Sunday.',
        html: `<p>Hi ${firstName},</p><p>Welcome to Abierto Briefs. Be ready!</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
