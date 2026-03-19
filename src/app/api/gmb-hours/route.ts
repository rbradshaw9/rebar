import { NextResponse } from 'next/server';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { DAYS, GMB_DAY, parseHoursFromSettings } from '@/lib/formatHours';

/**
 * GET /api/gmb-hours
 *
 * Returns business hours in Google Business Profile API format.
 * Ready to pipe into a locations.patch call once OAuth credentials are configured.
 *
 * GMB API reference:
 * https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations#BusinessHours
 */
export async function GET() {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .like('key', 'hours_%');

    if (error) throw error;

    const settingsMap: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => {
      settingsMap[r.key] = r.value;
    });

    const parsed = parseHoursFromSettings(settingsMap);

    // Build GMB periods array — skip closed days
    const periods = DAYS
      .filter(day => !parsed[day].closed)
      .map(day => ({
        openDay:   GMB_DAY[day],
        openTime:  { hours: parseInt(parsed[day].open.split(':')[0], 10),  minutes: parseInt(parsed[day].open.split(':')[1],  10) },
        closeDay:  GMB_DAY[day],
        closeTime: { hours: parseInt(parsed[day].close.split(':')[0], 10), minutes: parseInt(parsed[day].close.split(':')[1], 10) },
      }));

    // Check if GMB credentials are configured
    const gmbReady = !!(
      process.env.GOOGLE_GMB_LOCATION_ID &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_REFRESH_TOKEN
    );

    return NextResponse.json({
      gmbReady,
      locationId: process.env.GOOGLE_GMB_LOCATION_ID ?? null,
      // Exact payload for: PATCH https://mybusinessbusinessinformation.googleapis.com/v1/{name}
      // with updateMask=regularHours
      regularHours: { periods },
    });
  } catch (err) {
    console.error('[GMB Hours API]', err);
    return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
  }
}

/**
 * POST /api/gmb-hours
 *
 * Pushes hours to Google My Business.
 * Requires env vars: GOOGLE_GMB_LOCATION_ID, GOOGLE_CLIENT_ID,
 * GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 */
export async function POST() {
  const locationId   = process.env.GOOGLE_GMB_LOCATION_ID;
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!locationId || !clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({
      ok: false,
      error: 'Google credentials not configured. Set GOOGLE_GMB_LOCATION_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in your Vercel environment variables.',
    }, { status: 503 });
  }

  // TODO: When credentials are added:
  // 1. POST to https://oauth2.googleapis.com/token to exchange refreshToken for accessToken
  // 2. Fetch hours from /api/gmb-hours (GET) to get the periods payload
  // 3. PATCH https://mybusinessbusinessinformation.googleapis.com/v1/{locationId}
  //    body: { regularHours: { periods } }, query: updateMask=regularHours
  return NextResponse.json(
    { ok: false, error: 'Push implementation pending — add Google OAuth credentials to enable.' },
    { status: 501 }
  );
}
