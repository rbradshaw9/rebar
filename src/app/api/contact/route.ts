import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: 'Rebar Website <noreply@rebarpr.com>',
        to: ['rebargastronomia@gmail.com'],
        replyTo: email,
        subject: `[Rebar Website] ${subject ?? 'General Inquiry'} — from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || 'Not provided'}`,
          `Subject: ${subject || 'General Inquiry'}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#c8922a">New Contact Form Submission — Rebar</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#888;width:100px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
              <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0">${phone || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0">${subject || 'General Inquiry'}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <h3 style="color:#333">Message</h3>
            <p style="white-space:pre-wrap;background:#f9f9f9;padding:16px;border-radius:4px">${message}</p>
          </div>
        `,
      });
    } else {
      console.warn('[Contact API] RESEND_API_KEY not set — email not sent. Form data:', { name, email, phone, subject, message });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contact API] Error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
