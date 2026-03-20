import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase & Resend
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, portfolioLink, message } = data;

    let formattedLink = portfolioLink;
    if (formattedLink && !formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = 'https://' + formattedLink;
    }

    // 1. Insert into Supabase
    const { error: dbError } = await supabase
      .from('submissions')
      .insert([
        { 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          portfolio_link: formattedLink, 
          message,
          created_at: new Date().toISOString()
        }
      ]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // 2. Send Email via Resend
    // Typically emails must be sent from a verified domain on Resend. 
    // Usually 'onboarding@resend.dev' works for testing to your verified email.
    const { error: emailError } = await resend.emails.send({
      from: 'Abierto Submissions <onboarding@resend.dev>',
      to: 'hello@abiertostudio.com', // Sending the notification to the owner
      subject: `New Showcase Submission: ${firstName} ${lastName}`,
      html: `
        <h2 style="font-family: sans-serif;">New Showcase Submission!</h2>
        <p style="font-family: sans-serif; font-size: 16px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p style="font-family: sans-serif; font-size: 16px;"><strong>Email:</strong> ${email}</p>
        <p style="font-family: sans-serif; font-size: 16px;"><strong>Link:</strong> <a href="${formattedLink}">${formattedLink}</a></p>
        <p style="font-family: sans-serif; font-size: 16px;"><strong>Message:</strong><br/>${message || 'No message provided.'}</p>
      `,
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      // We log the error but still return success to the user since the DB save worked
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
