import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, date, time, partySize, specialRequests } = await req.json();

    if (!name || !email || !date || !time || !partySize) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: 'Rebar Website <noreply@rebarpr.com>',
        to: ['rebargastronomia@gmail.com'],
        replyTo: email,
        subject: `[Rebar] New Reservation — ${name} · ${date} at ${time} · Party of ${partySize}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Date: ${date}`,
          `Time: ${time}`,
          `Party Size: ${partySize}`,
          `Special Requests: ${specialRequests || 'None'}`,
        ].join('\n'),
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#c8922a">New Reservation Request — Rebar</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#888;width:130px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
              <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888">Date</td><td style="padding:8px 0">${date}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Time</td><td style="padding:8px 0">${time}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Party Size</td><td style="padding:8px 0">${partySize}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Special Requests</td><td style="padding:8px 0">${specialRequests || 'None'}</td></tr>
            </table>
          </div>
        `,
      });
    } else {
      console.warn('[Reservation API] RESEND_API_KEY not set — email not sent. Reservation:', { name, email, date, time, partySize, specialRequests });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Reservation API] Error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

